import {
  EnergyRatingFormData,
  EnergyRatingResult,
} from '@/types/energy-rating';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://backend.ddev.site/api';

export async function calculateEnergyRating(
  data: EnergyRatingFormData
): Promise<EnergyRatingResult> {
  const response = await fetch(
    `${API_BASE_URL}/energy-rating/estimate`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    }
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(
      json.message || 'De EPC-berekening kon niet worden uitgevoerd.'
    );
  }

  return json;
}