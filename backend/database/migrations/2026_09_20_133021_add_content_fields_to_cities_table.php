<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cities', function (Blueprint $table) {
            $table->string('hero_image')->nullable()->after('is_featured');

            $table->json('hero_title')->nullable()->after('hero_image');
            $table->json('hero_intro')->nullable()->after('hero_title');

            $table->json('local_title')->nullable()->after('hero_intro');
            $table->json('local_content')->nullable()->after('local_title');

            $table->json('solution_intro')->nullable()->after('local_content');

            $table->json('local_faqs')->nullable()->after('solution_intro');

            $table->json('seo_title')->nullable()->after('local_faqs');
            $table->json('seo_description')->nullable()->after('seo_title');

            $table->boolean('is_indexable')
                ->default(false)
                ->after('seo_description');
        });
    }

    public function down(): void
    {
        Schema::table('cities', function (Blueprint $table) {
            $table->dropColumn([
                'hero_image',
                'hero_title',
                'hero_intro',
                'local_title',
                'local_content',
                'solution_intro',
                'local_faqs',
                'seo_title',
                'seo_description',
                'is_indexable',
            ]);
        });
    }
};