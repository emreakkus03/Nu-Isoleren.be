@include('mail.recruitment.customer-'.(in_array($application->locale, ['nl', 'fr', 'en'], true) ? $application->locale : 'nl'))
