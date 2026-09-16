import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

interface AreasHeroProps {
  breadcrumbs: { label: string; href?: string }[];
}

export default function AreasHero({ breadcrumbs }: AreasHeroProps) {
  const t = useTranslations('ServiceAreas');

  return (
    <section className="relative w-full min-h-[380px] sm:min-h-[420px] lg:min-h-[460px] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/areas-hero.jpg"
          alt={t('title')}
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

     <div 
  className="absolute inset-0 z-10"
  style={{
    background: 'linear-gradient(to right, rgba(15, 23, 42, 0.75) 0%, rgba(15, 23, 42, 0.65) 30%, rgba(15, 23, 42, 0.35) 55%, transparent 85%)'
  }}
/>

      <div className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex flex-col justify-center">
        <div className="relative   text-white/80 [&_a]:text-white/80 [&_a:hover]:text-white [&_span]:text-white bottom-11">
          <Breadcrumbs items={breadcrumbs} />
        </div>
        

        <div className="max-w-2xl lg:max-w-3xl flex flex-col items-start gap-3 sm:gap-4 text-white">
          <span className="text-xs sm:text-sm font-bold tracking-wider text-[#fb0f12] uppercase">
            {t('badge')}
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.15] text-white tracking-tight">
            {t('title')}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-200 font-normal leading-relaxed max-w-xl">
            {t('intro')}
          </p>
        </div>

      </div>
    </section>
  );
}