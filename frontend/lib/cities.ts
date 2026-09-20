import { CitiesResponse, City } from '@/types/city';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://backend.ddev.site/api';

export async function getCities(
  featuredOnly = false
): Promise<CitiesResponse> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/cities${
        featuredOnly ? '?featured=1' : ''
      }`,
      {
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      return {
        all: [],
        grouped: {},
      };
    }

    return await res.json();
  } catch (error) {
    console.error(
      'Fout bij ophalen steden:',
      error
    );

    return {
      all: [],
      grouped: {},
    };
  }
}

export async function getCityBySlug(
  slug: string,
  locale: string
): Promise<City | null> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/cities/${encodeURIComponent(
        slug
      )}?locale=${locale}`,
      {
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error(
      `Fout bij ophalen stad ${slug}:`,
      error
    );

    return null;
  }
}