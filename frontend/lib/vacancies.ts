import 'server-only';
import { cache } from 'react';
import { contentRequest } from '@/lib/content-api';
import { vacancyOpen } from '@/lib/recruitment';
import type { Vacancy } from '@/types/vacancy';
export async function getVacancies(locale: string): Promise<Vacancy[]> {
  const response = await contentRequest(`/vacancies?locale=${encodeURIComponent(locale)}`, ['vacancies']);
  const result = await response.json();
  return (result.data as Vacancy[]).filter(vacancyOpen);
}
export const getVacancy = cache(async (locale: string, slug: string): Promise<Vacancy | null> => {
  const response = await contentRequest(`/vacancies/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`, ['vacancies'], true);
  if (response.status === 404) return null;
  return (await response.json()).data;
});
