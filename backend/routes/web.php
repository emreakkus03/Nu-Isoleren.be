<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('/admin');
});

Route::get('/robots.txt', fn () => response("User-agent: *\nDisallow: /\n", 200)->header('Content-Type', 'text/plain'));
