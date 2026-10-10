import type { Locale } from '@/lib/seo/urls';
export type Answer = string | boolean | string[];
export interface VacancyQuestion {
  id: number;
  type: 'yes_no' | 'single_choice' | 'multiple_choice' | 'short_text' | 'long_text';
  required: boolean;
  question: string;
  help_text: string | null;
  options: { value: string; label: string }[];
}
export interface Vacancy {
  id: number; status: 'draft' | 'published' | 'closed'; is_open: boolean;
  title: string; slug: string; short_description: string; content: string;
  meta_title: string | null; meta_description: string | null;
  region: string; employment_type: string;
  location_city: string | null; location_region: string | null; location_country: string;
  published_at: string | null; valid_through: string | null; image: string | null;
  is_indexable: boolean; alternate_slugs: Partial<Record<Locale, string>>;
  application_available: boolean; require_cv_or_linkedin: boolean; max_cv_mb: number;
  questions: VacancyQuestion[];
}
