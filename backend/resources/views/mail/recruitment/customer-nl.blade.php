<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bedankt voor uw sollicitatie</title>
</head>
<body style="font-family: Arial, sans-serif; color: #111827; background: #f8f9fa; margin: 0; padding: 30px;">
    <div style="max-width: 680px; margin: 0 auto; background: white; padding: 32px; border-radius: 14px; overflow-wrap: anywhere;">
        <p style="font-size: 13px; font-weight: bold; color: #1A669A; text-transform: uppercase; margin: 0 0 8px;">Nu-Isoleren</p>
        <h1 style="font-size: 26px; margin: 0 0 24px;">Bedankt voor uw sollicitatie</h1>
        <p style="margin: 0 0 16px; line-height: 1.6;">Beste {{ $application->first_name }},</p>
        <p style="margin: 0 0 16px; line-height: 1.6;">We hebben uw sollicitatie voor {{ $application->vacancy_title }} goed ontvangen.</p>
        <p style="margin: 0 0 24px; line-height: 1.6;">Ons team bekijkt uw kandidatuur zorgvuldig. Indien uw profiel aansluit bij wat we zoeken, nemen we contact met u op om de volgende stappen te bespreken.</p>
        <div style="border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; padding: 20px 0;">
            <h2 style="font-size: 18px; margin: 0 0 8px;">Vacature</h2>
            <p style="margin: 0; line-height: 1.6;">{{ $application->vacancy_title }}</p>
        </div>
        <h2 style="font-size: 18px; margin: 28px 0 12px;">Wat gebeurt er nu?</h2>
        <p style="margin: 0; line-height: 1.6;">We bekijken uw kandidatuur en nemen contact met u op wanneer we verder willen kennismaken.</p>
        <p style="margin-top: 28px; line-height: 1.6;">Met vriendelijke groet,<br><strong>Nu-Isoleren</strong></p>
        @include('mail.recruitment.footer')
    </div>
</body>
</html>
