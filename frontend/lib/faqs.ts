import { FaqItem } from '@/types/faq';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://backend.ddev.site/api';

export async function getFaqs(locale: string = 'nl', options?: { serviceSlug?: string; featuredHome?: boolean }): Promise<FaqItem[]> {
  try {
    const params = new URLSearchParams({ locale });
    if (options?.serviceSlug) params.append('service', options.serviceSlug);
    if (options?.featuredHome) params.append('featured_home', '1');

    const res = await fetch(`${API_BASE_URL}/faqs?${params.toString()}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];
   const json = await res.json();
return Array.isArray(json) ? json : json.data || [];
  } catch {
    return [];
  }
}
