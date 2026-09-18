"use client";

import { useTranslations } from "next-intl";

import { EnergyRatingResult } from "@/types/energy-rating";

interface EpcResultProps {
  result: EnergyRatingResult;
  onReset: () => void;
}

export default function EpcResult({
  result,
  onReset,
}: EpcResultProps) {
  const t = useTranslations(
    "EpcPage.calculator.result",
  );

  return (
    <div className="py-4 sm:py-6">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-sm font-extrabold tracking-wider text-[#1A669A] uppercase">
          {t("badge")}
        </span>

        <h3 className="mt-3 text-2xl sm:text-3xl font-extrabold text-gray-950">
          {t("title")}
        </h3>

        <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
          {t("description")}
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-[#F8F9FA] p-6 sm:p-8 text-center">
        <p className="text-sm font-semibold text-gray-500">
          {t("label")}
        </p>

        <p className="mt-3 text-6xl sm:text-7xl font-extrabold text-[#1A669A] tracking-tight">
          {result.label}
        </p>
      </div>

      <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6 text-center">
        <p className="text-sm font-semibold text-gray-500">
          {t("range")}
        </p>

        <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-gray-950">
          {result.scoreMin} – {result.scoreMax}
        </p>

        <p className="mt-1 text-sm text-gray-500">
          {result.unit}
        </p>

        <div className="mt-5 pt-5 border-t border-gray-100">
          <p className="text-xs sm:text-sm font-semibold text-gray-500">
            {t("score")}
          </p>

          <p className="mt-1 text-base sm:text-lg font-bold text-gray-800">
            ± {result.estimatedScore} {result.unit}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
        <p className="text-sm text-amber-900 leading-relaxed">
          {t("warning")}
        </p>
      </div>

      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-gray-300 bg-white text-gray-800 font-bold hover:bg-gray-50 transition"
        >
          {t("again")}
        </button>
      </div>
    </div>
  );
}