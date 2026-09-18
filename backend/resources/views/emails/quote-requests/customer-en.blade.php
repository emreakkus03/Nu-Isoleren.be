<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Quote request received</title>
</head>

<body style="font-family: Arial, sans-serif; color: #111827; background: #f8f9fa; margin: 0; padding: 30px;">
    <div style="max-width: 680px; margin: 0 auto; background: white; padding: 32px; border-radius: 14px;">
        <p style="font-size: 13px; font-weight: bold; color: #1A669A; text-transform: uppercase; margin: 0 0 8px;">
            Nu-Isoleren
        </p>

        <h1 style="font-size: 26px; margin: 0 0 24px;">
            Thank you for your request
        </h1>

        <p>
            Dear {{ $quoteRequest->first_name }},
        </p>

        <p>
            We have successfully received your quote request.
            Our team will review your request and contact you to discuss the work in more detail.
        </p>

        <p>
            <strong>Reference:</strong>
            {{ $quoteRequest->reference }}
        </p>

        <h2 style="font-size: 18px; margin-top: 28px;">
            Requested services
        </h2>

        <ul>
            @foreach ($services as $service)
                <li>{{ $service }}</li>
            @endforeach
        </ul>

        <p style="margin-top: 28px;">
            Kind regards,<br>
            <strong>Nu-Isoleren</strong>
        </p>
    </div>
</body>
</html>