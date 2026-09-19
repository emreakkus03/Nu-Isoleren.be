import {
  KnowledgeArticlesResponse,
  KnowledgeCategory,
  KnowledgeArticleDetailResponse
} from '@/types/knowledge';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://backend.ddev.site/api';

export async function getKnowledgeCategories(
  locale: string = 'nl',
): Promise<KnowledgeCategory[]> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/knowledge-categories?locale=${locale}`,
      {
        cache: 'no-store',
      },
    );

    if (!res.ok) {
      return [];
    }

    const json = await res.json();

    return json.data || [];
  } catch (error) {
    console.error(
      'Fout bij het ophalen van kenniscategorieën:',
      error,
    );

    return [];
  }
}

export async function getKnowledgeArticles(
  locale: string = 'nl',
  options?: {
    category?: string;
    page?: number;
    perPage?: number;
  },
): Promise<KnowledgeArticlesResponse> {
  try {
    const params = new URLSearchParams();

    params.set('locale', locale);
    params.set(
      'per_page',
      String(options?.perPage ?? 9),
    );

    if (options?.category) {
      params.set('category', options.category);
    }

    if (options?.page) {
      params.set('page', String(options.page));
    }

    const res = await fetch(
      `${API_BASE_URL}/knowledge-articles?${params.toString()}`,
      {
        cache: 'no-store',
      },
    );

    if (!res.ok) {
      return emptyKnowledgeResponse();
    }

    return await res.json();
  } catch (error) {
    console.error(
      'Fout bij het ophalen van kennisbankartikels:',
      error,
    );

    return emptyKnowledgeResponse();
  }
}

function emptyKnowledgeResponse(): KnowledgeArticlesResponse {
  return {
    data: [],
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 9,
      total: 0,
    },
  };
}

export async function getKnowledgeArticleBySlug(
  slug: string,
  locale: string = 'nl',
): Promise<KnowledgeArticleDetailResponse | null> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/knowledge-articles/${encodeURIComponent(slug)}?locale=${locale}`,
      {
        cache: 'no-store',
      },
    );

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error(
      `Fout bij ophalen kennisbankartikel "${slug}":`,
      error,
    );

    return null;
  }
}