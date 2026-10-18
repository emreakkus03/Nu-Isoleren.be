<?php

namespace Tests\Feature;

use App\Models\ContactSubmission;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class ContactSubmissionCityTest extends TestCase
{
    use DatabaseMigrations;

    protected function setUp(): void
    {
        parent::setUp();
        config([
            'services.turnstile.enabled' => false,
            'services.leads_app.enabled' => false,
            'services.brevo.enabled' => true,
            'services.brevo.api_key' => 'test-key',
            'services.brevo.sender.email' => 'sender@example.test',
            'services.brevo.sender.name' => 'Test sender',
            'services.brevo.admin.email' => 'admin@example.test',
            'services.brevo.admin.name' => 'Test admin',
        ]);
        Queue::fake();
        Http::preventStrayRequests();
        Http::fake(['https://api.brevo.com/v3/smtp/email' => Http::response(['messageId' => 'test-message'], 201)]);
    }

    private function payload(): array
    {
        return ['first_name' => 'Ada', 'last_name' => 'Test', 'email' => 'ada@example.test', 'phone' => '123',
            'city' => '  Sint-Niklaas  ', 'message' => 'Ik heb een vraag over isolatie.', 'locale' => 'nl', 'privacy_accepted' => true];
    }

    public function test_city_is_trimmed_stored_and_rendered_in_existing_brevo_admin_mail(): void
    {
        $this->postJson('/api/contact-submissions', $this->payload())->assertCreated()->assertJsonPath('success', true);
        $this->assertDatabaseHas('contact_submissions', ['email' => 'ada@example.test', 'city' => 'Sint-Niklaas']);
        Http::assertSent(function (Request $request): bool {
            $this->assertSame('admin@example.test', $request['to'][0]['email']);
            $this->assertSame('ada@example.test', $request['replyTo']['email']);
            $this->assertStringContainsString('Woonplaats', $request['htmlContent']);
            $this->assertStringContainsString('Sint-Niklaas', $request['htmlContent']);
            $this->assertStringContainsString('Ik heb een vraag over isolatie.', $request['htmlContent']);

            return true;
        });
        Http::assertSentCount(1);
    }

    public static function invalidCities(): array
    {
        return [['missing'], [null], [''], [" \t\n "], [123], [['Hamme']], [str_repeat('a', 256)]];
    }

    #[DataProvider('invalidCities')]
    public function test_invalid_city_is_rejected_without_database_mail_or_jobs(mixed $city): void
    {
        $payload = $this->payload();
        if ($city === 'missing') {
            unset($payload['city']);
        } else {
            $payload['city'] = $city;
        }
        $this->postJson('/api/contact-submissions', $payload)->assertUnprocessable()->assertJsonValidationErrors('city');
        $this->assertDatabaseCount('contact_submissions', 0);
        Http::assertNothingSent();
        Queue::assertNothingPushed();
    }

    public function test_city_required_feedback_is_localized(): void
    {
        foreach (['nl' => 'Vul uw woonplaats in.', 'fr' => 'Veuillez indiquer votre ville ou commune.', 'en' => 'Please enter your city or municipality.'] as $locale => $message) {
            $this->postJson('/api/contact-submissions', array_replace($this->payload(), ['locale' => $locale, 'city' => '']))
                ->assertUnprocessable()->assertJsonPath('errors.city.0', $message);
        }
    }

    public function test_migration_preserves_historical_requests_and_timestamps_with_nullable_city(): void
    {
        $payload = $this->payload();
        unset($payload['city'], $payload['privacy_accepted']);
        $submission = ContactSubmission::create($payload + ['privacy_accepted_at' => now(), 'status' => 'new']);
        $before = $submission->getAttributes();
        $migration = require database_path('migrations/2026_10_17_164653_add_city_to_contact_submissions_table.php');
        $migration->down();
        $migration->up();
        $historical = $submission->fresh();
        $this->assertNull($historical->city);
        foreach ($before as $field => $value) {
            $this->assertSame($value, $historical->getRawOriginal($field), $field);
        }
        $this->assertStringContainsString('Niet opgegeven', view('emails.contact-submission', ['submission' => $historical])->render());
    }
}
