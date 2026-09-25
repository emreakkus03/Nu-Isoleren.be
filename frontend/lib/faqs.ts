import { contentRequest } from './content-api';
import { FaqItem } from '@/types/faq';


interface GetFaqOptions {
  serviceSlug?: string;
  featuredHome?: boolean;
  category?:
  | 'general'
  | 'grants'
  | 'pricing'
  | 'epc'
  | 'energy_savings'
  | 'home_check';
}

export async function getFaqs(
  locale: string = 'nl',
  options?: GetFaqOptions
): Promise<FaqItem[]> {
    const params = new URLSearchParams({ locale });

    if (options?.serviceSlug) {
      params.append('service', options.serviceSlug);
    }

    if (options?.featuredHome) {
      params.append('featured_home', '1');
    }

    if (options?.category) {
      params.append('category', options.category);
    }

    const res = await contentRequest(
      `/faqs?${params.toString()}`,
      ['faqs']
    );

    if (!res.ok) return [];

    const json = await res.json();

    return Array.isArray(json) ? json : json.data || [];

}