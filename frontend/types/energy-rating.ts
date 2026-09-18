export type EnergyRegion =
  | 'flanders'
  | 'brussels'
  | 'wallonia';

export type BuildingType =
  | 'detached'
  | 'semi_detached'
  | 'terraced'
  | 'apartment';

export type RoofType =
  | 'pitched'
  | 'flat'
  | 'mixed'
  | 'no_direct_roof';

export type RoofInsulationLocation =
  | 'roof'
  | 'attic_floor'
  | 'both'
  | 'none'
  | 'unknown';

export type InsulationMaterial =
  | 'mineral_wool'
  | 'pir_pur'
  | 'eps_xps'
  | 'cellulose_wood_fibre'
  | 'other'
  | 'unknown';

export type WallInsulationType =
  | 'cavity'
  | 'external'
  | 'internal'
  | 'mixed'
  | 'none'
  | 'unknown';

export type FloorBoundary =
  | 'ground'
  | 'basement'
  | 'crawl_space'
  | 'outside'
  | 'heated_space'
  | 'unknown';

export type YesNoUnknown =
  | 'yes'
  | 'no'
  | 'unknown';

export type GlazingType =
  | 'single'
  | 'double'
  | 'high_efficiency_double'
  | 'triple'
  | 'mixed'
  | 'unknown';

export type FrameType =
  | 'wood'
  | 'pvc'
  | 'aluminium'
  | 'mixed'
  | 'unknown';

export type HeatingEnergySource =
  | 'gas'
  | 'oil'
  | 'heat_pump'
  | 'electric'
  | 'wood_pellets'
  | 'district'
  | 'other'
  | 'unknown';

export type HeatingSystemType =
  | 'condensing_boiler'
  | 'non_condensing_boiler'
  | 'heat_pump_air_water'
  | 'heat_pump_ground_water'
  | 'heat_pump_air_air'
  | 'electric_resistance'
  | 'stove'
  | 'district'
  | 'other'
  | 'unknown';

export type HotWaterSystemType =
  | 'same_as_heating'
  | 'electric_boiler'
  | 'heat_pump_boiler'
  | 'gas_water_heater'
  | 'solar_supported'
  | 'other'
  | 'unknown';

export type CoolingType =
  | 'none'
  | 'air_conditioning'
  | 'heat_pump'
  | 'other'
  | 'unknown';

export interface EnergyRatingFormData {
  region: EnergyRegion | null;

  building: {
    type: BuildingType | null;
    constructionYear: number | null;
    heatedFloorArea: number | null;
  };

  roof: {
    type: RoofType | null;
    insulationLocation: RoofInsulationLocation | null;
    insulationMaterial: InsulationMaterial | null;
    insulationThicknessCm: number | null;
  };

  walls: {
    insulationType: WallInsulationType | null;
    insulationMaterial: InsulationMaterial | null;
    insulationThicknessCm: number | null;
  };

  floor: {
    boundary: FloorBoundary | null;
    insulated: YesNoUnknown | null;
    insulationMaterial: InsulationMaterial | null;
    insulationThicknessCm: number | null;
  };

  windows: {
    glazing: GlazingType | null;
    frame: FrameType | null;
  };

  heating: {
    energySource: HeatingEnergySource | null;
    systemType: HeatingSystemType | null;
    installationYear: number | null;
  };

  hotWater: {
    systemType: HotWaterSystemType | null;
  };

  cooling: {
    type: CoolingType | null;
  };

  ventilation: {
    naturalOpenings: YesNoUnknown | null;
    mechanicalExtraction: YesNoUnknown | null;
    mechanicalSupply: YesNoUnknown | null;
    heatRecovery: YesNoUnknown | null;
  };

  renewableEnergy: {
    solarPanels: YesNoUnknown | null;
    solarPowerKwp: number | null;
    solarThermal: YesNoUnknown | null;
  };
}

export const initialEnergyRatingData: EnergyRatingFormData = {
  region: null,

  building: {
    type: null,
    constructionYear: null,
    heatedFloorArea: null,
  },

  roof: {
    type: null,
    insulationLocation: null,
    insulationMaterial: null,
    insulationThicknessCm: null,
  },

  walls: {
    insulationType: null,
    insulationMaterial: null,
    insulationThicknessCm: null,
  },

  floor: {
    boundary: null,
    insulated: null,
    insulationMaterial: null,
    insulationThicknessCm: null,
  },

  windows: {
    glazing: null,
    frame: null,
  },

  heating: {
    energySource: null,
    systemType: null,
    installationYear: null,
  },

  hotWater: {
    systemType: null,
  },

  cooling: {
    type: null,
  },

  ventilation: {
    naturalOpenings: null,
    mechanicalExtraction: null,
    mechanicalSupply: null,
    heatRecovery: null,
  },

  renewableEnergy: {
    solarPanels: null,
    solarPowerKwp: null,
    solarThermal: null,
  },
};

export interface EnergyRatingResult {
  region: EnergyRegion;
  estimatedScore: number;
  scoreMin: number;
  scoreMax: number;
  label: string;
  unit: string;
  methodologyVersion: string;
  confidence: 'high' | 'medium' | 'limited';
  isOfficial: boolean;
  recommendations: string[];
}