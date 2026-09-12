import { getTranslations } from 'next-intl/server';
import { getFaqs } from '@/lib/faqs';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import FaqSection from '@/components/faq/FaqSection';
import { Link } from '@/i18n/routing';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Seo.faq' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

interface FaqPageProps {
  params: Promise<{ locale: string }>;
}

export default async function FaqPage({ params }: FaqPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'FaqPage' });
  const tBreadcrumb = await getTranslations({ locale, namespace: 'Breadcrumbs' });
  const tFloating = await getTranslations({ locale, namespace: 'Floating' });

  const faqs = await getFaqs(locale);

  const breadcrumbs = [
    { label: tBreadcrumb('home'), href: '/' },
    { label: tBreadcrumb('faq') },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer.replace(/<[^>]*>?/gm, ''),
      },
    })),
  };

  const rawPhoneNumber = tFloating('number').replace(/[^0-9+]/g, '');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-white pt-16 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 mt-16 sm:mt-24">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              {t('title')}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {t('subtitle')}
            </p>
          </div>

          <FaqSection
            faqs={faqs}
            labels={{
              all: t('filterAll'),
              searchPlaceholder: t('searchPlaceholder'),
              noResults: t('noResults'),
              general: t('filterGeneral'),
            }}
          />

          <div className="mt-20 sm:mt-32 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-12 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="text-center sm:text-left max-w-lg">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                {t('cta.title')}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {t('cta.description')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto shrink-0">
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-full bg-[#C82024] hover:bg-[#b01c20] text-white text-sm sm:text-base font-semibold sm:font-bold transition text-center shadow-sm"
              >
                {t('cta.quoteButton')}
              </Link>
              <a
                href={`tel:${rawPhoneNumber}`}
                className="w-full sm:w-auto px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-full border border-slate-200 text-slate-800 text-sm sm:text-base font-semibold sm:font-bold hover:bg-slate-50 transition text-center"
              >
                {t('cta.phoneButton')}
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}