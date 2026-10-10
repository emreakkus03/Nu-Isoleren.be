<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vacancies', function (Blueprint $table) {
            $table->id();
            $table->string('status')->default('draft')->index();
            foreach (['title', 'slug', 'short_description', 'content', 'meta_title', 'meta_description'] as $field) {
                $table->json($field)->nullable();
            }
            $table->timestamp('published_at')->nullable();
            $table->timestamp('valid_through')->nullable()->index();
            $table->string('image')->nullable();
            $table->string('region');
            $table->string('employment_type');
            $table->string('location_city')->nullable();
            $table->string('location_region')->nullable();
            $table->string('location_country', 2);
            $table->boolean('is_indexable')->default(true);
            $table->boolean('require_cv_or_linkedin')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
        Schema::create('vacancy_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vacancy_id')->constrained()->cascadeOnDelete();
            $table->string('type');
            $table->json('question');
            $table->json('help_text')->nullable();
            $table->json('options')->nullable();
            $table->string('short_label', 80)->nullable();
            $table->boolean('show_in_email_subject')->default(false);
            $table->boolean('required')->default(true);
            $table->boolean('active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vacancy_id')->constrained()->restrictOnDelete();
            $table->string('vacancy_title');
            foreach (['first_name', 'last_name', 'email', 'phone', 'city'] as $field) {
                $table->string($field);
            }
            $table->string('linkedin_url', 500)->nullable();
            $table->boolean('has_cv')->default(false);
            $table->string('locale', 2);
            $table->string('status')->default('new')->index();
            $table->timestamp('submitted_at')->index();
            $table->timestamp('privacy_accepted_at');
            $table->string('source')->default('direct');
            foreach (['source', 'medium', 'campaign', 'content', 'term'] as $field) {
                $table->string('utm_'.$field)->nullable();
            }
            $table->text('internal_notes')->nullable();
            $table->string('internal_mail_status')->default('pending');
            $table->string('confirmation_mail_status')->default('pending');
            $table->timestamps();
        });
        Schema::create('job_application_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_application_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('question_id');
            $table->text('question');
            $table->string('type');
            $table->string('short_label', 80)->nullable();
            $table->boolean('show_in_email_subject')->default(false);
            $table->json('value');
            $table->text('answer_label');
            $table->string('locale', 2);
            $table->unsignedInteger('sort_order');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_application_answers');
        Schema::dropIfExists('job_applications');
        Schema::dropIfExists('vacancy_questions');
        Schema::dropIfExists('vacancies');
    }
};
