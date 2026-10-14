import { localizeCmsRichText } from './cms-rich-text';
import 'server-only';
import { cache } from 'react';
import { contentRequest } from '@/lib/content-api';
import { vacancyOpen, vacancyPublishedIn } from '@/lib/recruitment';
import type { Vacancy } from '@/types/vacancy';
export const getVacancies = cache(async (locale: string): Promise<Vacancy[]> => {
  const response = await contentRequest(`/vacancies?locale=${encodeURIComponent(locale)}`, ['vacancies']);
  const result = await response.json();
  return localizeCmsRichText((result.data as Vacancy[]).filter(vacancy => vacancyOpen(vacancy) && vacancyPublishedIn(vacancy, locale)), locale);
});
export const getVacancy = cache(async (locale: string, slug: string): Promise<Vacancy | null> => {
  const response = await contentRequest(`/vacancies/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`, ['vacancies'], true);
  if (response.status === 404) return null;
  const vacancy = (await response.json()).data as Vacancy;
  if (!vacancyPublishedIn(vacancy, locale)) return null;
  if (vacancy.published_locales) {
    vacancy.alternate_slugs = Object.fromEntries(Object.entries(vacancy.alternate_slugs).filter(([language]) => vacancyPublishedIn(vacancy, language)));
  }
  return localizeCmsRichText(vacancy, locale);
});
