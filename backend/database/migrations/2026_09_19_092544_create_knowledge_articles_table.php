<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('knowledge_articles', function (Blueprint $table) {
            $table->id();

            $table->foreignId('knowledge_category_id')
                ->constrained('knowledge_categories')
                ->cascadeOnDelete();

            $table->foreignId('service_id')
                ->nullable()
                ->constrained('services')
                ->nullOnDelete();

            $table->json('title');
            $table->json('slug');

            $table->json('excerpt')->nullable();
            $table->json('intro')->nullable();

            $table->string('hero_image')->nullable();

            $table->json('sections')->nullable();

            $table->json('seo_title')->nullable();
            $table->json('seo_description')->nullable();

            $table->boolean('published')->default(false);
            $table->boolean('featured')->default(false);

            $table->timestamp('published_at')->nullable();

            $table->unsignedInteger('sort_order')->default(0);

            $table->timestamps();

            $table->index('published');
            $table->index('featured');
            $table->index('published_at');
            $table->index('sort_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('knowledge_articles');
    }
};