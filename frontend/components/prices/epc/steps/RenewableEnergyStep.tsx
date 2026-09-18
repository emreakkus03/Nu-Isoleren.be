'use client';

import { useTranslations } from 'next-intl';
import {
  EnergyRatingFormData,
  YesNoUnknown,
} from '@/types/energy-rating';

interface RenewableEnergyStepProps {
  data: EnergyRatingFormData;
  updateData: (
    updater: (previous: EnergyRatingFormData) => EnergyRatingFormData
  ) => void;
}

const ANSWERS: YesNoUnknown[] = [
  'yes',
  'no',
  'unknown',
];

export default function RenewableEnergyStep({
  data,
  updateData,
}: RenewableEnergyStepProps) {
  const t = useTranslations('EpcPage.calculator.renewable');

  return (
    <div>
      <div className="mb-8">
        <span className="text-sm font-extrabold tracking-wider text-[#1A669A] uppercase">
          {t('badge')}
        </span>

        <h3 className="mt-2 text-2xl sm:text-3xl text-gray-950 font-extrabold">
          {t('title')}
        </h3>

        <p className="mt-3 text-sm sm:text-base text-gray-600">
          {t('description')}
        </p>
      </div>

      <div className="flex flex-col gap-9">
        <div>
          <h4 className="text-base sm:text-lg text-gray-950 font-bold mb-4">
            {t('solarPanels.question')}
          </h4>

          <div className="grid grid-cols-3 gap-3">
            {ANSWERS.map((answer) => (
              <button
                key={answer}
                type="button"
                onClick={() =>
                  updateData((previous) => ({
                    ...previous,
                    renewableEnergy: {
                      ...previous.renewableEnergy,
                      solarPanels: answer,
                      solarPowerKwp:
                        answer === 'yes'
                          ? previous.renewableEnergy.solarPowerKwp
                          : null,
                    },
                  }))
                }
                className={`min-h-14 rounded-xl border font-bold ${
                  data.renewableEnergy.solarPanels === answer
                    ?'border-[#1A669A] bg-[#1A669A]/5 text-[#1A669A]'
                    : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {t(`answers.${answer}`)}
              </button>
            ))}
          </div>
        </div>

        {data.renewableEnergy.solarPanels === 'yes' && (
          <div className="max-w-sm">
            <label className="block text-base text-gray-950 sm:text-lg font-bold mb-3">
              {t('solarPower.label')}
            </label>

            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.1"
                placeholder={t('solarPower.placeholder')}
                value={data.renewableEnergy.solarPowerKwp ?? ''}
                onChange={(event) =>
                  updateData((previous) => ({
                    ...previous,
                    renewableEnergy: {
                      ...previous.renewableEnergy,
                      solarPowerKwp: event.target.value
                        ? Number(event.target.value)
                        : null,
                    },
                  }))
                }
                className="w-full h-14 pl-4 pr-16 rounded-xl border text-gray-950 border-gray-200"
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                kWp
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              {t('solarPower.help')}
            </p>
          </div>
        )}

        <div>
          <h4 className="text-base sm:text-lg text-gray-950 font-bold mb-4">
            {t('solarThermal.question')}
          </h4>

          <div className="grid grid-cols-3 gap-3">
            {ANSWERS.map((answer) => (
              <button
                key={answer}
                type="button"
                onClick={() =>
                  updateData((previous) => ({
                    ...previous,
                    renewableEnergy: {
                      ...previous.renewableEnergy,
                      solarThermal: answer,
                    },
                  }))
                }
                className={`min-h-14 rounded-xl border font-bold ${
                  data.renewableEnergy.solarThermal === answer
                    ? 'border-[#1A669A] bg-[#1A669A]/5 text-[#1A669A]'
                    : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {t(`answers.${answer}`)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}