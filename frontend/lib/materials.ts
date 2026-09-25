import { contentRequest } from './content-api';
import {
  Material,
  MaterialResponse,
  MaterialsResponse,
} from '@/types/material';


export async function getMaterials(
  locale: string,
): Promise<Material[]> {

  const response = await contentRequest(
    `/materials?locale=${locale}`,
    ['materials'],
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

  const url = `/materials/${encodeURIComponent(slug)}?locale=${locale}`;


  const response = await contentRequest(url, ['materials'], true);


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