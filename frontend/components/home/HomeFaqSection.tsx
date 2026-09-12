import { getLocale, getTranslations } from 'next-intl/server';
import { getFaqs } from '@/lib/faqs';
import { Link } from '@/i18n/routing';
import HomeFaqAccordion from '@/components/home/HomeFaqAccordion';

export default async function FaqHomeSection() {
  const locale = await getLocale();
  const t = await getTranslations('HomePage.faq');

  const faqs = await getFaqs(locale, { featuredHome: true });

  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <section className="py-20 sm:py-28 bg-white border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center flex flex-col gap-4 md:gap-6 mb-12 sm:mb-16">
          <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase">
            {t('badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            {t('title')}
          </h2>
        </div>

        <HomeFaqAccordion faqs={faqs} />

        <div className="flex flex-col items-center justify-center gap-1 mt-12 text-center">
          <p className="text-slate-900 font-medium text-base sm:text-lg">
            {t('notListed')}
          </p>
          <Link
            href="/faq"
            className="group inline-flex items-center gap-2 text-[#C82024] font-bold text-base sm:text-lg hover:underline transition"
          >
            <span>{t('viewAll')}</span>
            <svg
              className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}