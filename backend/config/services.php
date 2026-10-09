<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Resend, Postmark, AWS, and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'brevo' => [
        'enabled' => env('BREVO_ENABLED', false),
        'api_key' => env('BREVO_API_KEY'),

        'sender' => [
            'email' => env('BREVO_SENDER_EMAIL'),
            'name' => env('BREVO_SENDER_NAME', 'Nu-Isoleren'),
        ],

        'admin' => [
            'email' => env('BREVO_ADMIN_EMAIL'),
            'name' => env('BREVO_ADMIN_NAME', 'Nu-Isoleren'),
        ],
    ],

    'filament_url' => env('FILAMENT_URL'),
    'crm' => [
        'enabled' => env('CRM_ENABLED', false),
        'webhook_url' => env('CRM_WEBHOOK_URL'),
        'webhook_secret' => env('CRM_WEBHOOK_SECRET'),
        'timeout' => (int) env('CRM_TIMEOUT', 10),
    ],

    'leads_app' => [
        'enabled' => env('LEADS_APP_ENABLED', false),
        'url' => env('LEADS_APP_URL', 'https://app.nu-isoleren.be/api/v1/new_leads'),
        'user' => env('LEADS_APP_USER'),
        'pass' => env('LEADS_APP_PASS'),
        'sender' => env('LEADS_APP_SENDER'),
    ],

    'turnstile' => [
        'enabled' => env('TURNSTILE_ENABLED', false),
        'secret' => env('TURNSTILE_SECRET_KEY'),
        'verify_url' => env('TURNSTILE_VERIFY_URL', 'https://challenges.cloudflare.com/turnstile/v0/siteverify'),
    ],

];
