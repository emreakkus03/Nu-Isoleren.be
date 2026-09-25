import { notFound, permanentRedirect } from 'next/navigation';
import { localizedPath, type RouteKey } from './urls';
export type PageSearch = Record<string, string | string[] | undefined>;
export function paginationOptions(search: PageSearch) {
  const raw = search.page;
  if (raw !== undefined && (typeof raw !== 'string' || !/^[1-9]\d*$/.test(raw) || !Number.isSafeInteger(Number(raw)))) notFound();
  return { page: Number(raw || 1), filtered: Object.keys(search).some(key => !['page', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'].includes(key)) };
}
export function validatePage(search: PageSearch, lastPage: number, route: RouteKey, locale: string) {
  const { page } = paginationOptions(search);
  if (page > Math.max(1, lastPage)) notFound();
  if (search.page === '1') {
    const query = new URLSearchParams(Object.entries(search).flatMap(([key, value]) => key !== 'page' && typeof value === 'string' ? [[key, value]] : []));
    permanentRedirect(localizedPath(route, locale) + (query.size ? `?${query}` : ''));
  }
}
