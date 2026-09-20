import {
  Material,
  MaterialResponse,
  MaterialsResponse,
} from '@/types/material';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getMaterials(
  locale: string,
): Promise<Material[]> {
  if (!API_URL) {
    throw new Error(
      'NEXT_PUBLIC_API_URL is niet ingesteld.',
    );
  }

  const response = await fetch(
    `${API_URL}/materials?locale=${locale}`,
    {
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    throw new Error(
      `Materialen konden niet worden opgehaald: ${response.status}`,
    );
  }

  const result =
    (await response.json()) as MaterialsResponse;

  return result.data;
}

export async function getMaterial(
  slug: string,
  locale: string,
): Promise<Material | null> {
  if (!API_URL) {
    throw new Error(
      'NEXT_PUBLIC_API_URL is niet ingesteld.',
    );
  }

  const url = `${API_URL}/materials/${encodeURIComponent(slug)}?locale=${locale}`;


  const response = await fetch(url, {
    cache: 'no-store',
  });


  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Materiaal kon niet worden opgehaald: ${response.status}`,
    );
  }

  const result =
    (await response.json()) as MaterialResponse;


  return result.data;
}