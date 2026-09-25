import { revalidateTag } from 'next/cache';
import { authorized, validatedTags } from '@/lib/seo/revalidation';
export async function POST(request: Request) {
  if (!process.env.REVALIDATION_SECRET || process.env.REVALIDATION_SECRET.length < 32) return Response.json({ error: 'Unavailable' }, { status: 503 });
  if (!authorized(request.headers.get('authorization'), process.env.REVALIDATION_SECRET)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (!request.headers.get('content-type')?.startsWith('application/json')) return Response.json({ error: 'Unsupported media type' }, { status: 415 });
  const reader = request.body?.getReader();
  if (!reader) return Response.json({ error: 'Invalid payload' }, { status: 400 });
  let text = '';
  let bytes = 0;
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > 2048) { await reader.cancel(); return Response.json({ error: 'Payload too large' }, { status: 413 }); }
    text += decoder.decode(value, { stream: true });
  }
  let payload: unknown;
  try { payload = JSON.parse(text + decoder.decode()); } catch { return Response.json({ error: 'Invalid JSON' }, { status: 400 }); }
  const tags = validatedTags(payload);
  if (!tags) return Response.json({ error: 'Invalid tags' }, { status: 400 });
  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  return Response.json({ revalidated: true }, { headers: { 'Cache-Control': 'no-store' } });
}
