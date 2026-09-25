import { getLocale } from 'next-intl/server';
import { contentRequest } from './content-api';
import { CitiesResponse, City } from '@/types/city';


export async function getCities(
  featuredOnly = false
): Promise<CitiesResponse> {
    const locale = await getLocale();
    const res = await contentRequest(
      `/cities?locale=${locale}${featuredOnly ? '&featured=1' : ''}`,
      ['cities']
    );

    if (!res.ok) {
      return {
        all: [],
        grouped: {},
      };
    }

    return await res.json();

}

export async function getCityBySlug(
  slug: string,
  locale: string
): Promise<City | null> {
    const res = await contentRequest(
      `/cities/${encodeURIComponent(
        slug
      )}?locale=${locale}`,
      ['cities'], true
    );

    if (!res.ok) {
      return null;
    }

    return await res.json();

}