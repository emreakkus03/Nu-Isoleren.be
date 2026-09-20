<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('materials', function (Blueprint $table) {
            $table->id();

            $table->json('name');
            $table->json('slug');

            $table->json('eyebrow')->nullable();
            $table->json('hero_title')->nullable();
            $table->json('short_description')->nullable();
            $table->json('intro_text')->nullable();

            $table->string('hero_image')->nullable();
            $table->string('thumbnail')->nullable();

            $table->json('sections')->nullable();

            $table->json('seo_title')->nullable();
            $table->json('seo_description')->nullable();

            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);

            $table->timestamps();

            $table->index('is_active');
            $table->index('sort_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('materials');
    }
};