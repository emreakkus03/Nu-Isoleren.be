'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';

import {
  CavityInsulationStatus,
  CavityPresence,
  FacadeCondition,
  HomeCheckBuildingType,
  HomeCheckRecommendation,
  HomeCheckRegion,
  HomeInsulationCheckData,
  MoistureStatus,
  RecommendationKey,
  RoofInsulationStatus,
  initialHomeInsulationCheckData,
} from '@/types/home-insulation-check';

const REGIONS: HomeCheckRegion[] = [
  'flanders',
  'wallonia',
];

const BUILDING_TYPES: HomeCheckBuildingType[] = [
  'detached',
  'semi_detached',
  'terraced',
  'apartment',
];

const ROOF_OPTIONS: RoofInsulationStatus[] = [
  'none',
  'old',
  'good',
  'unknown',
];

const CAVITY_OPTIONS: CavityPresence[] = [
  'yes',
  'no',
  'unknown',
];

const CAVITY_INSULATION_OPTIONS: CavityInsulationStatus[] = [
  'none',
  'old',
  'good',
  'unknown',
];

const FACADE_OPTIONS: FacadeCondition[] = [
  'good',
  'dirty',
  'damaged',
  'moisture',
  'unknown',
];

const MOISTURE_OPTIONS: MoistureStatus[] = [
  'none',
  'rising',
  'mould',
  'unknown',
];

type SupportedLocale = 'nl' | 'fr' | 'en';

const SERVICE_SLUGS: Record<
  RecommendationKey,
  Record<SupportedLocale, string>
> = {
  roof_insulation: {
    nl: 'dakisolatie',
    fr: 'isolation-de-toiture',
    en: 'roof-insulation',
  },

  cavity_wall_insulation: {
    nl: 'spouwmuurisolatie',
    fr: 'isolation-murs-creux',
    en: 'cavity-wall-insulation',
  },

  cavity_cleaning: {
    nl: 'spouwmuurisolatie-verwijderen',
    fr: 'enlever-isolation-murs-creux',
    en: 'cavity-wall-insulation-removal',
  },

  external_wall_insulation: {
    nl: 'crepi',
    fr: 'crepi',
    en: 'crepi',
  },

  facade_cleaning: {
    nl: 'gevelreiniging',
    fr: 'nettoyage-de-facade',
    en: 'facade-cleaning',
  },

  hydrofuge: {
    nl: 'hydrofuge',
    fr: 'hydrofuge',
    en: 'hydrofuge',
  },

  rising_damp: {
    nl: 'opstijgend-vocht',
    fr: 'humidite-ascensionnelle',
    en: 'rising-damp',
  },
};

export default function HomeInsulationCheck() {
  const t = useTranslations(
    'HomeInsulationCheckPage.check'
  );

  const [currentStep, setCurrentStep] =
    useState(1);

  const [formData, setFormData] =
    useState<HomeInsulationCheckData>(
      initialHomeInsulationCheckData
    );

  const [recommendations, setRecommendations] =
    useState<HomeCheckRecommendation[] | null>(
      null
    );

  const totalSteps = 4;

  const updateData = (
    updater: (
      previous: HomeInsulationCheckData
    ) => HomeInsulationCheckData
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
            new Date().getFullYear()
        );

      case 2:
        return formData.roof.insulation !== null;

      case 3:
        return (
          formData.walls.cavityPresence !== null &&
          formData.walls.facadeCondition !== null &&
          (
            formData.walls.cavityPresence !== 'yes' ||
            formData.walls.cavityInsulation !== null
          )
        );

      case 4:
        return formData.moisture.status !== null;

      default:
        return false;
    }
  };

  const addRecommendation = (
    list: HomeCheckRecommendation[],
    key: RecommendationKey,
    priority: HomeCheckRecommendation['priority']
  ) => {
    const existing = list.find(
      (item) => item.key === key
    );

    if (!existing) {
      list.push({
        key,
        priority,
      });

      return;
    }

    const weight = {
      high: 3,
      recommended: 2,
      check: 1,
    };

    if (
      weight[priority] >
      weight[existing.priority]
    ) {
      existing.priority = priority;
    }
  };

  const calculateRecommendations = () => {
    const result: HomeCheckRecommendation[] = [];

    if (formData.roof.insulation === 'none') {
      addRecommendation(
        result,
        'roof_insulation',
        'high'
      );
    }

    if (formData.roof.insulation === 'old') {
      addRecommendation(
        result,
        'roof_insulation',
        'recommended'
      );
    }

    if (formData.roof.insulation === 'unknown') {
      addRecommendation(
        result,
        'roof_insulation',
        'check'
      );
    }

    if (
      formData.walls.cavityPresence === 'yes' &&
      formData.walls.cavityInsulation === 'none'
    ) {
      addRecommendation(
        result,
        'cavity_wall_insulation',
        'high'
      );
    }

    if (
      formData.walls.cavityPresence === 'yes' &&
      formData.walls.cavityInsulation === 'old'
    ) {
      addRecommendation(
        result,
        'cavity_cleaning',
        'recommended'
      );

      addRecommendation(
        result,
        'cavity_wall_insulation',
        'recommended'
      );
    }

    if (
      formData.walls.cavityPresence === 'yes' &&
      formData.walls.cavityInsulation === 'unknown'
    ) {
      addRecommendation(
        result,
        'cavity_wall_insulation',
        'check'
      );
    }

    if (
      formData.walls.cavityPresence === 'unknown' &&
      formData.building.constructionYear !== null &&
      formData.building.constructionYear >= 1920 &&
      formData.building.constructionYear <= 1995
    ) {
      addRecommendation(
        result,
        'cavity_wall_insulation',
        'check'
      );
    }

    if (
      formData.walls.cavityPresence === 'no' &&
      (
        formData.walls.facadeCondition === 'damaged' ||
        formData.building.constructionYear !== null &&
        formData.building.constructionYear < 1995
      )
    ) {
      addRecommendation(
        result,
        'external_wall_insulation',
        'recommended'
      );
    }

    if (
      formData.walls.facadeCondition === 'damaged'
    ) {
      addRecommendation(
        result,
        'external_wall_insulation',
        'recommended'
      );
    }

    if (
      formData.walls.facadeCondition === 'dirty'
    ) {
      addRecommendation(
        result,
        'facade_cleaning',
        'recommended'
      );
    }

    if (
      formData.walls.facadeCondition === 'moisture'
    ) {
      addRecommendation(
        result,
        'hydrofuge',
        'check'
      );
    }

    if (
      formData.moisture.status === 'rising'
    ) {
      addRecommendation(
        result,
        'rising_damp',
        'high'
      );
    }

    if (
      formData.moisture.status === 'mould'
    ) {
      addRecommendation(
        result,
        'rising_damp',
        'check'
      );
    }

    const priorityWeight = {
      high: 3,
      recommended: 2,
      check: 1,
    };

    result.sort(
      (a, b) =>
        priorityWeight[b.priority] -
        priorityWeight[a.priority]
    );

    setRecommendations(result);
  };

  const handleNext = () => {
    if (!canContinue()) {
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(
        (previous) => previous + 1
      );

      return;
    }

    calculateRecommendations();
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(
        (previous) => previous - 1
      );
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setFormData(initialHomeInsulationCheckData);
    setRecommendations(null);
  };

  return (
    <section
      id="home-insulation-check"
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
          {recommendations ? (
            <HomeCheckResult
              recommendations={recommendations}
              onReset={handleReset}
            />
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
                      (currentStep / totalSteps) * 100
                    )}
                    %
                  </p>
                </div>

                <div className="mt-3 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#1A669A] transition-all duration-300"
                    style={{
                      width: `${
                        (currentStep / totalSteps) *
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
                  <RoofStep
                    data={formData}
                    updateData={updateData}
                  />
                )}

                {currentStep === 3 && (
                  <WallsStep
                    data={formData}
                    updateData={updateData}
                  />
                )}

                {currentStep === 4 && (
                  <MoistureStep
                    data={formData}
                    updateData={updateData}
                  />
                )}

                <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="inline-flex items-center justify-center rounded-full border border-gray-300 px-6 py-3 font-bold text-gray-800 hover:bg-gray-50 transition"
                    >
                      {t('previous')}
                    </button>
                  ) : (
                    <div />
                  )}

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!canContinue()}
                    className="inline-flex items-center justify-center rounded-full bg-[#C82024] px-7 py-3 text-white font-bold transition hover:bg-[#A91B1E] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {currentStep === totalSteps
                      ? t('showResult')
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
  data: HomeInsulationCheckData;
  updateData: (
    updater: (
      previous: HomeInsulationCheckData
    ) => HomeInsulationCheckData
  ) => void;
}

function BuildingStep({
  data,
  updateData,
}: StepProps) {
  const t = useTranslations(
    'HomeInsulationCheckPage.check.building'
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
              region: value as HomeCheckRegion,
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
                  value as HomeCheckBuildingType,
              },
            }))
          }
        />

        <NumberField
          label={t('year.label')}
          placeholder={t('year.placeholder')}
          value={data.building.constructionYear}
          min={1800}
          max={new Date().getFullYear()}
          onChange={(value) =>
            updateData((previous) => ({
              ...previous,
              building: {
                ...previous.building,
                constructionYear: value,
              },
            }))
          }
        />
      </div>
    </div>
  );
}

function RoofStep({
  data,
  updateData,
}: StepProps) {
  const t = useTranslations(
    'HomeInsulationCheckPage.check.roof'
  );

  return (
    <div>
      <StepHeader
        badge={t('badge')}
        title={t('title')}
        description={t('description')}
      />

      <div className="mt-8">
        <OptionGrid
          title={t('insulation.question')}
          options={ROOF_OPTIONS}
          selected={data.roof.insulation}
          label={(key) =>
            t(`insulation.options.${key}`)
          }
          onSelect={(value) =>
            updateData((previous) => ({
              ...previous,
              roof: {
                insulation:
                  value as RoofInsulationStatus,
              },
            }))
          }
        />
      </div>
    </div>
  );
}

function WallsStep({
  data,
  updateData,
}: StepProps) {
  const t = useTranslations(
    'HomeInsulationCheckPage.check.walls'
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
          title={t('cavity.question')}
          options={CAVITY_OPTIONS}
          selected={data.walls.cavityPresence}
          label={(key) =>
            t(`cavity.options.${key}`)
          }
          onSelect={(value) => {
            const cavityPresence =
              value as CavityPresence;

            updateData((previous) => ({
              ...previous,
              walls: {
                ...previous.walls,
                cavityPresence,
                cavityInsulation:
                  cavityPresence === 'yes'
                    ? previous.walls
                        .cavityInsulation
                    : null,
              },
            }));
          }}
        />

        {data.walls.cavityPresence === 'yes' && (
          <OptionGrid
            title={t('cavityInsulation.question')}
            options={CAVITY_INSULATION_OPTIONS}
            selected={
              data.walls.cavityInsulation
            }
            label={(key) =>
              t(
                `cavityInsulation.options.${key}`
              )
            }
            onSelect={(value) =>
              updateData((previous) => ({
                ...previous,
                walls: {
                  ...previous.walls,
                  cavityInsulation:
                    value as CavityInsulationStatus,
                },
              }))
            }
          />
        )}

        <OptionGrid
          title={t('facade.question')}
          options={FACADE_OPTIONS}
          selected={data.walls.facadeCondition}
          label={(key) =>
            t(`facade.options.${key}`)
          }
          onSelect={(value) =>
            updateData((previous) => ({
              ...previous,
              walls: {
                ...previous.walls,
                facadeCondition:
                  value as FacadeCondition,
              },
            }))
          }
        />
      </div>
    </div>
  );
}

function MoistureStep({
  data,
  updateData,
}: StepProps) {
  const t = useTranslations(
    'HomeInsulationCheckPage.check.moisture'
  );

  return (
    <div>
      <StepHeader
        badge={t('badge')}
        title={t('title')}
        description={t('description')}
      />

      <div className="mt-8">
        <OptionGrid
          title={t('status.question')}
          options={MOISTURE_OPTIONS}
          selected={data.moisture.status}
          label={(key) =>
            t(`status.options.${key}`)
          }
          onSelect={(value) =>
            updateData((previous) => ({
              ...previous,
              moisture: {
                status:
                  value as MoistureStatus,
              },
            }))
          }
        />
      </div>
    </div>
  );
}

interface HomeCheckResultProps {
  recommendations: HomeCheckRecommendation[];
  onReset: () => void;
}

function HomeCheckResult({
  recommendations,
  onReset,
}: HomeCheckResultProps) {
  const t = useTranslations(
    'HomeInsulationCheckPage.check.result'
  );

  return (
    <div className="p-5 sm:p-8">
      <div className="max-w-3xl">
        <span className="text-sm font-extrabold tracking-wider text-[#1A669A] uppercase max-md:block max-md:w-full max-md:text-center max-md:[overflow-wrap:anywhere]">
          {t('badge')}
        </span>

        <h3 className="mt-3 text-2xl sm:text-3xl font-extrabold text-gray-950">
          {t('title')}
        </h3>

        <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
          {t('description')}
        </p>
      </div>

      {recommendations.length > 0 ? (
        <div className="mt-8 flex flex-col gap-4">
          {recommendations.map((recommendation) => (
            <RecommendationCard
              key={recommendation.key}
              recommendation={recommendation}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-[#F8F9FA] p-6">
          <h4 className="text-lg font-extrabold text-gray-950">
            {t('noRecommendations.title')}
          </h4>

          <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
            {t(
              'noRecommendations.description'
            )}
          </p>
        </div>
      )}

      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
        <p className="text-sm text-amber-950 leading-relaxed">
          {t('notice')}
        </p>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-full bg-[#C82024] px-6 py-3 font-bold text-white transition hover:bg-[#A91B1E]"
        >
          {t('contact')}
        </Link>

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

interface RecommendationCardProps {
  recommendation: HomeCheckRecommendation;
}

function RecommendationCard({
  recommendation,
}: RecommendationCardProps) {
  const t = useTranslations(
    'HomeInsulationCheckPage.check.result'
  );

  const locale = useLocale() as SupportedLocale;

  const serviceSlug =
    SERVICE_SLUGS[recommendation.key][locale];

  const priorityClasses = {
    high:
      'bg-red-50 text-[#C82024] border-red-100',
    recommended:
      'bg-blue-50 text-[#1A669A] border-blue-100',
    check:
      'bg-amber-50 text-amber-700 border-amber-100',
  };

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="max-w-2xl">
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-extrabold uppercase tracking-wide ${
              priorityClasses[
                recommendation.priority
              ]
            }`}
          >
            {t(
              `priorities.${recommendation.priority}`
            )}
          </span>

          <h4 className="mt-4 text-xl sm:text-2xl font-extrabold text-gray-950">
            {t(
              `services.${recommendation.key}.title`
            )}
          </h4>

          <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
            {t(
              `services.${recommendation.key}.description`
            )}
          </p>

          <p className="mt-4 text-sm font-extrabold text-[#1A669A]">
            {t(
              `services.${recommendation.key}.nuIsoleren`
            )}
          </p>
        </div>

        <Link
  href={{
    pathname: '/services/[slug]',
    params: {
      slug: serviceSlug,
    },
  }}
  className="shrink-0 inline-flex items-center justify-center rounded-full border border-gray-300 px-5 py-2.5 text-sm font-bold text-gray-800 transition hover:border-[#1A669A] hover:text-[#1A669A]"
>
  {t('viewService')}
</Link>
      </div>
    </article>
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
  onChange,
}: NumberFieldProps) {
  return (
    <div>
      <label className="block mb-3 text-base sm:text-lg font-bold text-gray-950">
        {label}
      </label>

      <input
        type="number"
        min={min}
        max={max}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(
            event.target.value
              ? Number(event.target.value)
              : null
          )
        }
        className="w-full h-14 rounded-xl border border-gray-200 bg-white px-4 text-base font-medium text-gray-950 placeholder:text-gray-400 caret-[#1A669A] outline-none transition focus:border-[#1A669A] focus:ring-2 focus:ring-[#1A669A]/10"
      />
    </div>
  );
}