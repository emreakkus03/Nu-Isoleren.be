export type HomeCheckRegion =
  | 'flanders'
  | 'wallonia';

export type HomeCheckBuildingType =
  | 'detached'
  | 'semi_detached'
  | 'terraced'
  | 'apartment';

export type RoofInsulationStatus =
  | 'none'
  | 'old'
  | 'good'
  | 'unknown';

export type CavityPresence =
  | 'yes'
  | 'no'
  | 'unknown';

export type CavityInsulationStatus =
  | 'none'
  | 'old'
  | 'good'
  | 'unknown';

export type FacadeCondition =
  | 'good'
  | 'dirty'
  | 'damaged'
  | 'moisture'
  | 'unknown';

export type MoistureStatus =
  | 'none'
  | 'rising'
  | 'mould'
  | 'unknown';

export type RecommendationKey =
  | 'roof_insulation'
  | 'cavity_wall_insulation'
  | 'cavity_cleaning'
  | 'external_wall_insulation'
  | 'facade_cleaning'
  | 'hydrofuge'
  | 'rising_damp';

export type RecommendationPriority =
  | 'high'
  | 'recommended'
  | 'check';

export interface HomeInsulationCheckData {
  region: HomeCheckRegion | null;

  building: {
    type: HomeCheckBuildingType | null;
    constructionYear: number | null;
  };

  roof: {
    insulation: RoofInsulationStatus | null;
  };

  walls: {
    cavityPresence: CavityPresence | null;
    cavityInsulation: CavityInsulationStatus | null;
    facadeCondition: FacadeCondition | null;
  };

  moisture: {
    status: MoistureStatus | null;
  };
}

export interface HomeCheckRecommendation {
  key: RecommendationKey;
  priority: RecommendationPriority;
}

export const initialHomeInsulationCheckData: HomeInsulationCheckData = {
  region: null,

  building: {
    type: null,
    constructionYear: null,
  },

  roof: {
    insulation: null,
  },

  walls: {
    cavityPresence: null,
    cavityInsulation: null,
    facadeCondition: null,
  },

  moisture: {
    status: null,
  },
};