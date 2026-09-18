export type SavingsRegion =
  | 'flanders'
  | 'brussels'
  | 'wallonia';

export type SavingsBuildingType =
  | 'detached'
  | 'semi_detached'
  | 'terraced'
  | 'apartment';

export type SavingsHeatingSource =
  | 'gas'
  | 'oil'
  | 'electric'
  | 'heat_pump'
  | 'wood_pellets'
  | 'other';

export type SavingsMeasure =
  | 'cavity_wall'
  | 'roof'
  | 'external_wall';

export type InsulationStatus =
  | 'none'
  | 'limited'
  | 'insulated'
  | 'unknown';

export interface EnergySavingsFormData {
  region: SavingsRegion | null;

  building: {
    type: SavingsBuildingType | null;
    constructionYear: number | null;
    heatedFloorArea: number | null;
  };

  currentInsulation: {
    roof: InsulationStatus | null;
    walls: InsulationStatus | null;
  };

  measure: {
    type: SavingsMeasure | null;
    surfaceArea: number | null;
  };

  heating: {
    source: SavingsHeatingSource | null;
    annualConsumptionKwh: number | null;
    annualHeatingCost: number | null;
  };
}

export interface EnergySavingsResult {
  estimatedEnergySavingKwh: number;
  energySavingMinKwh: number;
  energySavingMaxKwh: number;

  estimatedPercentageSaving: number;

  estimatedCostSaving: number | null;
  costSavingMin: number | null;
  costSavingMax: number | null;

  confidence: 'medium' | 'limited';

  methodologyVersion: string;
  isIndicative: boolean;
}

export const initialEnergySavingsData: EnergySavingsFormData = {
  region: null,

  building: {
    type: null,
    constructionYear: null,
    heatedFloorArea: null,
  },

  currentInsulation: {
    roof: null,
    walls: null,
  },

  measure: {
    type: null,
    surfaceArea: null,
  },

  heating: {
    source: null,
    annualConsumptionKwh: null,
    annualHeatingCost: null,
  },
};