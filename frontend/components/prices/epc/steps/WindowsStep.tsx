'use client';

import { useTranslations } from 'next-intl';
import {
  EnergyRatingFormData,
  FrameType,
  GlazingType,
} from '@/types/energy-rating';

interface WindowsStepProps {
  data: EnergyRatingFormData;
  updateData: (
    updater: (previous: EnergyRatingFormData) => EnergyRatingFormData
  ) => void;
}

const GLAZING: GlazingType[] = [
  'single',
  'double',
  'high_efficiency_double',
  'triple',
  'mixed',
  'unknown',
];

const FRAMES: FrameType[] = [
  'wood',
  'pvc',
  'aluminium',
  'mixed',
  'unknown',
];

export default function WindowsStep({
  data,
  updateData,
}: WindowsStepProps) {
  const t = useTranslations('EpcPage.calculator.windows');

  return (
    <div>
      <div className="mb-8">
        <span className="text-sm font-extrabold tracking-wider text-[#1A669A] uppercase">
          {t('badge')}
        </span>

        <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-gray-950">
          {t('title')}
        </h3>

        <p className="mt-3 text-sm sm:text-base text-gray-600">
          {t('description')}
        </p>
      </div>

      <div className="flex flex-col gap-9">
        <div>
          <h4 className="text-base sm:text-lg text-gray-950 font-bold mb-4">
            {t('glazing.question')}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {GLAZING.map((glazing) => (
              <button
                key={glazing}
                type="button"
                onClick={() =>
                  updateData((previous) => ({
                    ...previous,
                    windows: {
                      ...previous.windows,
                      glazing,
                    },
                  }))
                }
                className={`min-h-14 px-5 py-4 rounded-xl border text-left font-bold ${
                  data.windows.glazing === glazing
                    ? "border-[#1A669A] bg-[#1A669A]/5 text-[#1A669A]"
                : "border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {t(`glazing.options.${glazing}`)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-base sm:text-lg  text-gray-950 font-bold mb-4">
            {t('frame.question')}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FRAMES.map((frame) => (
              <button
                key={frame}
                type="button"
                onClick={() =>
                  updateData((previous) => ({
                    ...previous,
                    windows: {
                      ...previous.windows,
                      frame,
                    },
                  }))
                }
                className={`min-h-14 px-5 py-4 rounded-xl border text-left font-bold ${
                  data.windows.frame === frame
                    ? 'border-[#1A669A] bg-[#1A669A]/5 text-[#1A669A]'
                    : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {t(`frame.options.${frame}`)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}