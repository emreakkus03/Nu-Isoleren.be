import { getTranslations } from 'next-intl/server';
import { pageMetadata } from '@/lib/seo/metadata';
import PolicyPage from '@/components/legal/PolicyPage';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'LegalPages' });
  return pageMetadata('/cookie-policy', locale, { title: t('cookies.title'), description: t('cookies.description') }, { indexable: false });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <PolicyPage locale={locale} kind="cookies" />;
}
