import 'server-only';
import { getTranslations } from 'next-intl/server';
import { siteOrigin, publicImage } from './config';
import { localizedPath } from './urls';
import type { ServiceItem } from '@/types/service';
import type { KnowledgeArticleDetail } from '@/types/knowledge';
export async function businessSchema() {
  const origin = siteOrigin();
  if (!origin) return null;
  const t = await getTranslations('General.company');
  return { '@context': 'https://schema.org', '@type': 'HomeAndConstructionBusiness', '@id': `${origin}/#organization`, name: t('name'), url: origin, logo: `${origin}/logo/logo.svg`, telephone: t('phoneHref'), address: { '@type': 'PostalAddress', streetAddress: 'Neerstraat 5', postalCode: '9220', addressLocality: 'Hamme', addressCountry: 'BE' }, openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '17:00' }] };
}
export function serviceSchema(service: ServiceItem, locale: string) {
  const origin = siteOrigin();
  if (!origin) return null;
  const url = origin + localizedPath('/services/[slug]', locale, service.slug);
  return { '@context': 'https://schema.org', '@type': 'Service', '@id': `${url}#service`, name: service.name, serviceType: service.name, description: service.short_description || undefined, url, provider: { '@id': `${origin}/#organization` } };
}
export function articleSchema(article: KnowledgeArticleDetail, locale: string) {
  const origin = siteOrigin();
  if (!origin) return null;
  const url = origin + localizedPath('/knowledge/[slug]', locale, article.slug);
  return { '@context': 'https://schema.org', '@type': 'Article', '@id': `${url}#article`, headline: article.title, description: article.excerpt || undefined, image: publicImage(article.hero_image), datePublished: article.published_at || undefined, dateModified: article.updated_at || undefined, publisher: { '@id': `${origin}/#organization` }, mainEntityOfPage: url, inLanguage: locale };
}
