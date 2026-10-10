<!doctype html><html lang="nl"><body>
<h1>Snelle screening</h1>
<p><strong>Vacature:</strong> {{ $application->vacancy_title }}<br><strong>Regio:</strong> {{ $application->vacancy->region }}</p>
@foreach ($application->answers as $answer)
<p><strong>{{ $answer->question }}</strong><br>{{ $answer->answer_label }}</p>
@endforeach
<h2>Kandidaat</h2>
<p>{{ $application->first_name }} {{ $application->last_name }}<br>
{{ $application->email }}<br>{{ $application->phone }}<br>{{ $application->city }}</p>
@if ($application->linkedin_url)<p>LinkedIn: <a href="{{ $application->linkedin_url }}">{{ $application->linkedin_url }}</a></p>@endif
<p>CV: {{ $application->has_cv ? 'Bijgevoegd' : 'Niet meegestuurd' }}</p>
<h2>Bron</h2>
<p>Source: {{ $application->source }}</p>
@foreach (['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as $field)
<p>{{ $field }}: {{ $application->$field ?: '—' }}</p>
@endforeach
</body></html>
