export interface ServiceItem {
  id: number;
  name: string;
  slug: string;
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
  seo_title: string | null;
  seo_description: string | null;
}