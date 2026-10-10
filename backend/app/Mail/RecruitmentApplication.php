<?php

namespace App\Mail;

use App\Models\JobApplication;
use Illuminate\Http\UploadedFile;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Support\Str;

class RecruitmentApplication extends Mailable
{
    public function __construct(public JobApplication $application, private ?UploadedFile $cv = null) {}

    public function envelope(): Envelope
    {
        $tags = $this->application->answers->where('show_in_email_subject', true)
            ->map(fn ($answer): string => ($answer->short_label ?: $answer->question).': '.$answer->answer_label)->implode(' | ');
        $subject = '[Sollicitatie] '.$this->application->vacancy_title.' | '.$tags.' | '.$this->application->city;

        return new Envelope(
            from: new Address(config('recruitment.from') ?: config('mail.from.address'), config('recruitment.from_name')),
            replyTo: [new Address($this->application->email)],
            subject: Str::limit(preg_replace('/[\r\n\x00-\x1F\x7F]+/u', ' ', $subject), 180),
        );
    }

    public function content(): Content
    {
        return new Content(view: 'mail.recruitment-application');
    }

    public function attachments(): array
    {
        return $this->cv ? [Attachment::fromPath($this->cv->getRealPath())->as('cv.pdf')->withMime('application/pdf')] : [];
    }
}
