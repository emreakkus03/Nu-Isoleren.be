import { contentRequest } from './content-api';
import { Project, PaginatedProjects, ProjectFiltersData } from '@/types/project';


export async function getFeaturedProjects(
  locale: string = 'nl'
): Promise<Project[]> {
    const res = await contentRequest(
      `/featured-projects?locale=${locale}`,
      ['projects']
    );

    if (!res.ok) return [];

    return await res.json();

}

export async function getRecentProjects(
  locale: string = 'nl',
  limit: number = 3
): Promise<Project[]> {
    const res = await contentRequest(
      `/recent-projects?locale=${locale}&limit=${limit}`,
      ['projects']
    );

    if (!res.ok) return [];

    return await res.json();

}

export async function getAllProjects(
  locale: string = 'nl',
  searchParams?: Record<string, string | string[] | undefined>
): Promise<PaginatedProjects> {
    const params = new URLSearchParams();

    params.set('locale', locale);

    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        if (typeof value === 'string' && value) {
          params.set(key, value);
        }
      });
    }

    const res = await contentRequest(
      `/projects?${params.toString()}`,
      ['projects']
    );

    if (!res.ok) {
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

    return await res.json();

}

export async function getProjectFilters(
  locale: string = 'nl'
): Promise<ProjectFiltersData> {
    const res = await contentRequest(
      `/project-filters?locale=${locale}`,
      ['projects']
    );

    if (!res.ok) {
      return {
        services: [],
        cities: [],
      };
    }

    return await res.json();

}

export async function getProjectBySlug(
  slug: string,
  locale: string = 'nl'
): Promise<Project | null> {
    const res = await contentRequest(
      `/projects/${slug}?locale=${locale}`,
      ['projects'], true
    );

    if (!res.ok) return null;

    return await res.json();

}