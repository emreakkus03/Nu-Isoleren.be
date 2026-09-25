export interface CityProject {
  id: number;

  title: string;

  slug: string;

  short_description?: string | null;

  description?: string | null;

  service?: {
    id: number | null;

    name: string | null;

    slug: string | null;
  } | null;

  city?: {
    id: number | null;

    name: string | null;

    slug: string | null;

    province: string | null;
  } | null;

  images?: Array<{
    id?: number;

    image_url?: string | null;

    alt?: string | null;

    [key: string]: unknown;
  }>;

  service_type?: string | null;

  image_url?: string | null;
}

export interface CityFaq {
  question: string;

  answer: string;
}

export interface City {
  alternate_slugs: Record<string, string>;
  id: number;

  name: string;

  postal_code?: string | null;

  slug: string;

  province: string | null;

  region: string | null;

  is_featured: boolean;

  is_indexable: boolean;

  hero_image: string | null;

  hero_title: string | null;

  hero_intro: string | null;

  local_title: string | null;

  local_content: string | null;

  solution_intro: string | null;

  local_faqs: CityFaq[];

  seo_title: string | null;

  seo_description: string | null;

  projects?: CityProject[];
  nearby_cities?: NearbyCity[];
}

export interface CitiesResponse {
  all: City[];

  grouped: Record<string, City[]>;
}

export interface NearbyCity {
  id: number;
  name: string;
  slug: string;
  province: string | null;
  region: string | null;
}