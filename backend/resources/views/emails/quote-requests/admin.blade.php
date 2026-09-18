<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <title>Nieuwe offerteaanvraag</title>
</head>

<body style="font-family: Arial, sans-serif; color: #111827; background: #f8f9fa; margin: 0; padding: 30px;">
    <div style="max-width: 680px; margin: 0 auto; background: white; padding: 32px; border-radius: 14px;">
        <p style="font-size: 13px; font-weight: bold; color: #C82024; text-transform: uppercase; margin: 0 0 8px;">
            Nieuwe offerteaanvraag
        </p>

        <h1 style="font-size: 26px; margin: 0 0 24px;">
            {{ $quoteRequest->reference }}
        </h1>

        <h2 style="font-size: 18px;">Klant</h2>

        <p>
            {{ $quoteRequest->first_name }} {{ $quoteRequest->last_name }}<br>
            {{ $quoteRequest->email }}<br>
            {{ $quoteRequest->phone }}
        </p>

        <h2 style="font-size: 18px;">Adres</h2>

        <p>
            {{ $quoteRequest->street }} {{ $quoteRequest->house_number }}<br>
            {{ $quoteRequest->postcode }} {{ $quoteRequest->city }}
        </p>

        <h2 style="font-size: 18px;">Aangevraagde diensten</h2>

        <p>{{ $services }}</p>

        @if ($quoteRequest->message)
            <h2 style="font-size: 18px;">Opmerking</h2>

            <p>
                {{ $quoteRequest->message }}
            </p>
        @endif

        @if ($quoteUrl)
            <div style="margin-top: 30px;">
                <a
                    href="{{ $quoteUrl }}"
                    style="display: inline-block; background: #C82024; color: white; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-weight: bold;"
                >
                    Bekijk offerteaanvraag
                </a>
            </div>
        @endif
    </div>
</body>
</html>