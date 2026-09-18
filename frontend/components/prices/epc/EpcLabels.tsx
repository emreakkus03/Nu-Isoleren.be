"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Region = "flanders" | "brussels" | "wallonia";

interface LabelRange {
  label: string;
  range: string;
}

const LABELS: Record<Region, LabelRange[]> = {
  flanders: [
    {
      label: "A+",
      range: "≤ 0 kWh/(m² jaar)",
    },
    {
      label: "A",
      range: "1 – 100 kWh/(m² jaar)",
    },
    {
      label: "B",
      range: "101 – 200 kWh/(m² jaar)",
    },
    {
      label: "C",
      range: "201 – 300 kWh/(m² jaar)",
    },
    {
      label: "D",
      range: "301 – 400 kWh/(m² jaar)",
    },
    {
      label: "E",
      range: "401 – 500 kWh/(m² jaar)",
    },
    {
      label: "F",
      range: "≥ 501 kWh/(m² jaar)",
    },
  ],

  brussels: [
    {
      label: "A",
      range: "≤ 45 kWh/(m² jaar)",
    },
    {
      label: "B",
      range: "46 – 95 kWh/(m² jaar)",
    },
    {
      label: "C",
      range: "96 – 150 kWh/(m² jaar)",
    },
    {
      label: "D",
      range: "151 – 210 kWh/(m² jaar)",
    },
    {
      label: "E",
      range: "211 – 275 kWh/(m² jaar)",
    },
    {
      label: "F",
      range: "276 – 345 kWh/(m² jaar)",
    },
    {
      label: "G",
      range: "> 345 kWh/(m² jaar)",
    },
  ],

  wallonia: [
    {
      label: "A++",
      range: "≤ 0 kWh/(m² jaar)",
    },
    {
      label: "A+",
      range: "1 – 45 kWh/(m² jaar)",
    },
    {
      label: "A",
      range: "46 – 85 kWh/(m² jaar)",
    },
    {
      label: "B",
      range: "86 – 170 kWh/(m² jaar)",
    },
    {
      label: "C",
      range: "171 – 255 kWh/(m² jaar)",
    },
    {
      label: "D",
      range: "256 – 340 kWh/(m² jaar)",
    },
    {
      label: "E",
      range: "341 – 425 kWh/(m² jaar)",
    },
    {
      label: "F",
      range: "426 – 510 kWh/(m² jaar)",
    },
    {
      label: "G",
      range: "> 510 kWh/(m² jaar)",
    },
  ],
};

const REGIONS: Region[] = [
  "flanders",
  "brussels",
  "wallonia",
];

export default function EpcLabels() {
  const t = useTranslations("EpcPage.labels");

  const [region, setRegion] =
    useState<Region>("flanders");

  return (
    <section className="w-full bg-[#F8F9FA] py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase">
            {t("badge")}
          </span>

          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15]">
            {t("title")}
          </h2>

          <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed">
            {t("description")}
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="inline-flex flex-wrap justify-center gap-2 rounded-2xl border border-gray-200 bg-white p-2">
            {REGIONS.map((item) => {
              const active = region === item;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setRegion(item)}
                  className={`px-5 py-3 rounded-xl text-sm sm:text-base font-bold transition ${
                    active
                      ? "bg-[#1A669A] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {t(`regions.${item}`)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 max-w-3xl mx-auto">
          <div className="mb-5">
            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-950">
              {t(`content.${region}.title`)}
            </h3>

            <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
              {t(`content.${region}.description`)}
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {LABELS[region].map((item, index) => (
              <div
                key={item.label}
                className={`flex items-center justify-between gap-6 px-5 sm:px-6 py-4 ${
                  index !== LABELS[region].length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 min-w-12 items-center justify-center rounded-xl bg-[#1A669A]/10 px-3">
                    <span className="text-lg font-extrabold text-[#1A669A]">
                      {item.label}
                    </span>
                  </div>

                  <span className="text-sm sm:text-base font-semibold text-gray-800">
                    {t("energyLabel")}
                  </span>
                </div>

                <span className="text-sm sm:text-base font-bold text-gray-950 text-right">
                  {item.range}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs sm:text-sm text-gray-500 leading-relaxed">
            {t(`content.${region}.note`)}
          </p>
        </div>
      </div>
    </section>
  );
}