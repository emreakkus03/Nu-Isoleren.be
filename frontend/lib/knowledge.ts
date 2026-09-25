import { contentRequest } from './content-api';
import {
  KnowledgeArticlesResponse,
  KnowledgeCategory,
  KnowledgeArticleDetailResponse
} from '@/types/knowledge';


export async function getKnowledgeCategories(
  locale: string = 'nl',
): Promise<KnowledgeCategory[]> {
    const res = await contentRequest(
      `/knowledge-categories?locale=${locale}`,
      ['articles'],
    );

    if (!res.ok) {
      return [];
    }

    const json = await res.json();

    return json.data || [];

}

export async function getKnowledgeArticles(
  locale: string = 'nl',
  options?: {
    category?: string;
    page?: number;
    perPage?: number;
  },
): Promise<KnowledgeArticlesResponse> {
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

    const res = await contentRequest(
      `/knowledge-articles?${params.toString()}`,
      ['articles'],
    );

    if (!res.ok) {
      return emptyKnowledgeResponse();
    }

    return await res.json();

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
    const res = await contentRequest(
      `/knowledge-articles/${encodeURIComponent(slug)}?locale=${locale}`,
      ['articles'], true,
    );

    if (!res.ok) {
      return null;
    }

    return await res.json();

}