<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <title>Offerteaanvraag ontvangen</title>
</head>

<body style="font-family: Arial, sans-serif; color: #111827; background: #f8f9fa; margin: 0; padding: 30px;">
    <div style="max-width: 680px; margin: 0 auto; background: white; padding: 32px; border-radius: 14px;">
        <p style="font-size: 13px; font-weight: bold; color: #1A669A; text-transform: uppercase; margin: 0 0 8px;">
            Nu-Isoleren
        </p>

        <h1 style="font-size: 26px; margin: 0 0 24px;">
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

        <h2 style="font-size: 18px; margin-top: 28px;">
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

        <div style="border-top: 1px solid #e5e7eb; margin-top: 32px; padding-top: 24px;">
            <img
                src="{{ asset('images/logo.png') }}"
                alt="Nu-Isoleren"
                style="display: block; max-width: 180px; height: auto; margin-bottom: 16px;"
            >

            <p style="margin: 0 0 8px; font-size: 14px;">
                <a
                    href="mailto:info@nu-isoleren.be"
                    style="color: #1A669A; text-decoration: none; font-weight: 600;"
                >
                    info@nu-isoleren.be
                </a>
            </p>

            <p style="margin: 0; font-size: 14px;">
                <a
                    href="tel:+3280063635"
                    style="color: #1A669A; text-decoration: none; font-weight: 600;"
                >
                    +32 (0) 800 63 63 5
                </a>
            </p>
        </div>
    </div>
</body>
</html>