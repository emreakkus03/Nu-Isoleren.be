<?php

namespace Tests\Feature;

use App\Services\BrevoService;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class BrevoServiceTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config([
            'services.brevo.enabled' => true,
            'services.brevo.api_key' => 'fake-brevo-key',
            'services.brevo.sender.email' => 'verified@example.test',
            'services.brevo.sender.name' => 'Verified sender',
        ]);
        Http::preventStrayRequests();
        Http::fake(['https://api.brevo.com/v3/smtp/email' => Http::response(['messageId' => 'fake-message'], 201)]);
    }

    public function test_existing_signature_preserves_payload_without_attachments(): void
    {
        app(BrevoService::class)->send(
            ['email' => 'recipient@example.test', 'name' => 'Recipient'],
            'Existing subject',
            '<p>Existing body</p>',
            'Existing body',
            ['email' => 'reply@example.test', 'name' => 'Reply'],
            ['contact-submission', 'admin'],
        );
        Http::assertSent(function (Request $request): bool {
            $this->assertSame([
                'sender' => ['email' => 'verified@example.test', 'name' => 'Verified sender'],
                'to' => [['email' => 'recipient@example.test', 'name' => 'Recipient']],
                'subject' => 'Existing subject', 'htmlContent' => '<p>Existing body</p>',
                'textContent' => 'Existing body',
                'replyTo' => ['email' => 'reply@example.test', 'name' => 'Reply'],
                'tags' => ['contact-submission', 'admin'],
            ], $request->data());

            return $request->url() === 'https://api.brevo.com/v3/smtp/email'
                && $request->hasHeader('api-key', 'fake-brevo-key');
        });
        Http::assertSentCount(1);
    }

    public function test_disabled_brevo_keeps_existing_callers_noop_behavior(): void
    {
        config(['services.brevo.enabled' => false]);
        app(BrevoService::class)->send(['email' => 'recipient@example.test'], 'Subject', '<p>Body</p>');
        Http::assertNothingSent();
    }
}
