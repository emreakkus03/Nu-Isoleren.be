<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quote_requests', function (Blueprint $table) {
            $table->id();

            $table->string('reference')->unique();

            $table->string('first_name');
            $table->string('last_name');

            $table->string('email');
            $table->string('phone');

            $table->string('street');
            $table->string('house_number');
            $table->string('postcode');
            $table->string('city');

            $table->text('message')->nullable();

            $table->string('locale', 5)->default('nl');

            $table->string('status')->default('new');

            $table->timestamp('privacy_consent_at');

            $table->timestamps();

            $table->index('status');
            $table->index('email');
            $table->index('postcode');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quote_requests');
    }
};