"use client";

import { useTranslations } from "next-intl";

import {
  CoolingType,
  EnergyRatingFormData,
  HeatingEnergySource,
  HeatingSystemType,
  HotWaterSystemType,
} from "@/types/energy-rating";

interface HeatingStepProps {
  data: EnergyRatingFormData;
  updateData: (
    updater: (previous: EnergyRatingFormData) => EnergyRatingFormData,
  ) => void;
}

const SOURCES: HeatingEnergySource[] = [
  "gas",
  "oil",
  "heat_pump",
  "electric",
  "wood_pellets",
  "district",
  "other",
  "unknown",
];

const HOT_WATER: HotWaterSystemType[] = [
  "same_as_heating",
  "electric_boiler",
  "heat_pump_boiler",
  "gas_water_heater",
  "solar_supported",
  "other",
  "unknown",
];

const COOLING: CoolingType[] = [
  "none",
  "air_conditioning",
  "heat_pump",
  "other",
  "unknown",
];

function getSystemsForSource(
  source: HeatingEnergySource | null,
): HeatingSystemType[] {
  switch (source) {
    case "gas":
      return [
        "condensing_boiler",
        "non_condensing_boiler",
        "other",
        "unknown",
      ];

    case "oil":
      return [
        "condensing_boiler",
        "non_condensing_boiler",
        "other",
        "unknown",
      ];

    case "heat_pump":
      return [
        "heat_pump_air_water",
        "heat_pump_ground_water",
        "heat_pump_air_air",
        "unknown",
      ];

    case "electric":
      return [
        "electric_resistance",
        "other",
        "unknown",
      ];

    case "wood_pellets":
      return [
        "stove",
        "other",
        "unknown",
      ];

    case "district":
      return [
        "district",
        "unknown",
      ];

    case "other":
      return [
        "other",
        "unknown",
      ];

    case "unknown":
      return [
        "unknown",
      ];

    default:
      return [];
  }
}

export default function HeatingStep({
  data,
  updateData,
}: HeatingStepProps) {
  const t = useTranslations("EpcPage.calculator.heating");

  const availableSystems = getSystemsForSource(
    data.heating.energySource,
  );

  const handleSourceSelect = (
    energySource: HeatingEnergySource,
  ) => {
    updateData((previous) => {
      const allowedSystems =
        getSystemsForSource(energySource);

      const currentSystem =
        previous.heating.systemType;

      const systemStillValid =
        currentSystem !== null &&
        allowedSystems.includes(currentSystem);

      return {
        ...previous,
        heating: {
          ...previous.heating,
          energySource,
          systemType: systemStillValid
            ? currentSystem
            : null,
        },
      };
    });
  };

  const handleSystemSelect = (
    systemType: HeatingSystemType,
  ) => {
    updateData((previous) => ({
      ...previous,
      heating: {
        ...previous.heating,
        systemType,
      },
    }));
  };

  const handleInstallationYear = (
    value: string,
  ) => {
    updateData((previous) => ({
      ...previous,
      heating: {
        ...previous.heating,
        installationYear: value
          ? Number(value)
          : null,
      },
    }));
  };

  const handleHotWaterSelect = (
    systemType: HotWaterSystemType,
  ) => {
    updateData((previous) => ({
      ...previous,
      hotWater: {
        systemType,
      },
    }));
  };

  const handleCoolingSelect = (
    type: CoolingType,
  ) => {
    updateData((previous) => ({
      ...previous,
      cooling: {
        type,
      },
    }));
  };

  return (
    <div>
      <div className="mb-8">
        <span className="text-sm font-extrabold tracking-wider text-[#1A669A] uppercase">
          {t("badge")}
        </span>

        <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-gray-950">
          {t("title")}
        </h3>
      </div>

      <div className="flex flex-col gap-9">
        <OptionGrid
          title={t("source.question")}
          options={SOURCES}
          selected={data.heating.energySource}
          label={(key) =>
            t(`source.options.${key}`)
          }
          onSelect={(value) =>
            handleSourceSelect(
              value as HeatingEnergySource,
            )
          }
        />

        {data.heating.energySource !== null && (
          <OptionGrid
            title={t("system.question")}
            options={availableSystems}
            selected={data.heating.systemType}
            label={(key) =>
              t(`system.options.${key}`)
            }
            onSelect={(value) =>
              handleSystemSelect(
                value as HeatingSystemType,
              )
            }
          />
        )}

        {data.heating.systemType !== null && (
          <div className="max-w-sm">
            <label
              htmlFor="heating-installation-year"
              className="block text-base sm:text-lg font-bold text-gray-950 mb-3"
            >
              {t("year.label")}
            </label>

            <input
              id="heating-installation-year"
              type="number"
              min="1950"
              max={new Date().getFullYear()}
              inputMode="numeric"
              placeholder={t("year.placeholder")}
              value={
                data.heating.installationYear ?? ""
              }
              onChange={(event) =>
                handleInstallationYear(
                  event.target.value,
                )
              }
              className="w-full h-14 px-4 rounded-xl border border-gray-200 bg-white text-gray-950 text-base outline-none transition focus:border-[#1A669A] focus:ring-2 focus:ring-[#1A669A]/10"
            />

            <p className="mt-2 text-sm text-gray-500">
              {t("year.help")}
            </p>
          </div>
        )}

        <OptionGrid
          title={t("hotWater.question")}
          options={HOT_WATER}
          selected={data.hotWater.systemType}
          label={(key) =>
            t(`hotWater.options.${key}`)
          }
          onSelect={(value) =>
            handleHotWaterSelect(
              value as HotWaterSystemType,
            )
          }
        />

        <OptionGrid
          title={t("cooling.question")}
          options={COOLING}
          selected={data.cooling.type}
          label={(key) =>
            t(`cooling.options.${key}`)
          }
          onSelect={(value) =>
            handleCoolingSelect(
              value as CoolingType,
            )
          }
        />
      </div>
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
      <h4 className="text-base sm:text-lg font-bold text-gray-950 mb-4">
        {title}
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={`min-h-14 px-5 py-4 rounded-xl border text-left text-sm sm:text-base font-bold transition ${
              selected === option
                ? "border-[#1A669A] bg-[#1A669A]/5 text-[#1A669A]"
                : "border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            {label(option)}
          </button>
        ))}
      </div>
    </div>
  );
}