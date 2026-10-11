import 'server-only';
import { getSeoInventory, type SeoEntry } from '@/lib/seo/inventory';
import { needsRichTextInventory, normalizeRichTextHtml } from './rich-text-links';

function mapHtml(value: unknown, transform: (html: string) => string): unknown {
  if (typeof value === 'string') return /<a\s/i.test(value) ? transform(value) : value;
  if (Array.isArray(value)) return value.map(item => mapHtml(item, transform));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, mapHtml(item, transform)]));
  return value;
}

export async function localizeCmsRichText<T>(content: T, locale: string): Promise<T> {
  let needsInventory = false;
  mapHtml(content, html => {
    if (needsRichTextInventory(html, locale)) needsInventory = true;
    return html;
  });
  let inventory: SeoEntry[] = [];
  if (needsInventory) {
    try { inventory = await getSeoInventory(); } catch { inventory = []; }
  }
  return mapHtml(content, html => normalizeRichTextHtml(html, locale, inventory)) as T;
}
