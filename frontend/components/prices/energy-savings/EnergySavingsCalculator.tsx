'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import {
  EnergySavingsFormData,
  EnergySavingsResult,
  initialEnergySavingsData,
  InsulationStatus,
  SavingsBuildingType,
  SavingsHeatingSource,
  SavingsMeasure,
  SavingsRegion,
} from '@/types/energy-savings';

import { calculateEnergySavings } from '@/lib/energy-savings';
import EnergySavingsResultView from './EnergySavingsResult';

const REGIONS: SavingsRegion[] = [
  'flanders',
  'brussels',
  'wallonia',
];

const BUILDING_TYPES: SavingsBuildingType[] = [
  'detached',
  'semi_detached',
  'terraced',
  'apartment',
];

const INSULATION_STATUSES: InsulationStatus[] = [
  'none',
  'limited',
  'insulated',
  'unknown',
];

const MEASURES: SavingsMeasure[] = [
  'cavity_wall',
  'roof',
  'external_wall',
];

const HEATING_SOURCES: SavingsHeatingSource[] = [
  'gas',
  'oil',
  'electric',
  'heat_pump',
  'wood_pellets',
  'other',
];

export default function EnergySavingsCalculator() {
  const t = useTranslations(
    'EnergySavingsPage.calculator'
  );

  const [currentStep, setCurrentStep] =
    useState(1);

  const [formData, setFormData] =
    useState<EnergySavingsFormData>(
      initialEnergySavingsData
    );

  const [isCalculating, setIsCalculating] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [result, setResult] =
    useState<EnergySavingsResult | null>(null);

  const totalSteps = 4;

  const updateData = (
    updater: (
      previous: EnergySavingsFormData
    ) => EnergySavingsFormData
  ) => {
    setFormData(updater);
  };

  const canContinue = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.region !== null &&
          formData.building.type !== null &&
          formData.building.constructionYear !== null &&
          formData.building.constructionYear >= 1800 &&
          formData.building.constructionYear <=
            new Date().getFullYear() &&
          formData.building.heatedFloorArea !== null &&
          formData.building.heatedFloorArea >= 10
        );

      case 2:
        return (
          formData.currentInsulation.roof !== null &&
          formData.currentInsulation.walls !== null
        );

      case 3:
        return (
          formData.measure.type !== null &&
          formData.measure.surfaceArea !== null &&
          formData.measure.surfaceArea > 0
        );

      case 4:
        return (
          formData.heating.source !== null &&
          formData.heating.annualConsumptionKwh !== null &&
          formData.heating.annualConsumptionKwh >= 100
        );

      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (!canContinue()) {
      return;
    }

    setError(null);

    if (currentStep < totalSteps) {
      setCurrentStep(
        (previous) => previous + 1
      );

      return;
    }

    try {
      setIsCalculating(true);

      const calculation =
        await calculateEnergySavings(
          formData
        );

      setResult(calculation);
    } catch {
      setError(t('error'));
    } finally {
      setIsCalculating(false);
    }
  };

  const handlePrevious = () => {
    setError(null);

    if (currentStep > 1) {
      setCurrentStep(
        (previous) => previous - 1
      );
    }
  };

  const handleReset = () => {
    setFormData(initialEnergySavingsData);
    setCurrentStep(1);
    setResult(null);
    setError(null);
    setIsCalculating(false);
  };

  return (
    <section
      id="energy-savings-calculator"
      className="w-full bg-[#F8F9FA] py-16 md:py-24"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15] max-md:text-balance max-md:[overflow-wrap:anywhere]">
            {t('title')}
          </h2>

          <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed max-md:text-center">
            {t('description')}
          </p>
        </div>

        <div className="mt-10 md:mt-12 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {result ? (
            <div className="p-5 sm:p-8">
              <EnergySavingsResultView
                result={result}
                onReset={handleReset}
              />
            </div>
          ) : (
            <>
              <div className="px-5 sm:px-8 pt-6 sm:pt-8">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-bold text-gray-500">
                    {t('progress', {
                      current: currentStep,
                      total: totalSteps,
                    })}
                  </p>

                  <p className="text-sm font-extrabold text-[#1A669A]">
                    {Math.round(
                      (currentStep /
                        totalSteps) *
                        100
                    )}
                    %
                  </p>
                </div>

                <div className="mt-3 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#1A669A] transition-all duration-300"
                    style={{
                      width: `${
                        (currentStep /
                          totalSteps) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="p-5 sm:p-8">
                {currentStep === 1 && (
                  <BuildingStep
                    data={formData}
                    updateData={updateData}
                  />
                )}

                {currentStep === 2 && (
                  <InsulationStep
                    data={formData}
                    updateData={updateData}
                  />
                )}

                {currentStep === 3 && (
                  <MeasureStep
                    data={formData}
                    updateData={updateData}
                  />
                )}

                {currentStep === 4 && (
                  <HeatingStep
                    data={formData}
                    updateData={updateData}
                  />
                )}

                {error && (
                  <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
                    <p className="text-sm text-red-800">
                      {error}
                    </p>
                  </div>
                )}

                <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={
                        handlePrevious
                      }
                      disabled={
                        isCalculating
                      }
                      className="inline-flex items-center justify-center rounded-full border border-gray-300 px-6 py-3 font-bold text-gray-800 hover:bg-gray-50 transition disabled:opacity-40"
                    >
                      {t('previous')}
                    </button>
                  ) : (
                    <div />
                  )}

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={
                      !canContinue() ||
                      isCalculating
                    }
                    className="inline-flex items-center justify-center rounded-full bg-[#C82024] px-7 py-3 text-white font-bold transition hover:bg-[#A91B1E] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isCalculating
                      ? t('calculating')
                      : currentStep ===
                          totalSteps
                        ? t('calculate')
                        : t('next')}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <p className="mt-5 text-center text-xs sm:text-sm text-gray-500">
          {t('disclaimer')}
        </p>
      </div>
    </section>
  );
}

interface StepProps {
  data: EnergySavingsFormData;
  updateData: (
    updater: (
      previous: EnergySavingsFormData
    ) => EnergySavingsFormData
  ) => void;
}

function BuildingStep({
  data,
  updateData,
}: StepProps) {
  const t = useTranslations(
    'EnergySavingsPage.calculator.building'
  );

  return (
    <div>
      <StepHeader
        badge={t('badge')}
        title={t('title')}
        description={t('description')}
      />

      <div className="mt-8 flex flex-col gap-8">
        <OptionGrid
          title={t('region.question')}
          options={REGIONS}
          selected={data.region}
          label={(key) =>
            t(`region.options.${key}`)
          }
          onSelect={(value) =>
            updateData((previous) => ({
              ...previous,
              region:
                value as SavingsRegion,
            }))
          }
        />

        <OptionGrid
          title={t('type.question')}
          options={BUILDING_TYPES}
          selected={data.building.type}
          label={(key) =>
            t(`type.options.${key}`)
          }
          onSelect={(value) =>
            updateData((previous) => ({
              ...previous,
              building: {
                ...previous.building,
                type:
                  value as SavingsBuildingType,
              },
            }))
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <NumberField
            label={t('year.label')}
            placeholder={t(
              'year.placeholder'
            )}
            value={
              data.building
                .constructionYear
            }
            min={1800}
            max={
              new Date().getFullYear()
            }
            onChange={(value) =>
              updateData((previous) => ({
                ...previous,
                building: {
                  ...previous.building,
                  constructionYear:
                    value,
                },
              }))
            }
          />

          <NumberField
            label={t('area.label')}
            placeholder={t(
              'area.placeholder'
            )}
            suffix="m²"
            value={
              data.building
                .heatedFloorArea
            }
            min={10}
            max={2000}
            onChange={(value) =>
              updateData((previous) => ({
                ...previous,
                building: {
                  ...previous.building,
                  heatedFloorArea:
                    value,
                },
              }))
            }
          />
        </div>
      </div>
    </div>
  );
}

function InsulationStep({
  data,
  updateData,
}: StepProps) {
  const t = useTranslations(
    'EnergySavingsPage.calculator.insulation'
  );

  return (
    <div>
      <StepHeader
        badge={t('badge')}
        title={t('title')}
        description={t('description')}
      />

      <div className="mt-8 flex flex-col gap-9">
        <OptionGrid
          title={t('roof.question')}
          options={INSULATION_STATUSES}
          selected={
            data.currentInsulation
              .roof
          }
          label={(key) =>
            t(`roof.options.${key}`)
          }
          onSelect={(value) =>
            updateData((previous) => ({
              ...previous,
              currentInsulation: {
                ...previous.currentInsulation,
                roof:
                  value as InsulationStatus,
              },
            }))
          }
        />

        <OptionGrid
          title={t('walls.question')}
          options={INSULATION_STATUSES}
          selected={
            data.currentInsulation
              .walls
          }
          label={(key) =>
            t(`walls.options.${key}`)
          }
          onSelect={(value) =>
            updateData((previous) => ({
              ...previous,
              currentInsulation: {
                ...previous.currentInsulation,
                walls:
                  value as InsulationStatus,
              },
            }))
          }
        />
      </div>
    </div>
  );
}

function MeasureStep({
  data,
  updateData,
}: StepProps) {
  const t = useTranslations(
    'EnergySavingsPage.calculator.measure'
  );

  return (
    <div>
      <StepHeader
        badge={t('badge')}
        title={t('title')}
        description={t('description')}
      />

      <div className="mt-8 flex flex-col gap-8">
        <OptionGrid
          title={t('type.question')}
          options={MEASURES}
          selected={data.measure.type}
          label={(key) =>
            t(`type.options.${key}`)
          }
          onSelect={(value) =>
            updateData((previous) => ({
              ...previous,
              measure: {
                ...previous.measure,
                type:
                  value as SavingsMeasure,
              },
            }))
          }
        />

        <NumberField
          label={t('surface.label')}
          placeholder={t(
            'surface.placeholder'
          )}
          suffix="m²"
          value={
            data.measure.surfaceArea
          }
          min={1}
          max={1000}
          onChange={(value) =>
            updateData((previous) => ({
              ...previous,
              measure: {
                ...previous.measure,
                surfaceArea: value,
              },
            }))
          }
        />

        <p className="text-sm text-gray-500 leading-relaxed">
          {t('surface.help')}
        </p>
      </div>
    </div>
  );
}

function HeatingStep({
  data,
  updateData,
}: StepProps) {
  const t = useTranslations(
    'EnergySavingsPage.calculator.heating'
  );

  return (
    <div>
      <StepHeader
        badge={t('badge')}
        title={t('title')}
        description={t('description')}
      />

      <div className="mt-8 flex flex-col gap-8">
        <OptionGrid
          title={t('source.question')}
          options={HEATING_SOURCES}
          selected={
            data.heating.source
          }
          label={(key) =>
            t(`source.options.${key}`)
          }
          onSelect={(value) =>
            updateData((previous) => ({
              ...previous,
              heating: {
                ...previous.heating,
                source:
                  value as SavingsHeatingSource,
              },
            }))
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <NumberField
            label={t(
              'consumption.label'
            )}
            placeholder={t(
              'consumption.placeholder'
            )}
            suffix="kWh"
            value={
              data.heating
                .annualConsumptionKwh
            }
            min={100}
            max={250000}
            onChange={(value) =>
              updateData((previous) => ({
                ...previous,
                heating: {
                  ...previous.heating,
                  annualConsumptionKwh:
                    value,
                },
              }))
            }
          />

          <NumberField
            label={t('cost.label')}
            placeholder={t(
              'cost.placeholder'
            )}
            suffix="€"
            value={
              data.heating
                .annualHeatingCost
            }
            min={0}
            max={100000}
            onChange={(value) =>
              updateData((previous) => ({
                ...previous,
                heating: {
                  ...previous.heating,
                  annualHeatingCost:
                    value,
                },
              }))
            }
          />
        </div>

        <p className="text-sm text-gray-500 leading-relaxed">
          {t('help')}
        </p>
      </div>
    </div>
  );
}

interface StepHeaderProps {
  badge: string;
  title: string;
  description: string;
}

function StepHeader({
  badge,
  title,
  description,
}: StepHeaderProps) {
  return (
    <div>
      <span className="text-sm font-extrabold tracking-wider text-[#1A669A] uppercase max-md:block max-md:w-full max-md:text-center max-md:[overflow-wrap:anywhere]">
        {badge}
      </span>

      <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-gray-950">
        {title}
      </h3>

      <p className="mt-3 max-w-2xl text-sm sm:text-base text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

interface OptionGridProps {
  title: string;
  options: readonly string[];
  selected: string | null;
  label: (key: string) => string;
  onSelect: (value: string) => void;
}

function OptionGrid({
  title,
  options,
  selected,
  label,
  onSelect,
}: OptionGridProps) {
  return (
    <div>
      <h4 className="mb-4 text-base sm:text-lg font-bold text-gray-950">
        {title}
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() =>
              onSelect(option)
            }
            className={`min-h-14 rounded-xl border px-5 py-4 text-left font-bold transition ${
              selected === option
                ? 'border-[#1A669A] bg-[#1A669A]/5 text-[#1A669A]'
                : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {label(option)}
          </button>
        ))}
      </div>
    </div>
  );
}

interface NumberFieldProps {
  label: string;
  placeholder: string;
  value: number | null;
  min?: number;
  max?: number;
  suffix?: string;
  onChange: (
    value: number | null
  ) => void;
}

function NumberField({
  label,
  placeholder,
  value,
  min,
  max,
  suffix,
  onChange,
}: NumberFieldProps) {
  return (
    <div>
      <label className="block mb-3 text-base sm:text-lg font-bold text-gray-950">
        {label}
      </label>

      <div className="relative">
        <input
          type="number"
          min={min}
          max={max}
          value={value ?? ''}
          placeholder={placeholder}
          onChange={(event) =>
            onChange(
              event.target.value
                ? Number(
                    event.target.value
                  )
                : null
            )
          }
          className="w-full h-14 rounded-xl border border-gray-200 bg-white px-4 pr-16 text-base font-medium text-gray-950 placeholder:text-gray-400 caret-[#1A669A] outline-none transition focus:border-[#1A669A] focus:ring-2 focus:ring-[#1A669A]/10"
        />

        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500 pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}