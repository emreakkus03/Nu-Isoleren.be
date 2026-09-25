<?php

return [
    'frontend_url' => env('FRONTEND_URL', 'https://nu-isoleren.be'),
    'revalidation_url' => env('FRONTEND_REVALIDATION_URL'),
    'revalidation_secret' => env('FRONTEND_REVALIDATION_SECRET'),
    'inventory_ttl' => 300,
    'queue_connection' => env('SEO_QUEUE_CONNECTION', 'database'),
];
