import {
  EnergySavingsFormData,
  EnergySavingsResult,
} from '@/types/energy-savings';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://backend.ddev.site/api';

export async function calculateEnergySavings(
  data: EnergySavingsFormData
): Promise<EnergySavingsResult> {
  const response = await fetch(
    `${API_BASE_URL}/energy-savings/calculate`,
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
      json.message ||
        'De energiebesparing kon niet worden berekend.'
    );
  }

  return json;
}