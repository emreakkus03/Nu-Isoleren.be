@php($application = $getRecord()->loadMissing(['answers', 'vacancy']))
<x-filament::section heading="Snelle screening">
    <h2 class="font-bold">{{ $application->vacancy_title }}</h2>
    <dl class="space-y-4 mt-4">
    @foreach ($application->answers as $answer)
        <div><dt class="font-semibold">{{ $answer->question }}</dt><dd class="whitespace-pre-wrap">{{ $answer->answer_label }}</dd></div>
    @endforeach
    </dl>
</x-filament::section>
<x-filament::section heading="Kandidaat en ontvangst">
    <dl class="space-y-2">
    @foreach (['first_name' => 'Voornaam', 'last_name' => 'Achternaam', 'email' => 'E-mail', 'phone' => 'Telefoon', 'city' => 'Gemeente', 'locale' => 'Taal', 'submitted_at' => 'Ontvangen', 'privacy_accepted_at' => 'Privacy bevestigd'] as $field => $label)
        <div><dt class="font-semibold">{{ $label }}</dt><dd>{{ $application->$field }}</dd></div>
    @endforeach
    <div><dt>LinkedIn</dt><dd>@if ($application->linkedin_url)<a class="underline" href="{{ $application->linkedin_url }}" target="_blank" rel="noopener noreferrer">{{ $application->linkedin_url }}</a>@else — @endif</dd></div>
    <div>CV meegestuurd: {{ $application->has_cv ? 'Ja — alleen als mailbijlage' : 'Nee' }}</div>
    <div>Recruitmentmail: {{ ['pending' => 'In behandeling', 'sent' => 'Verzonden', 'failed' => 'Mislukt — opvolgen; CV niet bewaard'][$application->internal_mail_status] ?? $application->internal_mail_status }}</div>
    <div>Bevestigingsmail: {{ ['pending' => 'Nog niet verzonden', 'sent' => 'Verzonden', 'failed' => 'Mislukt'][$application->confirmation_mail_status] ?? $application->confirmation_mail_status }}</div>
    </dl>
</x-filament::section>
<x-filament::section heading="Bron">
    @foreach (['source', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as $field)
    <p>{{ $field }}: {{ $application->$field ?: '—' }}</p>
    @endforeach
</x-filament::section>
