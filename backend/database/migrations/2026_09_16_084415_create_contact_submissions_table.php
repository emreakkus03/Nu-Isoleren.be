<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
    {
        Schema::create('contact_submissions', function (Blueprint $table) {
            $table->id();

            $table->string('first_name', 100);
            $table->string('last_name', 100);

            $table->string('email');
            $table->string('phone', 50)->nullable();

            $table->text('message');

            $table->string('locale', 5)->default('nl');
            $table->string('source')->default('contact_page');

            $table->timestamp('privacy_accepted_at');

            $table->string('status')->default('new')->index();

            $table->text('internal_notes')->nullable();

            $table->string('crm_status')->default('pending')->index();
            $table->string('crm_external_id')->nullable();
            $table->timestamp('crm_synced_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_submissions');
    }
};
