import 'server-only';
import { publicImage, siteOrigin } from './config';
import { localizedPath } from './urls';
import { businessSchema } from './schema';
import { vacancyOpen } from '@/lib/recruitment';
import type { Vacancy } from '@/types/vacancy';
export async function jobSchema(vacancy: Vacancy, locale: string) {
  const origin = siteOrigin();
  if (!origin || !vacancyOpen(vacancy) || !vacancy.is_indexable || !vacancy.published_at) return null;
  const business = await businessSchema();
  if (!business) return null;
  return {
    '@context': 'https://schema.org', '@type': 'JobPosting',
    title: vacancy.title, description: vacancy.content,
    url: origin + localizedPath('/jobs/[slug]', locale, vacancy.slug),
    datePosted: vacancy.published_at,
    ...(vacancy.valid_through ? { validThrough: vacancy.valid_through } : {}),
    hiringOrganization: { '@type': 'Organization', '@id': business['@id'], name: business.name, url: business.url, logo: business.logo },
    employmentType: vacancy.employment_type,
    jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressCountry: vacancy.location_country,
      ...(vacancy.location_city ? { addressLocality: vacancy.location_city } : {}),
      ...(vacancy.location_region ? { addressRegion: vacancy.location_region } : {}),
    } },
    ...(publicImage(vacancy.image) ? { image: publicImage(vacancy.image) } : {}),
  };
}
