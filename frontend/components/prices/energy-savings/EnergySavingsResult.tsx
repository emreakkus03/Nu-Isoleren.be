'use client';

import { useTranslations } from 'next-intl';

import { EnergySavingsResult as EnergySavingsResultType } from '@/types/energy-savings';

interface EnergySavingsResultProps {
  result: EnergySavingsResultType;
  onReset: () => void;
}

export default function EnergySavingsResult({
  result,
  onReset,
}: EnergySavingsResultProps) {
  const t = useTranslations(
    'EnergySavingsPage.calculator.result'
  );

  return (
    <div className="py-3 sm:py-5">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-sm font-extrabold tracking-wider text-[#1A669A] uppercase">
          {t('badge')}
        </span>

        <h3 className="mt-3 text-2xl sm:text-3xl font-extrabold text-gray-950">
          {t('title')}
        </h3>

        <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
          {t('description')}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-[#F8F9FA] p-6 text-center">
          <p className="text-sm font-semibold text-gray-500">
            {t('energy')}
          </p>

          <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-950">
            {result.estimatedEnergySavingKwh.toLocaleString()}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            kWh / {t('year')}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-[#F8F9FA] p-6 text-center">
          <p className="text-sm font-semibold text-gray-500">
            {t('percentage')}
          </p>

          <p className="mt-2 text-4xl font-extrabold text-[#1A669A]">
            ± {result.estimatedPercentageSaving}%
          </p>

          <p className="mt-1 text-sm text-gray-500">
            {t('heatingEnergy')}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        <p className="text-sm font-bold text-gray-950">
          {t('range')}
        </p>

        <p className="mt-2 text-lg sm:text-xl font-extrabold text-gray-950">
          {result.energySavingMinKwh.toLocaleString()}
          {' – '}
          {result.energySavingMaxKwh.toLocaleString()}
          {' kWh'}
        </p>

        <p className="mt-1 text-sm text-gray-500">
          {t('rangeDescription')}
        </p>
      </div>

      {result.estimatedCostSaving !== null &&
        result.costSavingMin !== null &&
        result.costSavingMax !== null && (
          <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
            <p className="text-sm font-semibold text-gray-500">
              {t('cost')}
            </p>

            <p className="mt-2 text-3xl font-extrabold text-gray-950">
              ± €{' '}
              {result.estimatedCostSaving.toLocaleString()}
            </p>

            <p className="mt-2 text-sm text-gray-600">
              €{' '}
              {result.costSavingMin.toLocaleString()}
              {' – € '}
              {result.costSavingMax.toLocaleString()}
              {' '}
              {t('perYear')}
            </p>
          </div>
        )}

      <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
        <p className="text-sm text-amber-950 leading-relaxed">
          {t('warning')}
        </p>
      </div>

      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-6 py-3 font-bold text-gray-800 transition hover:bg-gray-50"
        >
          {t('again')}
        </button>
      </div>
    </div>
  );
}