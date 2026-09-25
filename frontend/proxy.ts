import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { routing } from '@/i18n/routing';

const handleLocale = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const response = handleLocale(request);

  if (
    process.env.DEPLOYMENT_ENV !== 'production' ||
    process.env.SEO_INDEXING_ENABLED !== 'true'
  ) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};