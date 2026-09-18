<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quote_request_service', function (Blueprint $table) {
            $table->foreignId('quote_request_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('service_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->primary([
                'quote_request_id',
                'service_id',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quote_request_service');
    }
};