<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <title>Offerteaanvraag ontvangen</title>
</head>

<body style="font-family: Arial, sans-serif; color: #111827; background: #f8f9fa; margin: 0; padding: 30px;">
    <div style="max-width: 680px; margin: 0 auto; background: white; padding: 32px; border-radius: 14px;">
        <p style="font-size: 13px; font-weight: bold; color: #1A669A; text-transform: uppercase;">
            Nu-Isoleren
        </p>

        <h1 style="font-size: 26px;">
            Bedankt voor uw aanvraag
        </h1>

        <p>
            Beste {{ $quoteRequest->first_name }},
        </p>

        <p>
            We hebben uw offerteaanvraag goed ontvangen.
            Ons team bekijkt uw aanvraag en neemt contact met u op om de werken verder te bespreken.
        </p>

        <p>
            <strong>Referentie:</strong>
            {{ $quoteRequest->reference }}
        </p>

        <h2 style="font-size: 18px;">
            Aangevraagde diensten
        </h2>

        <ul>
            @foreach ($services as $service)
                <li>{{ $service }}</li>
            @endforeach
        </ul>

        <p style="margin-top: 28px;">
            Met vriendelijke groet,<br>
            <strong>Nu-Isoleren</strong>
        </p>
    </div>
</body>
</html>