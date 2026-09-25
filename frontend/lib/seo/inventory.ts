import 'server-only';
import { cache } from 'react';
import { contentRequest } from '@/lib/content-api';
import type { ContentType, Locale } from './urls';
export interface SeoEntry { type: ContentType; id: number; slugs: Partial<Record<Locale, string>>; is_indexable: boolean; updated_at: string | null }
export const getSeoInventory = cache(async (): Promise<SeoEntry[]> => {
  const response = await contentRequest('/seo-inventory', ['sitemap']);
  const result = await response.json();
  if (!Array.isArray(result.data)) throw new Error('Invalid SEO inventory');
  return result.data;
});
export async function resolveSeoEntry(type: ContentType, locale: string, slug: string) {
  return (await getSeoInventory()).find(entry => entry.type === type && entry.slugs[locale as Locale] === slug);
}
export async function serviceSlug(nlSlug: string, locale: string): Promise<string | undefined> {
  return (await getSeoInventory()).find(entry => entry.type === 'services' && entry.slugs.nl === nlSlug)?.slugs[locale as Locale];
}
