import type { Answer, Vacancy, VacancyQuestion } from '@/types/vacancy';

export const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
export function recruitmentSource(params: Record<string, string | string[] | undefined>): Record<string, string> {
  return Object.fromEntries(utmKeys.flatMap(key => typeof params[key] === 'string' ? [[key, params[key].slice(0, 255)]] : []));
}
export function vacancyOpen(vacancy: Pick<Vacancy, 'is_open' | 'valid_through'>): boolean {
  return vacancy.is_open && (!vacancy.valid_through || Date.parse(vacancy.valid_through) > Date.now());
}
export function validAnswer(question: VacancyQuestion, value: Answer | undefined): boolean {
  const empty = value === undefined || value === '' || (Array.isArray(value) && value.length === 0);
  if (empty) return !question.required;
  switch (question.type) {
    case 'yes_no': return typeof value === 'boolean';
    case 'single_choice': return typeof value === 'string' && question.options.some(option => option.value === value);
    case 'multiple_choice': return Array.isArray(value) && value.every(item => question.options.some(option => option.value === item)) && new Set(value).size === value.length;
    default: return typeof value === 'string' && Boolean(value.trim()) && value.length <= (question.type === 'short_text' ? 500 : 5000);
  }
}
export function validLinkedIn(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && (url.hostname === 'linkedin.com' || url.hostname.endsWith('.linkedin.com')) && /^\/(in|pub)\/[^/]+/.test(url.pathname);
  } catch { return false; }
}
export function validCv(file: Pick<File, 'name' | 'type' | 'size'>, maxMb: number): boolean {
  return /\.pdf$/i.test(file.name) && file.type === 'application/pdf' && file.size <= maxMb * 1024 * 1024;
}
