import { routing } from '@/i18n/config';
import { contentRoutes, localizedPath, type Locale, type RouteKey } from '@/lib/seo/urls';
import type { SeoEntry } from '@/lib/seo/inventory';

function linkParts(href: string, locale: string) {
  if (!href.startsWith('/') || href.startsWith('//')) return null;
  const suffixIndex = href.search(/[?#]/);
  let path = suffixIndex < 0 ? href : href.slice(0, suffixIndex);
  const suffix = suffixIndex < 0 ? '' : href.slice(suffixIndex);
  const prefix = path.split('/')[1];
  const targetLocale = routing.locales.includes(prefix as Locale) ? prefix : locale;
  if (!routing.locales.includes(targetLocale as Locale)) return null;
  if (targetLocale === prefix) path = path.slice(prefix.length + 1) || '/';
  path = path === '/' ? path : path.replace(/\/$/, '');
  if (/\.[a-z0-9]{2,8}$/i.test(path)) return null;
  return { path, suffix, locale: targetLocale };
}

function staticRoute(path: string): RouteKey | undefined {
  return (Object.keys(routing.pathnames) as RouteKey[]).find(route => {
    if (route.includes('[slug]')) return false;
    const pathname = routing.pathnames[route];
    return route === path || (typeof pathname === 'string' ? pathname === path : Object.values(pathname).some(value => value === path));
  });
}

function detailRoutes(path: string) {
  return Object.entries(contentRoutes).flatMap(([type, route]) => {
    const pathname = routing.pathnames[route];
    const patterns = new Set([route, ...(typeof pathname === 'string' ? [pathname] : Object.values(pathname))]);
    return [...patterns].flatMap(pattern => {
      const prefix = pattern.slice(0, pattern.indexOf('[slug]'));
      if (!path.startsWith(prefix)) return [];
      const slug = path.slice(prefix.length);
      if (!slug || slug.includes('/')) return [];
      try { return [{ type, route, slug: decodeURIComponent(slug) }]; } catch { return []; }
    });
  });
}

export function resolveRichTextLink(href: string, locale: string, inventory: SeoEntry[] = []): string {
  const parts = linkParts(href, locale);
  if (!parts) return href;
  const route = staticRoute(parts.path);
  if (route) return localizedPath(route, parts.locale) + parts.suffix;
  const candidates = detailRoutes(parts.path);
  const records = inventory.filter(entry => candidates.some(candidate => candidate.type === entry.type && Object.values(entry.slugs).includes(candidate.slug)));
  if (records.length !== 1) return href;
  const entry = records[0];
  const slug = entry.slugs[parts.locale as Locale];
  if (!slug) return href;
  return localizedPath(contentRoutes[entry.type], parts.locale, slug) + parts.suffix;
}

function decodeHref(value: string): string {
  return value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt);/gi, (entity, code: string) => {
    const named: Record<string, string> = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' };
    if (!code.startsWith('#')) return named[code.toLowerCase()] ?? entity;
    const point = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
    return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : entity;
  });
}

function anchors(html: string, resolve: (href: string) => string): string {
  return html.replace(/<!--[\s\S]*?-->|<(script|style|textarea)\b[^>]*>[\s\S]*?<\/\1\s*>|<\/?[a-z][^>"']*(?:(?:"[^"]*"|'[^']*')[^>"']*)*>/gi, tag => {
    if (!/^<a\s/i.test(tag)) return tag;
    const attributes = /(\s+)([\w:-]+)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s>]+))?/g;
    if ([...tag.matchAll(attributes)].some(attribute => attribute[2].toLowerCase() === 'download')) return tag;
    return tag.replace(attributes, (attribute, space: string, name: string, value?: string) => {
      if (name.toLowerCase() !== 'href' || !value) return attribute;
      const quoted = value.startsWith('"') || value.startsWith("'");
      const href = decodeHref(quoted ? value.slice(1, -1) : value);
      const result = resolve(href);
      if (result === href) return attribute;
      const escaped = result.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `${space}${name}="${escaped}"`;
    });
  });
}

export function normalizeRichTextHtml(html: string, locale: string, inventory: SeoEntry[] = []): string {
  return anchors(html, href => resolveRichTextLink(href, locale, inventory));
}

export function needsRichTextInventory(html: string, locale: string): boolean {
  let needed = false;
  anchors(html, href => {
    const parts = linkParts(href, locale);
    if (parts && !staticRoute(parts.path) && detailRoutes(parts.path).length) needed = true;
    return href;
  });
  return needed;
}
