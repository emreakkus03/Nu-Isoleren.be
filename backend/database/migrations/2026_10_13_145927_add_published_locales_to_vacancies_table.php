<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vacancies', function (Blueprint $table) {
            $table->json('published_locales')->nullable();
        });

        DB::table('vacancies')->whereNull('published_locales')->update([
            'published_locales' => json_encode(['nl', 'fr', 'en']),
        ]);
    }

    public function down(): void
    {
        Schema::table('vacancies', function (Blueprint $table) {
            $table->dropColumn('published_locales');
        });
    }
};
