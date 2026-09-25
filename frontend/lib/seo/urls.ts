import { getPathname, routing } from '@/i18n/routing';
export type Locale = (typeof routing.locales)[number];
export type RouteKey = keyof typeof routing.pathnames;
export const contentRoutes = {
  services: '/services/[slug]', cities: '/areas/[slug]', articles: '/knowledge/[slug]', projects: '/projects/[slug]', materials: '/materials/[slug]',
} as const;
export type ContentType = keyof typeof contentRoutes;
export const languageTags: Record<Locale, string> = { nl: 'nl-BE', fr: 'fr-BE', en: 'en' };
export function localizedPath(route: RouteKey, locale: string, slug?: string): string {
  return getPathname({ locale: locale as Locale, href: slug ? { pathname: route, params: { slug } } as Parameters<typeof getPathname>[0]['href'] : route as Parameters<typeof getPathname>[0]['href'] });
}
export function localizedLink(href: string, locale: string): string {
  const suffixIndex = href.search(/[?#]/);
  const path = suffixIndex < 0 ? href : href.slice(0, suffixIndex);
  const suffix = suffixIndex < 0 ? '' : href.slice(suffixIndex);
  if (path in routing.pathnames) return localizedPath(path as RouteKey, locale) + (suffix || '');
  for (const route of Object.values(contentRoutes)) {
    const prefix = route.replace('[slug]', '');
    if (path.startsWith(prefix)) return localizedPath(route, locale, path.slice(prefix.length)) + (suffix || '');
  }
  return href;
}
