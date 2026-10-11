<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank you for your application</title>
</head>
<body style="font-family: Arial, sans-serif; color: #111827; background: #f8f9fa; margin: 0; padding: 30px;">
    <div style="max-width: 680px; margin: 0 auto; background: white; padding: 32px; border-radius: 14px; overflow-wrap: anywhere;">
        <p style="font-size: 13px; font-weight: bold; color: #1A669A; text-transform: uppercase; margin: 0 0 8px;">Nu-Isoleren</p>
        <h1 style="font-size: 26px; margin: 0 0 24px;">Thank you for your application</h1>
        <p style="margin: 0 0 16px; line-height: 1.6;">Dear {{ $application->first_name }},</p>
        <p style="margin: 0 0 16px; line-height: 1.6;">We have successfully received your application for {{ $application->vacancy_title }}.</p>
        <p style="margin: 0 0 24px; line-height: 1.6;">Our team will carefully review your application. If your profile matches what we are looking for, we will contact you to discuss the next steps.</p>
        <div style="border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; padding: 20px 0;">
            <h2 style="font-size: 18px; margin: 0 0 8px;">Position</h2>
            <p style="margin: 0; line-height: 1.6;">{{ $application->vacancy_title }}</p>
        </div>
        <h2 style="font-size: 18px; margin: 28px 0 12px;">What happens next?</h2>
        <p style="margin: 0; line-height: 1.6;">We will review your application and contact you if we would like to continue the process with you.</p>
        <p style="margin-top: 28px; line-height: 1.6;">Kind regards,<br><strong>Nu-Isoleren</strong></p>
        @include('mail.recruitment.footer')
    </div>
</body>
</html>
