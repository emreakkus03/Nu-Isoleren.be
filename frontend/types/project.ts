export interface ProjectImage {
  id: number;
  project_id: number;
  image: string;
  alt: string | null;
  caption: string | null;
  sort_order: number;
  image_url: string;
}

export interface ServiceRelation {
  id: number;
  name: string;
  slug: string;
}

export interface CityRelation {
  id: number;
  name: string;
  slug: string;
  province?: string | null;
}

export interface Project {
  id: number;
  service_id: number;
  city_id: number;
  title: string;
  slug: string;
  all_slugs?: {
    nl?: string;
    fr?: string;
    en?: string;
  };
  short_description: string | null;
  description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  featured_on_home: boolean;
  published: boolean;
  sort_order: number;
  service?: ServiceRelation;
  city?: CityRelation;
  images?: ProjectImage[];
}

export interface ProjectFilterItem {
  id: number;
  name: string;
  slug: string;
  province?: string | null;
}

export interface ProjectFiltersData {
  services: ProjectFilterItem[];
  cities: ProjectFilterItem[];
}

export interface PaginatedProjects {
  data: Project[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}