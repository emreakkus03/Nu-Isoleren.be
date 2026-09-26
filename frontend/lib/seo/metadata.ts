import type { Metadata } from 'next';
import { indexingEnabled, siteOrigin } from './config';
import {
  contentRoutes,
  languageTags,
  localizedPath,
  type ContentType,
  type Locale,
  type RouteKey,
} from './urls';
import { resolveSeoEntry } from './inventory';

export function pageMetadata(
  route: RouteKey,
  locale: string,
  existing: Metadata,
  options: {
    slugs?: Partial<Record<Locale, string>>;
    indexable?: boolean;
    page?: number;
    filtered?: boolean;
  } = {}
): Metadata {
  const origin = siteOrigin();

  const index =
    indexingEnabled() &&
    options.indexable !== false &&
    !options.filtered;

  const path = localizedPath(
    route,
    locale,
    options.slugs?.[locale as Locale]
  );

  const suffix =
    options.page && options.page > 1
      ? `?page=${options.page}`
      : '';

  const languages = Object.fromEntries(
    Object.entries(languageTags).flatMap(([lang, tag]) => {
      if (options.slugs && !options.slugs[lang as Locale]) {
        return [];
      }

      return [
        [
          tag,
          `${origin}${localizedPath(
            route,
            lang,
            options.slugs?.[lang as Locale]
          )}${suffix}`,
        ],
      ];
    })
  );

  if (languages['nl-BE']) {
    languages['x-default'] = languages['nl-BE'];
  }

  const oldOg = existing.openGraph;

  const finalImages = origin
    ? [
        {
          url: `${origin}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: 'Nu-Isoleren',
        },
      ]
    : [];

  return {
    ...existing,

    metadataBase: origin
      ? new URL(origin)
      : undefined,

    alternates: origin
      ? {
          canonical: `${origin}${path}${suffix}`,
          languages: index
            ? languages
            : undefined,
        }
      : undefined,

    robots: {
      index,
      follow: true,
    },

    openGraph: {
      ...oldOg,
      title: existing.title || undefined,
      description: existing.description || undefined,
      url: origin
        ? `${origin}${path}${suffix}`
        : undefined,
      locale:
        locale === 'nl'
          ? 'nl_BE'
          : locale === 'fr'
            ? 'fr_BE'
            : 'en',
      alternateLocale: Object.keys(languages)
        .filter(
          language =>
            language !== 'x-default' &&
            language !== languageTags[locale as Locale]
        )
        .map(language => language.replace('-', '_')),
      images: finalImages,
      type: 'website',
      siteName: 'Nu-Isoleren.be',
    },

    twitter: {
      card: 'summary_large_image',
      title: existing.title || undefined,
      description: existing.description || undefined,
      images: finalImages,
    },
  };
}

export async function contentMetadata(
  type: ContentType,
  locale: string,
  slug: string,
  existing: Metadata
): Promise<Metadata> {
  const entry = await resolveSeoEntry(
    type,
    locale,
    slug
  );

  if (!entry) {
    return {
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  return pageMetadata(
    contentRoutes[type],
    locale,
    existing,
    {
      slugs: entry.slugs,
      indexable: entry.is_indexable,
    }
  );
}