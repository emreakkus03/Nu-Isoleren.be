<?php

namespace Tests\Feature;

use App\Models\JobApplication;
use App\Models\Vacancy;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class RecruitmentCorsTest extends TestCase
{
    use DatabaseMigrations;

    private const BREVO_URL = 'https://api.brevo.com/v3/smtp/email';

    private array $brevoStatuses = [201];

    private const ORIGIN = 'https://www.nu-isoleren.be';

    protected function setUp(): void
    {
        parent::setUp();
        config(['services.turnstile.enabled' => false, 'recruitment.to' => 'recruitment@example.test', 'mail.default' => 'smtp']);
        Mail::fake();
        config([
            'services.brevo.enabled' => true, 'services.brevo.api_key' => 'fake-brevo-key',
            'services.brevo.sender.email' => 'verified@example.test', 'services.brevo.sender.name' => 'Verified sender',
        ]);
        Http::fake([self::BREVO_URL => function () {
            $status = count($this->brevoStatuses) > 1 ? array_shift($this->brevoStatuses) : $this->brevoStatuses[0];

            return Http::response(['messageId' => 'fake-message'], $status);
        }]);
        Queue::fake();
        Http::preventStrayRequests();
    }

    private function payload(array $extra = []): array
    {
        return array_replace([
            'first_name' => 'Ada', 'last_name' => 'Test', 'email' => 'ada@example.test',
            'phone' => '123', 'city' => 'Teststad', 'linkedin_url' => 'https://www.linkedin.com/in/test',
            'locale' => 'nl', 'privacy_accepted' => true, 'answers' => [],
        ], $extra);
    }

    public static function publicEndpoints(): array
    {
        return [['/api/vacancies/1/applications'], ['/api/contact-submissions'], ['/api/quote-requests']];
    }

    public function test_cors_configuration_covers_public_api_without_wildcard_origins_or_credentials(): void
    {
        $this->assertContains('api/*', config('cors.paths'));
        $this->assertContains(self::ORIGIN, config('cors.allowed_origins'));
        $this->assertNotContains('*', config('cors.allowed_origins'));
        $this->assertSame([], config('cors.allowed_origins_patterns'));
        $this->assertFalse(config('cors.supports_credentials'));
    }

    #[DataProvider('publicEndpoints')]
    public function test_preflight_allows_frontend_post(string $path): void
    {
        $response = $this->withHeaders([
            'Origin' => self::ORIGIN,
            'Access-Control-Request-Method' => 'POST',
            'Access-Control-Request-Headers' => 'content-type,accept',
        ])->options($path);
        $response->assertNoContent()->assertHeader('Access-Control-Allow-Origin', self::ORIGIN)
            ->assertHeaderMissing('Access-Control-Allow-Credentials');
        $this->assertStringContainsString('POST', $response->headers->get('Access-Control-Allow-Methods'));
        $this->assertStringContainsString('content-type', strtolower($response->headers->get('Access-Control-Allow-Headers')));
    }

    #[DataProvider('publicEndpoints')]
    public function test_untrusted_origin_is_not_granted_access(string $path): void
    {
        $origin = 'https://untrusted.example';
        $response = $this->withHeaders(['Origin' => $origin, 'Access-Control-Request-Method' => 'POST'])->options($path);
        $this->assertNotSame($origin, $response->headers->get('Access-Control-Allow-Origin'));
        $this->assertNotSame('*', $response->headers->get('Access-Control-Allow-Origin'));
        $response->assertHeaderMissing('Access-Control-Allow-Credentials');
    }

    #[DataProvider('publicEndpoints')]
    public function test_validation_response_has_cors_headers_without_side_effects(string $path): void
    {
        Vacancy::factory()->create(['id' => 1]);
        Queue::fake();
        $this->postJson($path, [], ['Origin' => self::ORIGIN])->assertUnprocessable()
            ->assertHeader('Access-Control-Allow-Origin', self::ORIGIN);
        $this->assertDatabaseCount('job_applications', 0);
        Http::assertNotSent(fn (Request $request): bool => $request->url() === self::BREVO_URL);
        Queue::assertNothingPushed();
    }

    public function test_missing_and_closed_vacancies_have_cors_headers(): void
    {
        $this->postJson('/api/vacancies/999999/applications', $this->payload(), ['Origin' => self::ORIGIN])
            ->assertNotFound()->assertHeader('Access-Control-Allow-Origin', self::ORIGIN);
        $vacancy = Vacancy::factory()->create(['status' => 'closed']);
        $this->postJson("/api/vacancies/{$vacancy->id}/applications", $this->payload(), ['Origin' => self::ORIGIN])
            ->assertUnprocessable()->assertHeader('Access-Control-Allow-Origin', self::ORIGIN);
        Http::assertNotSent(fn (Request $request): bool => $request->url() === self::BREVO_URL);
    }

    public function test_turnstile_failure_has_cors_headers_and_no_application_or_mail(): void
    {
        config(['services.turnstile.enabled' => true, 'services.turnstile.secret' => 'fake-test-secret']);
        Http::fake([config('services.turnstile.verify_url') => Http::response(['success' => false])]);
        $vacancy = Vacancy::factory()->create();
        Queue::fake();
        $this->postJson("/api/vacancies/{$vacancy->id}/applications", $this->payload(['turnstile_token' => 'fake-token']), ['Origin' => self::ORIGIN])
            ->assertUnprocessable()->assertHeader('Access-Control-Allow-Origin', self::ORIGIN);
        $this->assertDatabaseCount('job_applications', 0);
        Http::assertNotSent(fn (Request $request): bool => $request->url() === self::BREVO_URL);
        Queue::assertNothingPushed();
    }

    public function test_multipart_submission_with_turnstile_answers_and_mail_is_successful_cross_origin(): void
    {
        config(['services.turnstile.enabled' => true, 'services.turnstile.secret' => 'fake-test-secret']);
        Http::fake([config('services.turnstile.verify_url') => Http::response(['success' => true])]);
        $vacancy = Vacancy::factory()->create();
        $question = $vacancy->questions()->create([
            'type' => 'yes_no', 'question' => ['nl' => 'Ervaring?'], 'required' => true,
            'active' => true, 'sort_order' => 1, 'options' => [],
        ]);
        $this->post("/api/vacancies/{$vacancy->id}/applications", $this->payload([
            'answers' => json_encode([$question->id => true]), 'turnstile_token' => 'fake-token',
        ]), ['Origin' => self::ORIGIN, 'Accept' => 'application/json'])
            ->assertCreated()->assertJsonPath('success', true)->assertHeader('Access-Control-Allow-Origin', self::ORIGIN);
        $application = JobApplication::sole();
        $this->assertTrue($application->answers->sole()->value);
        $this->assertNotNull($application->privacy_accepted_at);
        $this->assertSame('sent', $application->internal_mail_status);
        Http::assertSent(fn (Request $request): bool => $request->url() === self::BREVO_URL && $request['to'][0]['email'] === 'recruitment@example.test');
        Http::assertSent(fn (Request $request): bool => $request->url() === self::BREVO_URL && $request['to'][0]['email'] === 'ada@example.test');
        Http::assertSent(fn ($request): bool => $request->url() === config('services.turnstile.verify_url') && $request['response'] === 'fake-token' && $request['secret'] === 'fake-test-secret');
    }

    public function test_mail_failure_response_has_cors_headers_and_preserves_application(): void
    {
        $this->brevoStatuses = [503];
        $vacancy = Vacancy::factory()->create();
        $this->postJson("/api/vacancies/{$vacancy->id}/applications", $this->payload(), ['Origin' => self::ORIGIN])
            ->assertStatus(503)->assertJsonPath('recorded', true)->assertHeader('Access-Control-Allow-Origin', self::ORIGIN);
        $this->assertSame('failed', JobApplication::sole()->internal_mail_status);
    }
}
