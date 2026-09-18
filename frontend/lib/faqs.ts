import { FaqItem } from '@/types/faq';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://backend.ddev.site/api';

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
  try {
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

    const res = await fetch(
      `${API_BASE_URL}/faqs?${params.toString()}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) return [];

    const json = await res.json();

    return Array.isArray(json) ? json : json.data || [];
  } catch (error) {
    console.error('Fout bij ophalen van FAQ’s:', error);
    return [];
  }
}