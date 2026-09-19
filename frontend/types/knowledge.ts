export interface KnowledgeCategory {
  id: number;
  name: string;
  slug: string;
  alternate_slugs: {
    nl: string;
    fr: string;
    en: string;
  };
  description: string | null;
  count: number;
}

export interface KnowledgeArticleCard {
  id: number;
  title: string;
  slug: string;
  alternate_slugs: {
    nl: string;
    fr: string;
    en: string;
  };
  excerpt: string | null;
  hero_image: string | null;
  category: {
    id: number;
    name: string;
    slug: string;
  } | null;
  published_at: string | null;
  featured: boolean;
}

export interface KnowledgeArticlesResponse {
  data: KnowledgeArticleCard[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}


export interface KnowledgeArticleSection {
  nav_title: string;
  slug: string;
  heading: string;
  body: string;
  images?: string[];
  image?: string | null;
}

export interface KnowledgeArticleDetail {
  id: number;
  title: string;
  slug: string;

  alternate_slugs: {
    nl: string;
    fr: string;
    en: string;
  };

  excerpt: string | null;
  intro: string | null;
  hero_image: string | null;

  sections: KnowledgeArticleSection[];

  seo_title: string | null;
  seo_description: string | null;

  published_at: string | null;
  updated_at: string | null;

  category: {
    id: number;
    name: string;
    slug: string;
  } | null;

  service: {
    id: number;
    name: string;
    slug: string;
    alternate_slugs: {
      nl: string;
      fr: string;
      en: string;
    };
  } | null;
}

export interface KnowledgeArticleDetailResponse {
  data: KnowledgeArticleDetail;
  related_articles: KnowledgeArticleCard[];
}