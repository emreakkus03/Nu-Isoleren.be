export function validGtmId(value: string | undefined): string | null {
  const id = value?.trim();
  return id && /^GTM-[A-Z0-9]+$/.test(id) ? id : null;
}
