<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('/admin');
});

Route::get('/robots.txt', fn () => response("User-agent: *\nDisallow: /\n", 200)->header('Content-Type', 'text/plain'));



Route::get('/preview-email/{locale}', function (string $locale) {
    abort_unless(app()->environment('local'), 404);
    abort_unless(in_array($locale, ['nl', 'fr', 'en'], true), 404);

    $quoteRequest = (object) [
        'first_name' => 'Emre',
        'reference' => 'OFF-2026-000123',
    ];

    $services = [
        'Spouwmuurisolatie',
        'Crepi',
        'Gevelreiniging',
    ];

    return view("emails.quote-requests.customer-{$locale}", [
        'quoteRequest' => $quoteRequest,
        'services' => $services,
    ]);
});