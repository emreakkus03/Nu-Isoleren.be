import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import type { ComponentProps } from 'react';

interface CtaBannerProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
}

export default function CtaBanner({
  title,
  description,
  buttonText,
  buttonHref = '/quote',
}: CtaBannerProps) {
  const t = useTranslations('CtaBanner');

  return (
    <section className="w-full py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#C82024] rounded-2xl p-5 sm:p-12 max-md:text-center lg:p-16 flex flex-col md:flex-row md:items-center md:justify-between gap-8 shadow-sm">
          
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug mb-3 max-md:text-balance max-md:[overflow-wrap:anywhere] max-md:w-full max-md:text-center">
              {title || t('title')}
            </h2>
            <p className="text-white/90 text-sm sm:text-base lg:text-lg leading-relaxed font-normal">
              {description || t('description')}
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href={(buttonHref || t('buttonHref')) as ComponentProps<typeof Link>['href']}
              className="inline-flex max-md:max-w-full max-md:justify-center items-center gap-2.5 bg-white hover:bg-slate-50 text-[#C82024] text-sm sm:text-base font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-full transition shadow-sm hover:shadow-md active:scale-95 group"
            >
              <span>{buttonText || t('button')}</span>
              <svg
                className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}