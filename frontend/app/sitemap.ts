import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { indexingEnabled, siteOrigin } from '@/lib/seo/config';
import { getSeoInventory } from '@/lib/seo/inventory';
import { contentRoutes, languageTags, localizedPath, type Locale, type RouteKey } from '@/lib/seo/urls';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!indexingEnabled()) return [];
  const origin = siteOrigin()!;
  const entries: MetadataRoute.Sitemap = [];
  const add = (route: RouteKey, slugs?: Partial<Record<Locale, string>>, updated?: string | null) => {
    const locales = routing.locales.filter(locale => !slugs || slugs[locale]);
    const languages = Object.fromEntries(locales.map(locale => [languageTags[locale], origin + localizedPath(route, locale, slugs?.[locale])]));
    if (languages['nl-BE']) languages['x-default'] = languages['nl-BE'];
    for (const locale of locales) entries.push({ url: languages[languageTags[locale]], ...(updated && Number.isFinite(Date.parse(updated)) ? { lastModified: updated } : {}), alternates: { languages } });
  };
  const inventory = await getSeoInventory();
  for (const route of Object.keys(routing.pathnames) as RouteKey[]) {
    if (!route.includes('[slug]') && !['/privacy-policy', '/cookie-policy', '/thank-you/contact', '/thank-you/quote'].includes(route)) add(route);
  }
  for (const entry of inventory) if (entry.is_indexable) add(contentRoutes[entry.type], entry.slugs, entry.updated_at);
  return entries;
}
