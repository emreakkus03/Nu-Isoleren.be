"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import {
  EnergyRatingFormData,
  EnergyRatingResult,
  initialEnergyRatingData,
} from "@/types/energy-rating";

import { calculateEnergyRating } from "@/lib/energy-rating";

import BuildingStep from "@/components/prices/epc/steps/BuildingStep";
import RoofStep from "@/components/prices/epc/steps/RoofStep";
import WallsStep from "@/components/prices/epc/steps/WallsStep";
import FloorStep from "@/components/prices/epc/steps/FloorStep";
import WindowsStep from "@/components/prices/epc/steps/WindowsStep";
import HeatingStep from "@/components/prices/epc/steps/HeatingStep";
import VentilationStep from "@/components/prices/epc/steps/VentilationStep";
import RenewableEnergyStep from "@/components/prices/epc/steps/RenewableEnergyStep";

import EpcResult from "@/components/prices/epc/EpcResult";

const TOTAL_STEPS = 8;

export default function EpcCalculator() {
  const t = useTranslations("EpcPage.calculator");

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<EnergyRatingFormData>(
    initialEnergyRatingData,
  );

  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EnergyRatingResult | null>(null);

  const progress = (currentStep / TOTAL_STEPS) * 100;

  const updateFormData = (
    updater: (previous: EnergyRatingFormData) => EnergyRatingFormData,
  ) => {
    setFormData((previous) => updater(previous));
  };

  const canContinueStepOne =
    formData.region !== null &&
    formData.building.type !== null &&
    formData.building.constructionYear !== null &&
    formData.building.constructionYear >= 1800 &&
    formData.building.constructionYear <= new Date().getFullYear() &&
    formData.building.heatedFloorArea !== null &&
    formData.building.heatedFloorArea > 0;

  const hasKnownRoofInsulation =
    formData.roof.insulationLocation === "roof" ||
    formData.roof.insulationLocation === "attic_floor" ||
    formData.roof.insulationLocation === "both";

  const canContinueStepTwo =
    formData.roof.type === "no_direct_roof" ||
    (formData.roof.type !== null &&
      formData.roof.insulationLocation !== null &&
      (!hasKnownRoofInsulation ||
        (formData.roof.insulationMaterial !== null &&
          (formData.roof.insulationMaterial === "unknown" ||
            (formData.roof.insulationThicknessCm !== null &&
              formData.roof.insulationThicknessCm > 0)))));

  const wallHasInsulation =
    formData.walls.insulationType !== null &&
    formData.walls.insulationType !== "none" &&
    formData.walls.insulationType !== "unknown";

  const canContinueStepThree =
    formData.walls.insulationType !== null &&
    (!wallHasInsulation ||
      (formData.walls.insulationMaterial !== null &&
        (formData.walls.insulationMaterial === "unknown" ||
          (formData.walls.insulationThicknessCm !== null &&
            formData.walls.insulationThicknessCm > 0))));

  const floorNeedsInsulationInfo =
    formData.floor.boundary !== null &&
    formData.floor.boundary !== "heated_space";

  const canContinueStepFour =
    formData.floor.boundary !== null &&
    (!floorNeedsInsulationInfo ||
      (formData.floor.insulated !== null &&
        (formData.floor.insulated !== "yes" ||
          (formData.floor.insulationMaterial !== null &&
            (formData.floor.insulationMaterial === "unknown" ||
              (formData.floor.insulationThicknessCm !== null &&
                formData.floor.insulationThicknessCm > 0))))));

  const canContinueStepFive =
    formData.windows.glazing !== null &&
    formData.windows.frame !== null;

  const canContinueStepSix =
    formData.heating.energySource !== null &&
    formData.heating.systemType !== null &&
    formData.hotWater.systemType !== null &&
    formData.cooling.type !== null;

  const canContinueStepSeven =
    formData.ventilation.naturalOpenings !== null &&
    formData.ventilation.mechanicalExtraction !== null &&
    formData.ventilation.mechanicalSupply !== null &&
    formData.ventilation.heatRecovery !== null;

  const canContinueStepEight =
    formData.renewableEnergy.solarPanels !== null &&
    formData.renewableEnergy.solarThermal !== null &&
    (formData.renewableEnergy.solarPanels !== "yes" ||
      (formData.renewableEnergy.solarPowerKwp !== null &&
        formData.renewableEnergy.solarPowerKwp > 0));

  const canContinue =
    currentStep === 1
      ? canContinueStepOne
      : currentStep === 2
        ? canContinueStepTwo
        : currentStep === 3
          ? canContinueStepThree
          : currentStep === 4
            ? canContinueStepFour
            : currentStep === 5
              ? canContinueStepFive
              : currentStep === 6
                ? canContinueStepSix
                : currentStep === 7
                  ? canContinueStepSeven
                  : currentStep === 8
                    ? canContinueStepEight
                    : false;

  const handleNext = async () => {
    if (!canContinue || isCalculating) {
      return;
    }

    setError(null);

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((step) => step + 1);
      return;
    }

    try {
      setIsCalculating(true);

      const calculationResult = await calculateEnergyRating(formData);

      setResult(calculationResult);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : t("error"),
      );
    } finally {
      setIsCalculating(false);
    }
  };

  const handlePrevious = () => {
    if (isCalculating) {
      return;
    }

    if (currentStep > 1) {
      setCurrentStep((step) => step - 1);
      setError(null);
    }
  };

  const handleReset = () => {
  setCurrentStep(1);
  setFormData(initialEnergyRatingData);
  setResult(null);
  setError(null);
  setIsCalculating(false);
};

  return (
    <section
      id="epc-calculator"
      className="w-full bg-[#F8F9FA] py-16 md:py-24 scroll-mt-28"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">

          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15]">
            {t("title")}
          </h2>

          <p className="mt-5 text-sm sm:text-base text-gray-600 leading-relaxed">
            {t("description")}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-8 lg:p-10">
            {result ? (
  <EpcResult
    result={result}
    onReset={handleReset}
  />
) : (
  <>
          <div className="flex items-center justify-between gap-4 mb-3">
            <span className="text-sm font-bold text-gray-950">
              {t("progress", {
                current: currentStep,
                total: TOTAL_STEPS,
              })}
            </span>

            <span className="text-sm font-semibold text-gray-500">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1A669A] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-8 md:mt-10">
            {currentStep === 1 && (
              <BuildingStep
                data={formData}
                updateData={updateFormData}
              />
            )}

            {currentStep === 2 && (
              <RoofStep
                data={formData}
                updateData={updateFormData}
              />
            )}

            {currentStep === 3 && (
              <WallsStep
                data={formData}
                updateData={updateFormData}
              />
            )}

            {currentStep === 4 && (
              <FloorStep
                data={formData}
                updateData={updateFormData}
              />
            )}

            {currentStep === 5 && (
              <WindowsStep
                data={formData}
                updateData={updateFormData}
              />
            )}

            {currentStep === 6 && (
              <HeatingStep
                data={formData}
                updateData={updateFormData}
              />
            )}

            {currentStep === 7 && (
              <VentilationStep
                data={formData}
                updateData={updateFormData}
              />
            )}

            {currentStep === 8 && (
              <RenewableEnergyStep
                data={formData}
                updateData={updateFormData}
              />
            )}
          </div>

          {error && (
            <div className="mt-8 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          

          <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1 || isCalculating}
              className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed hover:text-gray-950 transition"
            >
              <span>&larr;</span>
              <span>{t("previous")}</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!canContinue || isCalculating}
              className="inline-flex items-center gap-2.5 bg-[#C82024] hover:bg-red-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm sm:text-base font-bold px-6 sm:px-8 py-3.5 rounded-full transition shadow-sm active:scale-95"
            >
              <span>
                {isCalculating
                  ? t("calculating")
                  : currentStep === TOTAL_STEPS
                    ? t("calculate")
                    : t("next")}
              </span>

              {!isCalculating && <span>&rarr;</span>}
            </button>
          </div>
           </>
)}
        </div>

        <p className="mt-5 text-xs sm:text-sm text-gray-500 text-center leading-relaxed">
          {t("disclaimer")}
        </p>
      </div>
    </section>
  );
}