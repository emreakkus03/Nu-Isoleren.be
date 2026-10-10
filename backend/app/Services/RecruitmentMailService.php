<?php

namespace App\Services;

use App\Mail\ApplicationConfirmation;
use App\Mail\RecruitmentApplication;
use App\Models\JobApplication;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use RuntimeException;
use Throwable;

class RecruitmentMailService
{
    public function send(JobApplication $application, ?UploadedFile $cv): bool
    {
        try {
            if (! filter_var(config('recruitment.to'), FILTER_VALIDATE_EMAIL) || ! $this->delivers((string) config('mail.default'))) {
                throw new RuntimeException('Recruitment mail configuration unavailable');
            }
            Mail::to(config('recruitment.to'), config('recruitment.to_name'))->send(new RecruitmentApplication($application->load(['answers', 'vacancy']), $cv));
            $application->update(['internal_mail_status' => 'sent']);
        } catch (Throwable) {
            $application->update(['internal_mail_status' => 'failed']);
            Log::error('Recruitment internal mail delivery failed', ['application_id' => $application->id]);

            return false;
        }
        try {
            Mail::to($application->email)->send(new ApplicationConfirmation($application));
            $application->update(['confirmation_mail_status' => 'sent']);
        } catch (Throwable) {
            $application->update(['confirmation_mail_status' => 'failed']);
            Log::error('Recruitment confirmation delivery failed', ['application_id' => $application->id]);
        }

        return true;
    }

    private function delivers(string $name, array $seen = []): bool
    {
        if (in_array($name, $seen, true)) {
            return false;
        }
        $config = config("mail.mailers.$name", []);
        $transport = $config['transport'] ?? '';
        if (in_array($transport, ['failover', 'roundrobin'], true)) {
            return ! empty($config['mailers']) && collect($config['mailers'])->every(fn (string $mailer): bool => $this->delivers($mailer, [...$seen, $name]));
        }

        return in_array($transport, ['smtp', 'sendmail', 'ses', 'ses-v2', 'postmark', 'resend'], true);
    }
}
