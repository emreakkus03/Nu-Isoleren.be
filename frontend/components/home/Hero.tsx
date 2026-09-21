import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function Hero() {
  const t = useTranslations('Hero');

  return (
    <section className="relative w-full min-h-[580px] md:min-h-[640px] lg:min-h-[700px] flex items-center overflow-hidden">
      <div className="absolute inset-0 -z-20">
        <Image
          src="/images/hero.jpg"
          alt="Nu-Isoleren Gevelwerken en Spouwmuurisolatie"
          fill
          priority
          quality={95}
          sizes="100vw"
          className="object-cover object-[65%_center] md:object-center"
        />
      </div>

      <div className="absolute inset-0 -z-10 bg-black/50 md:hidden" />

      <div
        className="absolute inset-0 -z-10 hidden md:block"
        style={{
          background:
            'linear-gradient(to right, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.45) 29%, rgba(0,0,0,0.35) 51%, rgba(0,0,0,0) 70%, transparent 100%)',
        }}
      />

      <div className="max-w-7xl w-full mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="w-full md:max-w-2xl lg:max-w-3xl flex flex-col items-center md:items-start gap-4 text-white text-center md:text-left">
          <span className="text-xs md:text-sm lg:text-base font-bold tracking-wider text-gray-200 uppercase">
            {t('badge')}
          </span>

          <h1 className="text-3xl md:text-4xl lg:text-[50px] font-extrabold leading-[1.15] text-white tracking-tight max-w-[340px] sm:max-w-xl md:max-w-none max-md:text-balance max-md:[overflow-wrap:anywhere]">
            {t('title')}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-200 font-normal leading-relaxed max-w-xl">
            {t('subtitle')}
          </p>

          <div className="pt-2 flex justify-center md:justify-start w-full">
            <Link
              href="/"
              className="inline-block bg-[#C82024] hover:bg-red-800 text-white text-base md:text-lg font-bold px-5 py-2 max-md:min-h-11 max-md:inline-flex max-md:items-center max-md:justify-center lg:px-5 lg:py-3 lg:text-xl rounded-full transition shadow-lg hover:shadow-xl active:scale-95"
            >
              {t('cta')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}