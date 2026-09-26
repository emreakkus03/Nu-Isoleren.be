import { getTranslations } from 'next-intl/server';
import { pageMetadata } from '@/lib/seo/metadata';
import ThankYouPage from '@/components/legal/ThankYouPage';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ThankYouPage' });
  return pageMetadata('/thank-you/contact', locale, { title: t('contact.title'), description: t('contact.description') }, { indexable: false });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <ThankYouPage locale={locale} kind="contact" />;
}
