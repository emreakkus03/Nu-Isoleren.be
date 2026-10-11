<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Merci pour votre candidature</title>
</head>
<body style="font-family: Arial, sans-serif; color: #111827; background: #f8f9fa; margin: 0; padding: 30px;">
    <div style="max-width: 680px; margin: 0 auto; background: white; padding: 32px; border-radius: 14px; overflow-wrap: anywhere;">
        <p style="font-size: 13px; font-weight: bold; color: #1A669A; text-transform: uppercase; margin: 0 0 8px;">Nu-Isoleren</p>
        <h1 style="font-size: 26px; margin: 0 0 24px;">Merci pour votre candidature</h1>
        <p style="margin: 0 0 16px; line-height: 1.6;">Bonjour {{ $application->first_name }},</p>
        <p style="margin: 0 0 16px; line-height: 1.6;">Nous avons bien reçu votre candidature pour le poste de {{ $application->vacancy_title }}.</p>
        <p style="margin: 0 0 24px; line-height: 1.6;">Notre équipe examinera attentivement votre candidature. Si votre profil correspond à ce que nous recherchons, nous vous contacterons afin de discuter des prochaines étapes.</p>
        <div style="border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; padding: 20px 0;">
            <h2 style="font-size: 18px; margin: 0 0 8px;">Poste</h2>
            <p style="margin: 0; line-height: 1.6;">{{ $application->vacancy_title }}</p>
        </div>
        <h2 style="font-size: 18px; margin: 28px 0 12px;">Que se passe-t-il maintenant ?</h2>
        <p style="margin: 0; line-height: 1.6;">Nous examinons votre candidature et nous vous contacterons si nous souhaitons poursuivre le processus avec vous.</p>
        <p style="margin-top: 28px; line-height: 1.6;">Cordialement,<br><strong>Nu-Isoleren</strong></p>
        @include('mail.recruitment.footer')
    </div>
</body>
</html>
