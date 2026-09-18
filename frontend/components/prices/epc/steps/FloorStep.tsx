'use client';

import { useTranslations } from 'next-intl';
import {
  EnergyRatingFormData,
  FloorBoundary,
  InsulationMaterial,
  YesNoUnknown,
} from '@/types/energy-rating';

interface FloorStepProps {
  data: EnergyRatingFormData;
  updateData: (
    updater: (previous: EnergyRatingFormData) => EnergyRatingFormData
  ) => void;
}

const BOUNDARIES: FloorBoundary[] = [
  'ground',
  'basement',
  'crawl_space',
  'outside',
  'heated_space',
  'unknown',
];

const ANSWERS: YesNoUnknown[] = ['yes', 'no', 'unknown'];

const MATERIALS: InsulationMaterial[] = [
  'mineral_wool',
  'pir_pur',
  'eps_xps',
  'cellulose_wood_fibre',
  'other',
  'unknown',
];

export default function FloorStep({
  data,
  updateData,
}: FloorStepProps) {
  const t = useTranslations('EpcPage.calculator.floor');

  const setBoundary = (boundary: FloorBoundary) => {
    updateData((previous) => ({
      ...previous,
      floor: {
        ...previous.floor,
        boundary,
        ...(boundary === 'heated_space'
          ? {
              insulated: null,
              insulationMaterial: null,
              insulationThicknessCm: null,
            }
          : {}),
      },
    }));
  };

  const setInsulated = (insulated: YesNoUnknown) => {
    updateData((previous) => ({
      ...previous,
      floor: {
        ...previous.floor,
        insulated,
        ...(insulated !== 'yes'
          ? {
              insulationMaterial: null,
              insulationThicknessCm: null,
            }
          : {}),
      },
    }));
  };

  const setMaterial = (insulationMaterial: InsulationMaterial) => {
    updateData((previous) => ({
      ...previous,
      floor: {
        ...previous.floor,
        insulationMaterial,
        insulationThicknessCm:
          insulationMaterial === 'unknown'
            ? null
            : previous.floor.insulationThicknessCm,
      },
    }));
  };

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
          <h4 className="text-base sm:text-lg font-bold  text-gray-950 mb-4">
            {t('boundary.question')}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BOUNDARIES.map((boundary) => (
              <button
                key={boundary}
                type="button"
                onClick={() => setBoundary(boundary)}
                className={`min-h-14 px-5 py-4 rounded-xl border text-left font-bold ${
                  data.floor.boundary === boundary
                   ? 'border-[#1A669A] bg-[#1A669A]/5 text-[#1A669A]'
                      : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {t(`boundary.options.${boundary}`)}
              </button>
            ))}
          </div>
        </div>

        {data.floor.boundary &&
          data.floor.boundary !== 'heated_space' && (
            <div>
              <h4 className="text-base sm:text-lg  text-gray-950 font-bold mb-4">
                {t('insulated.question')}
              </h4>

              <div className="grid grid-cols-3 gap-3">
                {ANSWERS.map((answer) => (
                  <button
                    key={answer}
                    type="button"
                    onClick={() => setInsulated(answer)}
                    className={`min-h-14 rounded-xl border font-bold ${
                      data.floor.insulated === answer
                            ? 'border-[#1A669A] bg-[#1A669A]/5 text-[#1A669A]'
                            : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {t(`answers.${answer}`)}
                  </button>
                ))}
              </div>
            </div>
          )}

        {data.floor.insulated === 'yes' && (
          <>
            <div>
              <h4 className="text-base sm:text-lg  text-gray-950 font-bold mb-4">
                {t('material.question')}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MATERIALS.map((material) => (
                  <button
                    key={material}
                    type="button"
                    onClick={() => setMaterial(material)}
                    className={`min-h-14 px-5 py-4 rounded-xl border text-left font-bold ${
                      data.floor.insulationMaterial === material
                        ? 'border-[#1A669A] bg-[#1A669A]/5 text-[#1A669A]'
                        : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {t(`material.options.${material}`)}
                  </button>
                ))}
              </div>
            </div>

            {data.floor.insulationMaterial &&
              data.floor.insulationMaterial !== 'unknown' && (
                <div className="max-w-sm">
                  <label className="block text-base sm:text-lg text-gray-950 font-bold mb-3">
                    {t('thickness.label')}
                  </label>

                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={data.floor.insulationThicknessCm ?? ''}
                      onChange={(event) =>
                        updateData((previous) => ({
                          ...previous,
                          floor: {
                            ...previous.floor,
                            insulationThicknessCm: event.target.value
                              ? Number(event.target.value)
                              : null,
                          },
                        }))
                      }
                      className="w-full h-14 pl-4 pr-14 rounded-xl border text-gray-950 border-gray-200"
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                      cm
                    </span>
                  </div>
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
}