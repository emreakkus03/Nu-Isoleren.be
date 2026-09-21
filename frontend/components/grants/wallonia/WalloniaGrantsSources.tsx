import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

interface WalloniaGrantsSourcesProps {
  locale: string;
}

export default async function WalloniaGrantsSources({
  locale,
}: WalloniaGrantsSourcesProps) {
  const t = await getTranslations({
    locale,
    namespace: 'WalloniaGrantsPage.sources',
  });

  return (
    <section className="w-full bg-white py-14 md:py-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                href="https://www.wallonie.be/fr/demarches/obtenir-une-prime-pour-son-habitation-partir-du-14-fevrier-2025"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-[#1A669A] hover:underline"
              >
                {t('current')} ↗
              </a>

              <a
                href="https://energie.wallonie.be/actualite/renovation-energetique-les-grandes-lignes-du-futur-regime-de-soutien-sont-connues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-[#1A669A] hover:underline"
              >
                {t('new')} ↗
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