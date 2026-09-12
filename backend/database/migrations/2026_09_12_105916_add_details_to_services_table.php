<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->json('badge')->after('slug');
            $table->json('short_description')->nullable()->after('badge');
            $table->string('thumbnail')->nullable()->after('short_description');

            $table->string('hero_image')->nullable()->after('thumbnail');
            $table->json('eyebrow')->nullable()->after('hero_image');
            $table->json('hero_title')->nullable()->after('eyebrow');
            $table->json('intro_text')->nullable()->after('hero_title');

            $table->json('sections')->nullable()->after('intro_text');

            $table->json('seo_title')->nullable()->after('sections');
            $table->json('seo_description')->nullable()->after('seo_title');
            $table->integer('order_column')->default(0)->after('seo_description');
            $table->boolean('is_active')->default(true)->after('order_column');
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn([
                'badge',
                'short_description',
                'thumbnail',
                'hero_image',
                'eyebrow',
                'hero_title',
                'intro_text',
                'sections',
                'seo_title',
                'seo_description',
                'order_column',
                'is_active',
            ]);
        });
    }
};