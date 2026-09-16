<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <title>Nieuwe contactaanvraag</title>
</head>

<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;color:#111827;">
    <div style="max-width:650px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;">
        <div style="background:#123F5A;padding:28px 32px;">
            <h1 style="margin:0;color:#ffffff;font-size:24px;">
                Nieuwe contactaanvraag
            </h1>
        </div>

        <div style="padding:32px;">
            <p style="margin-top:0;">
                Er is een nieuwe contactaanvraag ontvangen via Nu-Isoleren.be.
            </p>

            <table style="width:100%;border-collapse:collapse;margin-top:24px;">
                <tr>
                    <td style="padding:10px 0;font-weight:bold;width:150px;">
                        Naam
                    </td>
                    <td style="padding:10px 0;">
                        {{ $submission->full_name }}
                    </td>
                </tr>

                <tr>
                    <td style="padding:10px 0;font-weight:bold;">
                        E-mail
                    </td>
                    <td style="padding:10px 0;">
                        <a href="mailto:{{ $submission->email }}">
                            {{ $submission->email }}
                        </a>
                    </td>
                </tr>

                <tr>
                    <td style="padding:10px 0;font-weight:bold;">
                        Telefoon
                    </td>
                    <td style="padding:10px 0;">
                        {{ $submission->phone ?: 'Niet opgegeven' }}
                    </td>
                </tr>

                <tr>
                    <td style="padding:10px 0;font-weight:bold;">
                        Taal
                    </td>
                    <td style="padding:10px 0;">
                        {{ strtoupper($submission->locale) }}
                    </td>
                </tr>

                <tr>
                    <td style="padding:10px 0;font-weight:bold;">
                        Ontvangen
                    </td>
                    <td style="padding:10px 0;">
                        {{ $submission->created_at->timezone('Europe/Brussels')->format('d/m/Y H:i') }}
                    </td>
                </tr>
            </table>

            <div style="margin-top:28px;">
                <p style="font-weight:bold;margin-bottom:8px;">
                    Bericht
                </p>

                <div style="background:#F7F9FA;padding:18px;border-radius:8px;white-space:pre-wrap;line-height:1.6;">{{ $submission->message }}</div>
            </div>
        </div>
    </div>
</body>
</html>