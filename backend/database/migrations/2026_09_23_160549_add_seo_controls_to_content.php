<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        foreach (['services', 'knowledge_articles', 'projects', 'materials'] as $name) {
            Schema::table($name, fn (Blueprint $table) => $table->boolean('is_indexable')->default(true));
        }
        Schema::table('cities', fn (Blueprint $table) => $table->boolean('is_published')->default(true));
        Schema::create('seo_refresh_status', function (Blueprint $table) {
            $table->unsignedTinyInteger('id')->primary();
            $table->timestamp('succeeded_at')->nullable();
            $table->timestamp('failed_at')->nullable();
            $table->string('last_error')->nullable();
        });
    }

    public function down(): void
    {
        foreach (['services', 'knowledge_articles', 'projects', 'materials'] as $name) {
            Schema::table($name, fn (Blueprint $table) => $table->dropColumn('is_indexable'));
        }
        Schema::table('cities', fn (Blueprint $table) => $table->dropColumn('is_published'));
        Schema::dropIfExists('seo_refresh_status');
    }
};
