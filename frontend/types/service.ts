export interface ServiceProject {
  id: number;

  title: string;

  slug: string;

  short_description: string | null;

  description?: string | null;

  service?: {
    id: number | null;

    name: string | null;

    slug: string | null;
  };

  city?: {
    id: number | null;

    name: string | null;

    slug: string | null;

    province: string | null;
  };

  images?: Array<{
    id?: number;

    image_url?: string | null;

    alt?: string | null;

    [key: string]: unknown;
  }>;
}

export interface ServiceFaq {
  id: number;

  question: string;

  answer: string;

  category: string | null;

  sort_order: number;
}

export interface ServiceItem {

  id: number;

  name: string;

  slug: string;

  alternate_slugs: {

    nl: string;

    fr: string;

    en: string;

  };

  badge: string;

  short_description: string | null;

  eyebrow: string | null;

  hero_title: string | null;

  intro_text: string | null;

  thumbnail: string | null;

  hero_image: string | null;

  sections: Array<{

    nav_title: string;

    slug: string;

    heading: string;

    body: string;

    bullet_points?: Array<{

      icon: string;

      color: string;

      text: string;

    }>;

    images?: string[];

  }>;

  projects?: ServiceProject[];

  faqs?: ServiceFaq[];

  seo_title: string | null;

  seo_description: string | null;

}