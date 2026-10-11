<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nieuwe sollicitatie</title>
</head>
<body style="font-family: Arial, sans-serif; color: #111827; background: #f8f9fa; margin: 0; padding: 30px;">
    <div style="max-width: 680px; margin: 0 auto; background: white; padding: 32px; border-radius: 14px; overflow-wrap: anywhere;">
        <p style="font-size: 13px; font-weight: bold; color: #C82024; text-transform: uppercase; margin: 0 0 8px;">Nieuwe sollicitatie</p>
        <h1 style="font-size: 26px; margin: 0 0 24px;">{{ $application->first_name }} {{ $application->last_name }}</h1>
        <h2 style="font-size: 18px; margin: 0 0 12px;">Vacature</h2>
        <p style="margin: 0; line-height: 1.6;">{{ $application->vacancy_title }}<br>{{ $application->vacancy->region }}</p>
        <h2 style="font-size: 18px; margin: 28px 0 12px; color: #C82024;">Snelle screening</h2>
        @foreach ($application->answers as $answer)
            <div style="border-bottom: 1px solid #e5e7eb; padding: 16px 0;">
                <p style="margin: 0 0 8px; line-height: 1.6;"><strong>{{ $answer->question }}</strong></p>
                <p style="margin: 0; line-height: 1.6; white-space: pre-line;">{{ $answer->answer_label }}</p>
            </div>
        @endforeach
        <h2 style="font-size: 18px; margin: 28px 0 12px;">Kandidaat</h2>
        <p style="margin: 0; line-height: 1.6;">
            {{ $application->first_name }} {{ $application->last_name }}<br>
            <a href="mailto:{{ $application->email }}" style="color: #1A669A;">{{ $application->email }}</a><br>
            {{ $application->phone }}<br>{{ $application->city }}
        </p>
        @if ($application->linkedin_url)
            <p style="margin: 16px 0 0; line-height: 1.6;">LinkedIn: <a href="{{ $application->linkedin_url }}" style="color: #1A669A;">{{ $application->linkedin_url }}</a></p>
        @endif
        <h2 style="font-size: 18px; margin: 28px 0 12px;">CV</h2>
        <p style="margin: 0; line-height: 1.6;">{{ $application->has_cv ? 'Bijgevoegd' : 'Niet meegestuurd' }}</p>
        <h2 style="font-size: 18px; margin: 28px 0 12px;">Bron</h2>
        @foreach (['source', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as $field)
            @if (filled($application->$field))
                <p style="margin: 0 0 8px; line-height: 1.6;"><strong>{{ $field === 'source' ? 'Bron' : $field }}:</strong> {{ $application->$field }}</p>
            @endif
        @endforeach
        @include('mail.recruitment.footer')
    </div>
</body>
</html>
