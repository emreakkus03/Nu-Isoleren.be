import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

interface BrusselsGrantsSourcesProps {
  locale: string;
}

const regionUrls: Record<string, string> = {
  nl: 'https://be.brussels/nl/huisvesting/bouwen-en-verbouwen/premies-belastingen-en-financiering-van-renovaties',
  fr: 'https://be.brussels/fr/logement/construction-et-renovation/primes-fiscalite-et-financement-la-renovation',
  en: 'https://be.brussels/en/housing/construction-and-renovation/renovation-subsidies-and-financial-support',
};

const homegradeUrls: Record<string, string> = {
  nl: 'https://homegrade.brussels/nl/financiele-steun/ecoreno-krediet/',
  fr: 'https://homegrade.brussels/aides-financieres/credit-ecoreno/',
  en: 'https://homegrade.brussels/nl/financiele-steun/ecoreno-krediet/',
};

export default async function BrusselsGrantsSources({
  locale,
}: BrusselsGrantsSourcesProps) {
  const t = await getTranslations({
    locale,
    namespace: 'BrusselsGrantsPage.sources',
  });

  const regionUrl = regionUrls[locale] ?? regionUrls.nl;
  const homegradeUrl = homegradeUrls[locale] ?? homegradeUrls.nl;

  return (
    <section className="w-full bg-white py-14 md:py-18">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div className="max-w-3xl">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-950 max-md:text-balance max-md:[overflow-wrap:anywhere] max-md:w-full max-md:text-center">
              {t('title')}
            </h2>

            <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed max-md:text-center">
              {t('description')}
            </p>

            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
              <a
                href={regionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-[#1A669A] hover:underline"
              >
                {t('region')} ↗
              </a>

              <a
                href={homegradeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-[#1A669A] hover:underline"
              >
                {t('homegrade')} ↗
              </a>
            </div>
          </div>

          <Link
            href="/grants"
            className="text-sm font-bold text-[#C82024] hover:underline shrink-0"
          >
            ← {t('back')}
          </Link>
        </div>
      </div>
    </section>
  );
}