<?php

namespace App\Services;

use App\Mail\ApplicationConfirmation;
use App\Mail\RecruitmentApplication;
use App\Models\JobApplication;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use RuntimeException;
use Throwable;

class RecruitmentMailService
{
    public function __construct(private readonly BrevoService $brevo) {}

    public function send(JobApplication $application, ?UploadedFile $cv): bool
    {
        try {
            if (! filter_var(config('recruitment.to'), FILTER_VALIDATE_EMAIL)
                || ! $this->brevo->enabled()
                || ! filter_var(config('services.brevo.sender.email'), FILTER_VALIDATE_EMAIL)) {
                throw new RuntimeException('Recruitment mail configuration unavailable');
            }
            $application->load(['answers', 'vacancy']);
            $mail = new RecruitmentApplication($application);
            $attachments = $cv ? [['name' => 'cv.pdf', 'content' => base64_encode($cv->get())]] : [];
            $this->brevo->send(
                to: ['email' => config('recruitment.to'), 'name' => config('recruitment.to_name')],
                subject: $mail->envelope()->subject,
                htmlContent: $mail->render(),
                replyTo: ['email' => $application->email, 'name' => trim($application->first_name.' '.$application->last_name)],
                attachments: $attachments,
            );
            $application->update(['internal_mail_status' => 'sent']);
        } catch (Throwable) {
            $application->update(['internal_mail_status' => 'failed']);
            Log::error('Recruitment internal mail delivery failed', ['application_id' => $application->id]);

            return false;
        }
        try {
            $mail = new ApplicationConfirmation($application);
            $envelope = $mail->envelope();
            $this->brevo->send(
                to: ['email' => $application->email, 'name' => trim($application->first_name.' '.$application->last_name)],
                subject: $envelope->subject,
                htmlContent: $mail->render(),
                replyTo: ['email' => $envelope->replyTo[0]->address, 'name' => $envelope->replyTo[0]->name],
            );
            $application->update(['confirmation_mail_status' => 'sent']);
        } catch (Throwable) {
            $application->update(['confirmation_mail_status' => 'failed']);
            Log::error('Recruitment confirmation delivery failed', ['application_id' => $application->id]);
        }

        return true;
    }
}
