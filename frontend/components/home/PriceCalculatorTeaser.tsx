'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const SERVICE_KEYS = [
  'cavityWall',
  'externalWall',
  'roofInsulation',
  'crepi',
  'facadeCleaning',
  'hydrofuge',
  'cavityEmptying',
  'risingDamp',
] as const;

type ServiceKey = (typeof SERVICE_KEYS)[number];

export default function PriceCalculatorTeaser() {
  const t = useTranslations('PriceCalculatorTeaser');
  const router = useRouter();

  const [selectedService, setSelectedService] = useState<ServiceKey>('cavityWall');

  const handleStartCalculation = () => {
    router.push(
      `/prijzen?service=${encodeURIComponent(selectedService)}` as Parameters<
        typeof router.push
      >[0],
    );
  };

  return (
    <section className="w-full bg-[#F8F9FA] py-12 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left gap-4 md:gap-6">
            <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase">
              {t('badge')}
            </span>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.2]">
              {t('title')}
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-lg">
              {t('subtitle')}
            </p>

            <ul className="flex flex-col items-start gap-2.5 pt-1 text-left">
              <li className="flex items-center gap-2.5 text-xs sm:text-sm md:text-base font-medium text-gray-800">
                <Image
                  src="/icons/red-check.svg"
                  alt="Check"
                  width={18}
                  height={18}
                  className="shrink-0"
                />
                <span>{t('usps.free')}</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs sm:text-sm md:text-base font-medium text-gray-800">
                <Image
                  src="/icons/red-check.svg"
                  alt="Check"
                  width={18}
                  height={18}
                  className="shrink-0"
                />
                <span>{t('usps.fast')}</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs sm:text-sm md:text-base font-medium text-gray-800">
                <Image
                  src="/icons/red-check.svg"
                  alt="Check"
                  width={18}
                  height={18}
                  className="shrink-0"
                />
                <span>{t('usps.noCommitment')}</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-7 md:p-9 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col gap-5 md:gap-7">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 text-center">
                {t('cardTitle')}
              </h3>

              <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                {SERVICE_KEYS.map((key) => {
                  const isSelected = selectedService === key;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedService(key)}
                      className={`py-2.5 px-2 sm:px-3 rounded-full text-[11px] sm:text-xs md:text-sm lg:text-base font-semibold transition text-center border leading-tight flex items-center justify-center min-h-[44px] cursor-pointer ${
                        isSelected
                          ? 'border-[#1A669A] bg-sky-50 text-sky-950 font-bold shadow-sm'
                          : 'border-gray-200 bg-gray-50/60 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
                      }`}
                    >
                      <span>{t(`services.${key}`)}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-center pt-1">
                <button
                  type="button"
                  onClick={handleStartCalculation}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#C82024] hover:bg-red-800 text-white font-bold text-sm sm:text-base px-6 py-3 rounded-full transition shadow-md hover:shadow-lg active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <span>{t('cta')}</span>
                  <span className="text-lg leading-none">&rarr;</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}