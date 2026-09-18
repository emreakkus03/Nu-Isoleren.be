'use client';

import { useTranslations } from 'next-intl';

import {
  BuildingType,
  EnergyRatingFormData,
  EnergyRegion,
} from '@/types/energy-rating';

interface BuildingStepProps {
  data: EnergyRatingFormData;
  updateData: (
    updater: (previous: EnergyRatingFormData) => EnergyRatingFormData
  ) => void;
}

const REGIONS: EnergyRegion[] = [
  'flanders',
  'brussels',
  'wallonia',
];

const BUILDING_TYPES: BuildingType[] = [
  'detached',
  'semi_detached',
  'terraced',
  'apartment',
];

export default function BuildingStep({
  data,
  updateData,
}: BuildingStepProps) {
  const t = useTranslations('EpcPage.calculator.building');

  const setRegion = (region: EnergyRegion) => {
    updateData((previous) => ({
      ...previous,
      region,
    }));
  };

  const setBuildingType = (type: BuildingType) => {
    updateData((previous) => ({
      ...previous,
      building: {
        ...previous.building,
        type,
      },
    }));
  };

  const setConstructionYear = (value: string) => {
    const year = value ? Number(value) : null;

    updateData((previous) => ({
      ...previous,
      building: {
        ...previous.building,
        constructionYear: year,
      },
    }));
  };

  const setFloorArea = (value: string) => {
    const area = value ? Number(value) : null;

    updateData((previous) => ({
      ...previous,
      building: {
        ...previous.building,
        heatedFloorArea: area,
      },
    }));
  };

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
            {t('region.question')}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {REGIONS.map((region) => {
              const selected = data.region === region;

              return (
                <button
                  key={region}
                  type="button"
                  onClick={() => setRegion(region)}
                  className={`min-h-14 px-5 py-4 rounded-xl border text-sm sm:text-base font-bold transition ${
                    selected
                      ? 'border-[#1A669A] bg-[#1A669A]/5 text-[#1A669A]'
                      : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {t(`region.options.${region}`)}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="text-base sm:text-lg font-bold text-gray-950 mb-4">
            {t('type.question')}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BUILDING_TYPES.map((type) => {
              const selected = data.building.type === type;

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setBuildingType(type)}
                  className={`min-h-14 px-5 py-4 rounded-xl border text-left text-sm sm:text-base font-bold transition ${
                    selected
                      ? 'border-[#1A669A] bg-[#1A669A]/5 text-[#1A669A]'
                      : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {t(`type.options.${type}`)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="construction-year"
              className="block text-base sm:text-lg font-bold text-gray-950 mb-3"
            >
              {t('constructionYear.label')}
            </label>

            <input
              id="construction-year"
              type="number"
              min="1800"
              max={new Date().getFullYear()}
              inputMode="numeric"
              placeholder={t('constructionYear.placeholder')}
              value={data.building.constructionYear ?? ''}
              onChange={(event) =>
                setConstructionYear(event.target.value)
              }
              className="w-full h-14 px-4 rounded-xl border border-gray-200 bg-white text-gray-950 text-base outline-none transition focus:border-[#1A669A] focus:ring-2 focus:ring-[#1A669A]/10"
            />

            <p className="mt-2 text-xs sm:text-sm text-gray-500">
              {t('constructionYear.help')}
            </p>
          </div>

          <div>
            <label
              htmlFor="heated-floor-area"
              className="block text-base sm:text-lg font-bold text-gray-950 mb-3"
            >
              {t('floorArea.label')}
            </label>

            <div className="relative">
              <input
                id="heated-floor-area"
                type="number"
                min="10"
                max="2000"
                inputMode="decimal"
                placeholder={t('floorArea.placeholder')}
                value={data.building.heatedFloorArea ?? ''}
                onChange={(event) =>
                  setFloorArea(event.target.value)
                }
                className="w-full h-14 pl-4 pr-14 rounded-xl border border-gray-200 bg-white text-gray-950 text-base outline-none transition focus:border-[#1A669A] focus:ring-2 focus:ring-[#1A669A]/10"
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500">
                m²
              </span>
            </div>

            <p className="mt-2 text-xs sm:text-sm text-gray-500">
              {t('floorArea.help')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}