<?php

namespace App\Mail;

use App\Models\JobApplication;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class ApplicationConfirmation extends Mailable
{
    public function __construct(public JobApplication $application) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(config('recruitment.from') ?: config('mail.from.address'), config('recruitment.from_name')),
            subject: __('recruitment.confirmation_subject', [], $this->application->locale),
        );
    }

    public function content(): Content
    {
        return new Content(view: 'mail.application-confirmation');
    }
}
