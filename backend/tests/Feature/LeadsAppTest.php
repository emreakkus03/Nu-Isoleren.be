<?php

namespace Tests\Feature;

use App\Jobs\SendLeadToLeadsApp;
use App\Models\ContactSubmission;
use App\Models\QuoteRequest;
use App\Models\Service;
use App\Services\BrevoService;
use App\Services\LeadsAppClient;
use App\Services\LeadsAppDispatch;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Http\Client\Request;
use Illuminate\Queue\QueueManager;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Queue;
use PHPUnit\Framework\Attributes\DataProvider;
use RuntimeException;
use Tests\TestCase;

class LeadsAppTest extends TestCase
{
    use DatabaseMigrations;

    private QueueManager $queueManager;

    protected function setUp(): void
    {
        parent::setUp();
        config([
            'services.leads_app.enabled' => true,
            'services.leads_app.url' => 'https://crm.example.test/leads',
            'services.leads_app.user' => 'test-api-user',
            'services.leads_app.pass' => 'test-api-password',
            'services.leads_app.sender' => 'test-configured-sender',
            'services.crm.enabled' => false,
            'queue.default' => 'sync',
        ]);
        Http::preventStrayRequests();
        $this->queueManager = app('queue');
        Queue::fake();
        $this->mock(BrevoService::class)->shouldReceive('send')->andReturnNull();
    }

    public static function forms(): array
    {
        return [['contact'], ['quote']];
    }

    private function payload(string $type, ?string $message = 'Dit is mijn vraag.'): array
    {
        $payload = ['first_name' => 'Ada', 'last_name' => 'Tester', 'email' => 'ada@example.test', 'phone' => '+32000000000', 'message' => $message, 'locale' => 'nl'];
        if ($type === 'contact') {
            return $payload + ['privacy_accepted' => true];
        }
        $ids = Service::withoutEvents(function (): array {
            return collect(['Spouwmuurisolatie', 'Crepi'])->map(fn (string $name): int => Service::create([
                'name' => ['nl' => $name, 'fr' => 'FR '.$name],
                'slug' => ['nl' => strtolower($name)],
                'is_active' => true,
                'badge' => ['nl' => 'Isolatie'],
            ])->id)->all();
        });

        return $payload + ['privacy_consent' => true, 'street' => 'Teststraat', 'house_number' => '12 A', 'postcode' => '9220', 'city' => 'Hamme', 'service_ids' => $ids];
    }

    private function endpoint(string $type): string
    {
        return $type === 'contact' ? '/api/contact-submissions' : '/api/quote-requests';
    }

    private function lead(string $type): ContactSubmission|QuoteRequest
    {
        return $type === 'contact' ? ContactSubmission::sole() : QuoteRequest::sole();
    }

    #[DataProvider('forms')]
    public function test_enabled_flow_keeps_storage_emails_and_response_and_queues_once(string $type): void
    {
        $this->mock(BrevoService::class)->shouldReceive('send')->times($type === 'contact' ? 1 : 2)->andReturnNull();
        $payload = $this->payload($type);
        $response = $this->postJson($this->endpoint($type), $payload)->assertCreated()->assertJsonPath('success', true);
        $lead = $this->lead($type);
        $this->assertSame($payload['email'], $lead->email);
        $this->assertSame('new', $lead->status);
        if ($lead instanceof QuoteRequest) {
            $this->assertSame($payload['service_ids'], $lead->services->pluck('id')->all());
            $this->assertStringStartsWith('OFF-', $lead->reference);
            $response->assertJsonPath('data.reference', $lead->reference)->assertJsonCount(2, 'data.services');
        } else {
            $response->assertJsonPath('id', $lead->id);
        }
        Queue::assertPushed(SendLeadToLeadsApp::class, fn ($job): bool => $job->id === $lead->id && $job->type === $type && $job->afterCommit === true && $job->tries === 1 && $job->timeout === 20 && $job->failOnTimeout);
        Queue::assertPushed(SendLeadToLeadsApp::class, 1);
        Http::assertNothingSent();
    }

    #[DataProvider('forms')]
    public function test_disabled_does_not_dispatch_or_send(string $type): void
    {
        config(['services.leads_app.enabled' => false]);
        $this->postJson($this->endpoint($type), $this->payload($type))->assertCreated();
        Queue::assertNotPushed(SendLeadToLeadsApp::class);
        (new SendLeadToLeadsApp($type, $this->lead($type)->id))->handle(app(LeadsAppClient::class));
        Http::assertNothingSent();
    }

    #[DataProvider('forms')]
    public function test_exact_payload_headers_url_and_timeout(string $type): void
    {
        $this->postJson($this->endpoint($type), $this->payload($type))->assertCreated();
        Http::fake(function (Request $request, array $options) use ($type) {
            $this->assertSame(10, $options['timeout']);
            $this->assertFalse($options['allow_redirects']);
            $this->assertSame('https://crm.example.test/leads', $request->url());
            $this->assertSame('POST', $request->method());
            $this->assertTrue($request->hasHeader('Api-Key', 'test-api-user'));
            $this->assertTrue($request->hasHeader('Api-Password', 'test-api-password'));
            $this->assertTrue($request->hasHeader('Accept', 'application/json'));
            $this->assertTrue($request->hasHeader('Content-Type', 'application/json'));
            $this->assertSame([
                'name' => 'Ada Tester', 'email' => 'ada@example.test', 'phone' => '+32000000000', 'company' => '',
                'address' => $type === 'quote' ? 'Teststraat 12 A' : '',
                'postal' => $type === 'quote' ? '9220' : '', 'place' => $type === 'quote' ? 'Hamme' : '',
                'message' => $type === 'quote' ? "Diensten: Spouwmuurisolatie, Crepi\n\nOpmerking:\nDit is mijn vraag." : 'Dit is mijn vraag.',
                'sender' => 'test-configured-sender',
            ], $request->data());

            return Http::response([], 201);
        });
        (new SendLeadToLeadsApp($type, $this->lead($type)->id))->handle(app(LeadsAppClient::class));
        Http::assertSentCount(1);
    }

    public function test_quote_without_comment_and_translated_service_names(): void
    {
        Http::fake();
        $payload = $this->payload('quote', null);
        $payload['locale'] = 'fr';
        $this->postJson($this->endpoint('quote'), $payload)->assertCreated();
        (new SendLeadToLeadsApp('quote', QuoteRequest::sole()->id))->handle(app(LeadsAppClient::class));
        Http::assertSent(fn (Request $request): bool => $request['message'] === 'Diensten: FR Spouwmuurisolatie, FR Crepi');
    }

    #[DataProvider('forms')]
    public function test_commit_dispatch_and_rollback_exclusion(string $type): void
    {
        DB::beginTransaction();
        $this->postJson($this->endpoint($type), $this->payload($type))->assertCreated();
        Queue::assertNotPushed(SendLeadToLeadsApp::class);
        DB::commit();
        Queue::assertPushed(SendLeadToLeadsApp::class, 1);
        Queue::fake();
        DB::beginTransaction();
        app(LeadsAppDispatch::class)->dispatch($this->lead($type));
        DB::rollBack();
        Queue::assertNotPushed(SendLeadToLeadsApp::class);
    }

    #[DataProvider('forms')]
    public function test_crm_failure_never_changes_successful_form_response_or_local_data(string $type): void
    {
        $payload = $this->payload($type);
        Queue::swap($this->queueManager);
        Http::fake(fn () => Http::response('sensitive upstream body', 500));
        Log::spy();
        $this->postJson($this->endpoint($type), $payload)->assertCreated()->assertJsonPath('success', true);
        $lead = $this->lead($type);
        $this->assertSame($payload['email'], $lead->email);
        if ($lead instanceof QuoteRequest) {
            $this->assertCount(2, $lead->services);
        }
        Http::assertSentCount(1);
        Log::shouldHaveReceived('warning')->with('Leads App delivery failed; verify delivery before any manual retry.', ['type' => $type, 'id' => $lead->id])->once();
    }

    #[DataProvider('forms')]
    public function test_queue_failure_after_commit_does_not_fail_response(string $type): void
    {
        Bus::shouldReceive('dispatch')->once()->andThrow(new RuntimeException('private queue connection details'));
        DB::beginTransaction();
        $this->postJson($this->endpoint($type), $this->payload($type))->assertCreated();
        DB::commit();
        $this->assertNotNull($this->lead($type));
    }

    #[DataProvider('forms')]
    public function test_timeout_keeps_response_and_local_lead(string $type): void
    {
        $payload = $this->payload($type);
        Queue::swap($this->queueManager);
        Http::fake(Http::failedConnection('private timeout details'));
        $this->postJson($this->endpoint($type), $payload)->assertCreated();
        $this->assertSame($payload['email'], $this->lead($type)->email);
    }

    public function test_contact_without_phone_sends_empty_string(): void
    {
        $payload = $this->payload('contact');
        unset($payload['phone']);
        $this->postJson($this->endpoint('contact'), $payload)->assertCreated();
        Http::fake();
        (new SendLeadToLeadsApp('contact', ContactSubmission::sole()->id))->handle(app(LeadsAppClient::class));
        Http::assertSent(fn (Request $request): bool => $request['phone'] === '');
    }

    public static function failures(): array
    {
        return [[302], [400], [429], [500], [0]];
    }

    #[DataProvider('failures')]
    public function test_no_retry_and_only_2xx_success_with_sanitized_errors(int $status): void
    {
        $this->postJson($this->endpoint('contact'), $this->payload('contact'))->assertCreated();
        Http::fake($status === 0 ? Http::failedConnection('private transport details') : Http::response('private response body', $status));
        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('Leads App delivery failed; verify delivery before any manual retry.');
        try {
            (new SendLeadToLeadsApp('contact', ContactSubmission::sole()->id))->handle(app(LeadsAppClient::class));
        } finally {
            $this->assertSame(1, ContactSubmission::count());
            if ($status !== 0) {
                Http::assertSentCount(1);
            }
        }
    }

    #[DataProvider('forms')]
    public function test_invalid_form_does_not_dispatch(string $type): void
    {
        $this->postJson($this->endpoint($type), [])->assertUnprocessable();
        Queue::assertNotPushed(SendLeadToLeadsApp::class);
        Http::assertNothingSent();
    }

    public function test_missing_credentials_fail_without_http_request(): void
    {
        $this->postJson($this->endpoint('contact'), $this->payload('contact'))->assertCreated();
        config(['services.leads_app.pass' => null]);
        try {
            (new SendLeadToLeadsApp('contact', ContactSubmission::sole()->id))->handle(app(LeadsAppClient::class));
            $this->fail('Missing credentials must fail.');
        } catch (RuntimeException $exception) {
            $this->assertNull($exception->getPrevious());
            Http::assertNothingSent();
        }
    }
}
