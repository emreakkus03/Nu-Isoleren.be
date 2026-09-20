export interface MaterialService {
  id: number;
  name: string;
  slug: string;
  badge: string | null;
  short_description: string | null;
  thumbnail: string | null;
}

export interface MaterialSection {
  nav_title: string;
  slug: string;
  heading: string;
  body: string | null;
  images: string[];
  show_in_menu: boolean;
  is_active: boolean;
}

export interface Material {
  id: number;
  name: string;
  slug: string;

  alternate_slugs: {
    nl: string;
    fr: string;
    en: string;
  };

  eyebrow: string | null;
  hero_title: string | null;
  short_description: string | null;
  intro_text: string | null;

  hero_image: string | null;
  thumbnail: string | null;

  seo: {
    title: string | null;
    description: string | null;
  };

  services: MaterialService[];

  sort_order: number;

  sections: MaterialSection[];
}

export interface MaterialResponse {
  data: Material;
}

export interface MaterialsResponse {
  data: Material[];
}