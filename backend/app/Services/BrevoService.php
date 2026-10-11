<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use RuntimeException;

class BrevoService
{
    private const ENDPOINT = 'https://api.brevo.com/v3/smtp/email';

    public function enabled(): bool
    {
        return (bool) config('services.brevo.enabled')
            && filled(config('services.brevo.api_key'));
    }

    public function send(
        array $to,
        string $subject,
        string $htmlContent,
        ?string $textContent = null,
        ?array $replyTo = null,
        array $tags = [],
        array $attachments = [],
    ): void {
        if (app()->environment('local')) {
            $this->sendWithLaravelMail(
                to: $to,
                subject: $subject,
                htmlContent: $htmlContent,
                replyTo: $replyTo,
                attachments: $attachments,
            );

            return;
        }

        if (! $this->enabled()) {
            return;
        }

        $this->sendWithBrevo(
            to: $to,
            subject: $subject,
            htmlContent: $htmlContent,
            textContent: $textContent,
            replyTo: $replyTo,
            tags: $tags,
            attachments: $attachments,
        );
    }

    private function sendWithLaravelMail(
        array $to,
        string $subject,
        string $htmlContent,
        ?array $replyTo = null,
        array $attachments = [],
    ): void {
        Mail::html(
            $htmlContent,
            function ($message) use (
                $to,
                $subject,
                $replyTo,
                $attachments
            ) {
                $message
                    ->to(
                        $to['email'],
                        $to['name'] ?? null
                    )
                    ->subject($subject);

                foreach ($attachments as $attachment) {
                    $content = base64_decode($attachment['content'], true);
                    if ($content === false) {
                        throw new RuntimeException('Invalid email attachment encoding');
                    }
                    $message->attachData($content, $attachment['name']);
                }

                if ($replyTo) {
                    $message->replyTo(
                        $replyTo['email'],
                        $replyTo['name'] ?? null
                    );
                }
            }
        );
    }

    private function sendWithBrevo(
        array $to,
        string $subject,
        string $htmlContent,
        ?string $textContent = null,
        ?array $replyTo = null,
        array $tags = [],
        array $attachments = [],
    ): void {
        $payload = [
            'sender' => [
                'email' => config('services.brevo.sender.email'),
                'name' => config('services.brevo.sender.name'),
            ],

            'to' => [
                [
                    'email' => $to['email'],
                    'name' => $to['name'] ?? null,
                ],
            ],

            'subject' => $subject,
            'htmlContent' => $htmlContent,
        ];

        if ($textContent) {
            $payload['textContent'] = $textContent;
        }

        if ($replyTo) {
            $payload['replyTo'] = [
                'email' => $replyTo['email'],
                'name' => $replyTo['name'] ?? null,
            ];
        }

        if ($tags !== []) {
            $payload['tags'] = $tags;
        }

        if ($attachments !== []) {
            $payload['attachment'] = $attachments;
        }

        $response = Http::acceptJson()
            ->withHeaders([
                'api-key' => config('services.brevo.api_key'),
            ])
            ->timeout(15)
            ->retry(3, 500)
            ->post(self::ENDPOINT, $payload);

        if ($response->failed()) {
            throw new RuntimeException(
                'Brevo email failed: '.$response->body()
            );
        }
    }
}
