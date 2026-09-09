import { Project, PaginatedProjects, ProjectFiltersData } from '@/types/project';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://backend.ddev.site/api';

export async function getFeaturedProjects(locale: string = 'nl'): Promise<Project[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/featured-projects?locale=${locale}`, {
      cache: 'no-store',
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Fout bij het fetchen van uitgelichte projecten:', error);
    return [];
  }
}

export async function getAllProjects(
  locale: string = 'nl',
  searchParams?: Record<string, string | string[] | undefined>
): Promise<PaginatedProjects> {
  try {
    const params = new URLSearchParams();
    params.set('locale', locale);

    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        if (typeof value === 'string' && value) {
          params.set(key, value);
        }
      });
    }

    const res = await fetch(`${API_BASE_URL}/projects?${params.toString()}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return { data: [], meta: { current_page: 1, last_page: 1, per_page: 9, total: 0 } };
    }

    return await res.json();
  } catch (error) {
    console.error('Fout bij het ophalen van projecten:', error);
    return { data: [], meta: { current_page: 1, last_page: 1, per_page: 9, total: 0 } };
  }
}

export async function getProjectFilters(locale: string = 'nl'): Promise<ProjectFiltersData> {
  try {
    const res = await fetch(`${API_BASE_URL}/project-filters?locale=${locale}`, {
      cache: 'no-store',
    });

    if (!res.ok) return { services: [], cities: [] };
    return await res.json();
  } catch (error) {
    console.error('Fout bij het ophalen van filters:', error);
    return { services: [], cities: [] };
  }
}

export async function getProjectBySlug(slug: string, locale: string = 'nl'): Promise<Project | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/projects/${slug}?locale=${locale}`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(`Fout bij fetchen van project "${slug}":`, error);
    return null;
  }
}