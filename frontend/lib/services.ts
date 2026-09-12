import { ServiceItem } from '@/types/service';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://backend.ddev.site/api';

export async function getServices(
  locale: string,
  options?: { featuredHome?: boolean }
): Promise<ServiceItem[]> {
  try {
    const params = new URLSearchParams({ locale });

    if (options?.featuredHome) {
      params.append('featured_home', '1');
    }

    const res = await fetch(`${API_BASE_URL}/services?${params.toString()}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return [];
    }

    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}


export async function getServiceBySlug(
  slug: string,
  locale: string
): Promise<ServiceItem | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://nu-isoleren-backend.ddev.site/api';
    const res = await fetch(`${baseUrl}/services/${encodeURIComponent(slug)}?locale=${locale}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error(`Fout bij ophalen service '${slug}':`, error);
    return null;
  }
}