<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

final class TurnstileService
{
    public function verify(mixed $token): bool
    {
        if (! config('services.turnstile.enabled')) {
            return true;
        }

        $secret = config('services.turnstile.secret');
        $url = config('services.turnstile.verify_url');
        if (! is_string($secret) || blank($secret) || ! is_string($url) || blank($url)) {
            Log::error('Turnstile configuration is incomplete.');

            return false;
        }
        if (! is_string($token) || blank($token) || strlen($token) > 2048) {
            return false;
        }

        try {
            $response = Http::asForm()->acceptJson()->connectTimeout(5)->timeout(10)->withoutRedirecting()
                ->post($url, ['secret' => $secret, 'response' => $token]);

            return $response->successful() && $response->json('success') === true;
        } catch (Throwable) {
            return false;
        }
    }

    public function failureMessage(string $locale): string
    {
        return match ($locale) {
            'fr' => 'Le contrôle de sécurité a échoué. Veuillez réessayer.',
            'en' => 'The security check failed. Please try again.',
            default => 'De beveiligingscontrole is mislukt. Probeer opnieuw.',
        };
    }
}
