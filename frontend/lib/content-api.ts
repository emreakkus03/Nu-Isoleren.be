import 'server-only';

export async function contentRequest(path: string, tags: string[], detail = false): Promise<Response> {
  const origin = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  if (!origin) throw new Error('API_URL is required');
  const response = await fetch(`${origin.replace(/\/$/, '')}${path}`, {
    next: { revalidate: 300, tags },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok && !(detail && response.status === 404)) {
    throw new Error(`Content API unavailable (${response.status})`);
  }
  return response;
}
