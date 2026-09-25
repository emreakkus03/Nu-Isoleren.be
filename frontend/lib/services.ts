import { contentRequest } from './content-api';
import { ServiceItem } from '@/types/service';


export async function getServices(
  locale: string,
  options?: { featuredHome?: boolean }
): Promise<ServiceItem[]> {
    const params = new URLSearchParams({ locale });

    if (options?.featuredHome) {
      params.append('featured_home', '1');
    }

    const res = await contentRequest(`/services?${params.toString()}`, ['services']);

    if (!res.ok) {
      return [];
    }

    const json = await res.json();
    return json.data || [];

}


export async function getServiceBySlug(
  slug: string,
  locale: string
): Promise<ServiceItem | null> {

    const res = await contentRequest(
      `/services/${encodeURIComponent(slug)}?locale=${locale}`,
      ['services'], true
    );

    if (!res.ok) {
      return null;
    }

    const json = await res.json();

    return json.data || null;

}