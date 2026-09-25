import { timingSafeEqual } from 'node:crypto';
export const allowedTags = ['services', 'cities', 'articles', 'projects', 'materials', 'faqs', 'sitemap'] as const;
export function authorized(header: string | null, secret: string | undefined): boolean {
  if (!secret || secret.length < 32 || !header?.startsWith('Bearer ')) return false;
  const actual = Buffer.from(header.slice(7));
  const expected = Buffer.from(secret);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
export function validatedTags(value: unknown): string[] | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const data = value as Record<string, unknown>;
  if (Object.keys(data).some(key => key !== 'tags') || !Array.isArray(data.tags) || !data.tags.length || data.tags.length > allowedTags.length) return null;
  if (!data.tags.every(tag => typeof tag === 'string' && allowedTags.includes(tag as typeof allowedTags[number]))) return null;
  return [...new Set(data.tags)] as string[];
}
