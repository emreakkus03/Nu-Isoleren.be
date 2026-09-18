<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Demande de devis reçue</title>
</head>

<body style="font-family: Arial, sans-serif; color: #111827; background: #f8f9fa; margin: 0; padding: 30px;">
    <div style="max-width: 680px; margin: 0 auto; background: white; padding: 32px; border-radius: 14px;">
        <p style="font-size: 13px; font-weight: bold; color: #1A669A; text-transform: uppercase; margin: 0 0 8px;">
            Nu-Isoleren
        </p>

        <h1 style="font-size: 26px; margin: 0 0 24px;">
            Merci pour votre demande
        </h1>

        <p>
            Bonjour {{ $quoteRequest->first_name }},
        </p>

        <p>
            Nous avons bien reçu votre demande de devis.
            Notre équipe va examiner votre demande et prendra contact avec vous afin de discuter des travaux.
        </p>

        <p>
            <strong>Référence :</strong>
            {{ $quoteRequest->reference }}
        </p>

        <h2 style="font-size: 18px; margin-top: 28px;">
            Travaux demandés
        </h2>

        <ul>
            @foreach ($services as $service)
                <li>{{ $service }}</li>
            @endforeach
        </ul>

        <p style="margin-top: 28px;">
            Cordialement,<br>
            <strong>Nu-Isoleren</strong>
        </p>
    </div>
</body>
</html>