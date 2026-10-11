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
            from: new Address(config('services.brevo.sender.email'), config('services.brevo.sender.name')),
            replyTo: [new Address('info@nu-isoleren.be', 'Nu-Isoleren')],
            subject: __('recruitment.confirmation_subject', [], $this->applicationLocale()),
        );
    }

    public function content(): Content
    {
        return new Content(view: 'mail.recruitment.customer-'.$this->applicationLocale());
    }

    private function applicationLocale(): string
    {
        return in_array($this->application->locale, ['nl', 'fr', 'en'], true) ? $this->application->locale : 'nl';
    }
}
