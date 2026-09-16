import { getTranslations } from 'next-intl/server';

import Breadcrumbs from '@/components/ui/Breadcrumbs';

interface ContactHeroProps {
  locale: string;
}

export default async function ContactHero({
  locale,
}: ContactHeroProps) {
  const [t, tBreadcrumb] = await Promise.all([
    getTranslations({
      locale,
      namespace: 'ContactPage',
    }),
    getTranslations({
      locale,
      namespace: 'Breadcrumbs',
    }),
  ]);

  const breadcrumbs = [
    {
      label: tBreadcrumb('home'),
      href: '/',
    },
    {
      label: t('hero.breadcrumb'),
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[#123F5A]">
      <div className="absolute -top-24 -right-24 w-[380px] h-[380px] rounded-full bg-white/[0.04]" />

      <div className="absolute -bottom-40 right-[20%] w-[420px] h-[420px] rounded-full bg-[#1A669A]/20" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="mb-8 text-white/70 [&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-white/90 text-xs sm:text-sm">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className="max-w-3xl flex flex-col items-start gap-4">
          <span className="text-sm md:text-base font-extrabold tracking-wider text-red-400 uppercase">
            {t('hero.badge')}
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            {t('hero.title')}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed max-w-2xl">
            {t('hero.description')}
          </p>
        </div>
      </div>
    </section>
  );
}