export interface CityProject {
  id: number;
  title: string;
  slug: string;
  service_type?: string | null;
  image_url?: string | null;
}

export interface City {
  id: number;
  name: string;
  postal_code?: string | null;
  slug: string;
  province: string | null;
  region: string | null;
  is_featured: boolean;
  projects?: CityProject[];
}

export interface CitiesResponse {
  all: City[];
  grouped: Record<string, City[]>;
}