'use client';

import { useTranslations } from 'next-intl';
import {
  EnergyRatingFormData,
  YesNoUnknown,
} from '@/types/energy-rating';

interface VentilationStepProps {
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

export default function VentilationStep({
  data,
  updateData,
}: VentilationStepProps) {
  const t = useTranslations('EpcPage.calculator.ventilation');

  const questions = [
    'naturalOpenings',
    'mechanicalExtraction',
    'mechanicalSupply',
    'heatRecovery',
  ] as const;

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

      <div className="flex flex-col gap-8">
        {questions.map((question) => (
          <div key={question}>
            <h4 className="text-base sm:text-lg text-gray-950 font-bold mb-4">
              {t(`${question}.question`)}
            </h4>

            <div className="grid grid-cols-3 gap-3">
              {ANSWERS.map((answer) => (
                <button
                  key={answer}
                  type="button"
                  onClick={() =>
                    updateData((previous) => ({
                      ...previous,
                      ventilation: {
                        ...previous.ventilation,
                        [question]: answer,
                      },
                    }))
                  }
                  className={`min-h-14 rounded-xl border font-bold ${
                    data.ventilation[question] === answer
                      ? 'border-[#1A669A] bg-[#1A669A]/5 text-[#1A669A]'
                    : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {t(`answers.${answer}`)}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}