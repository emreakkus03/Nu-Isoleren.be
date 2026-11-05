
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function Hero() {
  const t = useTranslations('Hero');

  return (
    <>
      <section className="relative isolate flex w-full min-h-[640px] sm:min-h-[620px] md:min-h-[620px] lg:min-h-[700px] items-center overflow-hidden">
        <div className="absolute inset-0 -z-20">
          <Image
            src="/images/hero.jpg"
            alt="Nu-Isoleren gevelwerken en spouwmuurisolatie"
            fill
            loading="eager"
            fetchPriority="high"
            quality={60}
            sizes="100vw"
            className="object-cover object-[65%_center] md:object-center"
          />
        </div>

        <div className="absolute inset-0 -z-10 bg-black/60 md:hidden" />

        <div
          className="absolute inset-0 -z-10 hidden md:block"
          style={{
            background:
              'linear-gradient(to right, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.58) 32%, rgba(0,0,0,0.38) 58%, rgba(0,0,0,0.08) 85%, transparent 100%)',
          }}
        />

        <div className="pointer-events-none absolute right-4 top-4 z-10 md:hidden">
          <Image
            src="/badges/top_pro_01_2026.svg"
            alt="Trustlocal Top Pro januari 2026"
            width={160}
            height={190}
            className="h-auto w-[88px] drop-shadow-[0_5px_12px_rgba(0,0,0,0.35)]"
          />
        </div>

       
<div className="pointer-events-none absolute inset-0 z-10 hidden md:block">
  <div className="relative mx-auto h-full w-full max-w-7xl">
    <div className="absolute right-6 top-6 flex items-start gap-3 lg:right-6 lg:top-10 lg:gap-4">
      <Image
        src="/badges/top_pro_01_2026.svg"
        alt="Trustlocal Top Pro januari 2026"
        width={160}
        height={190}
        className="h-auto w-[115px] drop-shadow-[0_6px_16px_rgba(0,0,0,0.35)] lg:w-[140px]"
      />

      <Image
        src="/badges/top_score_2026.svg"
        alt="Trustlocal Top Score 2026"
        width={150}
        height={170}
        className="mt-2 h-auto w-[95px] drop-shadow-[0_6px_16px_rgba(0,0,0,0.35)] lg:w-[115px]"
      />
    </div>
  </div>
</div>


        <div className="mx-auto w-full max-w-7xl px-4 pb-12 pt-16 sm:px-6 sm:pb-16 sm:pt-32 md:py-24">
          <div className="flex w-full flex-col items-center gap-4 text-center text-white md:max-w-[720px] md:items-start md:gap-6 md:text-left">
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-gray-200 sm:text-xs md:text-sm lg:text-base">
              {t('badge')}
            </span>

            <h1 className="max-w-[620px] text-balance text-[30px] font-extrabold leading-[1.17] tracking-tight text-white sm:text-[38px] md:text-[44px] lg:text-[52px]">
              {t('title')}
            </h1>

            <p className="max-w-[610px] text-[13px] font-normal leading-[1.65] text-gray-100 sm:text-base md:text-lg">
              {t('subtitle')}
            </p>

            <div className="flex w-full flex-col items-center justify-center gap-2 pt-3 sm:flex-row sm:gap-6 md:justify-start">
              <Link
                href="/quote"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#C82024] px-6 py-3 text-center text-sm font-bold text-white shadow-lg transition-all duration-200 hover:bg-[#AD1B20] hover:shadow-xl active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:text-base lg:px-7 lg:py-3.5"
              >
                <span>{t('ctaPrimary')}</span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="shrink-0"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>

              <Link
                href="/services"
                className="inline-flex min-h-11 items-center justify-center gap-2 text-sm font-semibold text-white underline decoration-white/60 underline-offset-4 transition-colors hover:text-gray-200 hover:decoration-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:text-base"
              >
                <span>{t('ctaSecondary')}</span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="shrink-0"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-center gap-3 border-b border-gray-100 bg-white px-4 py-3 md:hidden">
        <Image
          src="/badges/top_score_2026.svg"
          alt="Trustlocal Top Score 2026"
          width={100}
          height={110}
          className="h-auto w-12 shrink-0"
        />

        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold text-gray-900">
            Trustlocal Top Score 2026
          </span>
          <span className="text-xs text-gray-500">
            Nu-Isoleren.be
          </span>
        </div>
      </div>
    </>
  );
}
