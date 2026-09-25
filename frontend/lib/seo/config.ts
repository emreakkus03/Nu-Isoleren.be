import 'server-only';

export function siteOrigin(): string | null {
  if (process.env.DEPLOYMENT_ENV !== 'production') return null;
  const value = process.env.SITE_URL || 'https://nu-isoleren.be';
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash || /localhost|\.local$|\.test$|\.site$|^\d+\.\d+\.\d+\.\d+$/.test(url.hostname)) {
    throw new Error('SITE_URL must be a public HTTPS origin');
  }
  return url.origin;
}

export function indexingEnabled(): boolean {
  return siteOrigin() !== null && process.env.SEO_INDEXING_ENABLED === 'true';
}

export function publicImage(value?: string | null): string | undefined {
  if (!value || !siteOrigin()) return undefined;
  try {
    const url = new URL(value, process.env.MEDIA_URL || siteOrigin()!);
    if (url.protocol !== 'https:' || /localhost|127\.0\.0\.1|\.ddev\.|^10\.|^192\.168\./.test(url.hostname)) return undefined;
    return url.href;
  } catch { return undefined; }
}
