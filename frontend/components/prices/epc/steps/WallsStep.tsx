'use client';

import { useTranslations } from 'next-intl';
import {
  EnergyRatingFormData,
  InsulationMaterial,
  WallInsulationType,
} from '@/types/energy-rating';

interface WallsStepProps {
  data: EnergyRatingFormData;
  updateData: (
    updater: (previous: EnergyRatingFormData) => EnergyRatingFormData
  ) => void;
}

const WALL_TYPES: WallInsulationType[] = [
  'cavity',
  'external',
  'internal',
  'mixed',
  'none',
  'unknown',
];

const MATERIALS: InsulationMaterial[] = [
  'mineral_wool',
  'pir_pur',
  'eps_xps',
  'cellulose_wood_fibre',
  'other',
  'unknown',
];

export default function WallsStep({
  data,
  updateData,
}: WallsStepProps) {
  const t = useTranslations('EpcPage.calculator.walls');

  const setType = (insulationType: WallInsulationType) => {
    updateData((previous) => ({
      ...previous,
      walls: {
        insulationType,
        insulationMaterial:
          insulationType === 'none' || insulationType === 'unknown'
            ? null
            : previous.walls.insulationMaterial,
        insulationThicknessCm:
          insulationType === 'none' || insulationType === 'unknown'
            ? null
            : previous.walls.insulationThicknessCm,
      },
    }));
  };

  const setMaterial = (insulationMaterial: InsulationMaterial) => {
    updateData((previous) => ({
      ...previous,
      walls: {
        ...previous.walls,
        insulationMaterial,
        insulationThicknessCm:
          insulationMaterial === 'unknown'
            ? null
            : previous.walls.insulationThicknessCm,
      },
    }));
  };

  const setThickness = (value: string) => {
    updateData((previous) => ({
      ...previous,
      walls: {
        ...previous.walls,
        insulationThicknessCm: value ? Number(value) : null,
      },
    }));
  };

  const hasInsulation =
    data.walls.insulationType !== null &&
    data.walls.insulationType !== 'none' &&
    data.walls.insulationType !== 'unknown';

  return (
    <div>
      <div className="mb-8">
        <span className="text-sm font-extrabold tracking-wider text-[#1A669A] uppercase">
          {t('badge')}
        </span>

        <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
          {t('title')}
        </h3>

        <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
          {t('description')}
        </p>
      </div>

      <div className="flex flex-col gap-9">
        <div>
          <h4 className="text-base sm:text-lg font-bold text-gray-950 mb-4">
            {t('type.question')}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {WALL_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setType(type)}
                className={`min-h-14 px-5 py-4 rounded-xl border text-left text-sm sm:text-base font-bold transition ${
                  data.walls.insulationType === type
                    ? 'border-[#1A669A] bg-[#1A669A]/5 text-[#1A669A]'
                    : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {t(`type.options.${type}`)}
              </button>
            ))}
          </div>
        </div>

        {hasInsulation && (
          <>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-gray-950 mb-4">
                {t('material.question')}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MATERIALS.map((material) => (
                  <button
                    key={material}
                    type="button"
                    onClick={() => setMaterial(material)}
                    className={`min-h-14 px-5 py-4 rounded-xl border text-left text-sm sm:text-base font-bold transition ${
                      data.walls.insulationMaterial === material
                        ? 'border-[#1A669A] bg-[#1A669A]/5 text-[#1A669A]'
                        : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {t(`material.options.${material}`)}
                  </button>
                ))}
              </div>
            </div>

            {data.walls.insulationMaterial &&
              data.walls.insulationMaterial !== 'unknown' && (
                <div className="max-w-sm">
                  <label className="block text-base sm:text-lg font-bold text-gray-950 mb-3">
                    {t('thickness.label')}
                  </label>

                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={data.walls.insulationThicknessCm ?? ''}
                      onChange={(event) =>
                        setThickness(event.target.value)
                      }
                      placeholder={t('thickness.placeholder')}
                      className="w-full h-14 pl-4 pr-14 rounded-xl border text-gray-950 border-gray-200 outline-none focus:border-[#1A669A] focus:ring-2 focus:ring-[#1A669A]/10"
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500">
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