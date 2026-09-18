import { getLocale, getTranslations } from 'next-intl/server';
import { getFaqs } from '@/lib/faqs';

function stripHtml(html: string) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export default async function EpcFaqSection() {
  const locale = await getLocale();
  const t = await getTranslations('EpcPage.faq');

  const faqs = await getFaqs(locale, {
    category: 'epc',
  });

  if (!faqs || faqs.length === 0) {
    return null;
  }

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: stripHtml(faq.answer),
      },
    })),
  };

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData),
        }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase">
            {t('badge')}
          </span>

          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15]">
            {t('title')}
          </h2>

          <p className="mt-5 text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {t('description')}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4">
          {faqs.map((faq) => (
            <details
              key={faq.id}
              className="group bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <summary className="cursor-pointer list-none px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition">
                <h3 className="font-semibold text-slate-900 text-sm sm:text-lg leading-snug">
                  {faq.question}
                </h3>

                <span className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border border-slate-200 text-slate-500 bg-slate-50 transition-all duration-200 group-open:bg-[#C82024] group-open:border-[#C82024] group-open:text-white group-open:rotate-180">
                  <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </summary>

              <div className="px-5 sm:px-8 pb-5 sm:pb-7 pt-4 border-t border-slate-100">
                <div
                  className="text-slate-600 text-sm sm:text-base leading-relaxed
                  [&_p]:mb-3
                  [&_p:last-child]:mb-0
                  [&_ul]:list-disc
                  [&_ul]:pl-5
                  [&_ul]:mb-3
                  [&_ul]:space-y-1
                  [&_ol]:list-decimal
                  [&_ol]:pl-5
                  [&_ol]:mb-3
                  [&_ol]:space-y-1
                  [&_li]:text-slate-600
                  [&_strong]:text-slate-900
                  [&_strong]:font-semibold
                  [&_a]:text-[#C82024]
                  [&_a]:font-semibold
                  hover:[&_a]:underline"
                  dangerouslySetInnerHTML={{
                    __html: faq.answer,
                  }}
                />
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}