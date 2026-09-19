import { getTranslations } from 'next-intl/server';

interface KnowledgeHeroProps {
  locale: string;
}

export default async function KnowledgeHero({
  locale,
}: KnowledgeHeroProps) {
  const t = await getTranslations({
    locale,
    namespace: 'KnowledgePage.hero',
  });

  return (
    <section className="w-full bg-white pt-12 pb-10 md:pt-20 md:pb-14 lg:pt-24 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase">
            {t('badge')}
          </span>

          <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-950 tracking-tight leading-[1.1]">
            {t('title')}
          </h1>

          <p className="mt-5 text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl">
            {t('description')}
          </p>
        </div>
      </div>
    </section>
  );
}