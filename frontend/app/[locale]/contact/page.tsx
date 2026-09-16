import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import ContactHero from '@/components/contact/ContactHero';
import ContactSection from '@/components/contact/ContactSection';
import ContactMap from '@/components/contact/ContactMap';

interface ContactPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: 'Seo.contact',
  });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function ContactPage({
  params,
}: ContactPageProps) {
  const { locale } = await params;

  return (
    <main className="w-full min-h-screen bg-white overflow-x-clip">
      <ContactHero locale={locale} />
      <ContactSection />
      <ContactMap />
    </main>
  );
}