<?php

namespace Tests\Feature;

use App\Events\QuoteRequestCreated;
use App\Jobs\SendLeadToLeadsApp;
use App\Models\ContactSubmission;
use App\Models\QuoteRequest;
use App\Models\Service;
use App\Services\BrevoService;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class TurnstileTest extends TestCase
{
    use DatabaseMigrations;

    protected function setUp(): void
    {
        parent::setUp();
        config([
            'services.turnstile.enabled' => true,
            'services.turnstile.secret' => 'test-secret',
            'services.turnstile.verify_url' => 'https://verify.example.test/check',
            'services.leads_app.enabled' => true,
            'services.crm.enabled' => false,
        ]);
        Queue::fake();
        Http::preventStrayRequests();
    }

    private function payload(string $type): array
    {
        $data = ['first_name' => 'Ada', 'last_name' => 'Test', 'email' => 'ada@example.test', 'phone' => '123', 'message' => 'Een testaanvraag.', 'locale' => 'nl', 'turnstile_token' => 'test-token'];
        if ($type === 'contact') {
            return $data + ['privacy_accepted' => true];
        }
        $service = Service::withoutEvents(fn () => Service::create(['name' => ['nl' => 'Isolatie'], 'slug' => ['nl' => 'isolatie'], 'badge' => ['nl' => 'Isolatie'], 'is_active' => true]));

        return $data + ['privacy_consent' => true, 'service_ids' => [$service->id], 'street' => 'Straat', 'house_number' => '1', 'postcode' => '9220', 'city' => 'Hamme'];
    }

    private function endpoint(string $type): string
    {
        return $type === 'contact' ? '/api/contact-submissions' : '/api/quote-requests';
    }

    public static function acceptedCases(): array
    {
        return [['contact', false], ['quote', false], ['contact', true], ['quote', true]];
    }

    #[DataProvider('acceptedCases')]
    public function test_valid_or_disabled_preserves_existing_flow(string $type, bool $enabled): void
    {
        config(['services.turnstile.enabled' => $enabled]);
        $payload = $this->payload($type);
        if (! $enabled) {
            unset($payload['turnstile_token']);
        }
        $this->mock(BrevoService::class)->shouldReceive('send')->times($type === 'contact' ? 1 : 2);
        Http::fake(function (Request $request, array $options) {
            $this->assertSame('https://verify.example.test/check', $request->url());
            $this->assertSame(['secret' => 'test-secret', 'response' => 'test-token'], $request->data());
            $this->assertTrue($request->hasHeader('Content-Type', 'application/x-www-form-urlencoded'));
            $this->assertSame(10, $options['timeout']);
            $this->assertSame(0, ContactSubmission::count() + QuoteRequest::count());
            Queue::assertNotPushed(SendLeadToLeadsApp::class);

            return Http::response(['success' => true]);
        });
        $this->postJson($this->endpoint($type), $payload)->assertCreated()->assertJsonPath('success', true);
        $this->assertDatabaseCount($type === 'contact' ? 'contact_submissions' : 'quote_requests', 1);
        if ($type === 'quote') {
            $this->assertSame($payload['service_ids'], QuoteRequest::sole()->services->pluck('id')->all());
        }
        Queue::assertPushed(SendLeadToLeadsApp::class, 1);
        Http::assertSentCount($enabled ? 1 : 0);
    }

    public static function rejectedCases(): array
    {
        $cases = [];
        foreach (['contact', 'quote'] as $type) {
            foreach (['false', 'string', 'missing', 'array', 'expired', 'secret', 'timeout', 'server', 'malformed'] as $reason) {
                $cases["$type-$reason"] = [$type, $reason];
            }
        }

        return $cases;
    }

    #[DataProvider('rejectedCases')]
    public function test_rejection_prevents_all_processing(string $type, string $reason): void
    {
        $payload = $this->payload($type);
        $this->mock(BrevoService::class)->shouldNotReceive('send');
        Event::fake([QuoteRequestCreated::class]);
        if ($reason === 'secret') {
            config(['services.turnstile.secret' => '']);
        }
        if ($reason === 'missing') {
            unset($payload['turnstile_token']);
        }
        if ($reason === 'array') {
            $payload['turnstile_token'] = ['invalid'];
        }
        Http::fake(match ($reason) {
            'timeout' => Http::failedConnection('private details'),
            'server' => Http::response(['success' => true], 500),
            'string' => Http::response(['success' => 'true']),
            'malformed' => Http::response('not JSON'),
            'expired' => Http::response(['success' => false, 'error-codes' => ['timeout-or-duplicate']]),
            default => Http::response(['success' => false]),
        });
        $this->postJson($this->endpoint($type), $payload)->assertStatus(422)->assertJsonValidationErrors('turnstile_token');
        $this->assertDatabaseCount('contact_submissions', 0);
        $this->assertDatabaseCount('quote_requests', 0);
        $this->assertSame(0, DB::table('quote_request_service')->count());
        Event::assertNotDispatched(QuoteRequestCreated::class);
        Queue::assertNotPushed(SendLeadToLeadsApp::class);
        if (in_array($reason, ['missing', 'array', 'secret'], true)) {
            Http::assertNothingSent();
        }
    }

    public function test_existing_validation_runs_before_cloudflare(): void
    {
        $this->postJson('/api/contact-submissions', [])->assertUnprocessable()->assertJsonValidationErrors('email');
        $this->postJson('/api/quote-requests', [])->assertUnprocessable()->assertJsonValidationErrors('service_ids');
        Http::assertNothingSent();
        Queue::assertNotPushed(SendLeadToLeadsApp::class);
    }
}
