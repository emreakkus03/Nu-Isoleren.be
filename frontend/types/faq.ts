export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  service: {
    id: number;
    name: string;
    slug: string;
  } | null;
  is_featured_home: boolean;
  sort_order: number;
}