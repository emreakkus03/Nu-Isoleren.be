'use client';

import { useTranslations } from 'next-intl';

import {
  EnergyRatingFormData,
  InsulationMaterial,
  RoofInsulationLocation,
  RoofType,
} from '@/types/energy-rating';

interface RoofStepProps {
  data: EnergyRatingFormData;
  updateData: (
    updater: (previous: EnergyRatingFormData) => EnergyRatingFormData
  ) => void;
}

const ROOF_TYPES: RoofType[] = [
  'pitched',
  'flat',
  'mixed',
  'no_direct_roof',
];

const INSULATION_LOCATIONS: RoofInsulationLocation[] = [
  'roof',
  'attic_floor',
  'both',
  'none',
  'unknown',
];

const INSULATION_MATERIALS: InsulationMaterial[] = [
  'mineral_wool',
  'pir_pur',
  'eps_xps',
  'cellulose_wood_fibre',
  'other',
  'unknown',
];

export default function RoofStep({
  data,
  updateData,
}: RoofStepProps) {
  const t = useTranslations('EpcPage.calculator.roof');

  const setRoofType = (type: RoofType) => {
    updateData((previous) => ({
      ...previous,
      roof: {
        ...previous.roof,
        type,
        ...(type === 'no_direct_roof'
          ? {
              insulationLocation: null,
              insulationMaterial: null,
              insulationThicknessCm: null,
            }
          : {}),
      },
    }));
  };

  const setInsulationLocation = (
    insulationLocation: RoofInsulationLocation
  ) => {
    updateData((previous) => ({
      ...previous,
      roof: {
        ...previous.roof,
        insulationLocation,
        ...(insulationLocation === 'none' ||
        insulationLocation === 'unknown'
          ? {
              insulationMaterial: null,
              insulationThicknessCm: null,
            }
          : {}),
      },
    }));
  };

  const setInsulationMaterial = (
    insulationMaterial: InsulationMaterial
  ) => {
    updateData((previous) => ({
      ...previous,
      roof: {
        ...previous.roof,
        insulationMaterial,
      },
    }));
  };

  const setThickness = (value: string) => {
    const thickness = value ? Number(value) : null;

    updateData((previous) => ({
      ...previous,
      roof: {
        ...previous.roof,
        insulationThicknessCm: thickness,
      },
    }));
  };

  const hasKnownInsulation =
    data.roof.insulationLocation === 'roof' ||
    data.roof.insulationLocation === 'attic_floor' ||
    data.roof.insulationLocation === 'both';

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
            {ROOF_TYPES.map((type) => {
              const selected = data.roof.type === type;

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setRoofType(type)}
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

          {data.building.type === 'apartment' && (
            <p className="mt-3 text-xs sm:text-sm text-gray-500">
              {t('type.apartmentHelp')}
            </p>
          )}
        </div>

        {data.roof.type && data.roof.type !== 'no_direct_roof' && (
          <>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-gray-950 mb-2">
                {t('insulationLocation.question')}
              </h4>

              <p className="text-sm text-gray-500 mb-4">
                {t('insulationLocation.help')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INSULATION_LOCATIONS.map((location) => {
                  const selected =
                    data.roof.insulationLocation === location;

                  return (
                    <button
                      key={location}
                      type="button"
                      onClick={() =>
                        setInsulationLocation(location)
                      }
                      className={`min-h-14 px-5 py-4 rounded-xl border text-left text-sm sm:text-base font-bold transition ${
                        selected
                          ? 'border-[#1A669A] bg-[#1A669A]/5 text-[#1A669A]'
                          : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {t(
                        `insulationLocation.options.${location}`
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {hasKnownInsulation && (
              <>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-gray-950 mb-4">
                    {t('material.question')}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {INSULATION_MATERIALS.map((material) => {
                      const selected =
                        data.roof.insulationMaterial === material;

                      return (
                        <button
                          key={material}
                          type="button"
                          onClick={() =>
                            setInsulationMaterial(material)
                          }
                          className={`min-h-14 px-5 py-4 rounded-xl border text-left text-sm sm:text-base font-bold transition ${
                            selected
                              ? 'border-[#1A669A] bg-[#1A669A]/5 text-[#1A669A]'
                              : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {t(`material.options.${material}`)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="max-w-sm">
                  <label
                    htmlFor="roof-insulation-thickness"
                    className="block text-base sm:text-lg font-bold text-gray-950 mb-3"
                  >
                    {t('thickness.label')}
                  </label>

                  <div className="relative">
                    <input
                      id="roof-insulation-thickness"
                      type="number"
                      min="1"
                      max="60"
                      step="1"
                      inputMode="decimal"
                      placeholder={t('thickness.placeholder')}
                      value={
                        data.roof.insulationThicknessCm ?? ''
                      }
                      onChange={(event) =>
                        setThickness(event.target.value)
                      }
                      className="w-full h-14 pl-4 pr-14 rounded-xl border border-gray-200 bg-white text-gray-950 text-base outline-none transition focus:border-[#1A669A] focus:ring-2 focus:ring-[#1A669A]/10"
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500">
                      cm
                    </span>
                  </div>

                  <p className="mt-2 text-xs sm:text-sm text-gray-500">
                    {t('thickness.help')}
                  </p>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}