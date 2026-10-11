import { useTranslations } from 'next-intl';

export default function VacancyBadge({ count }: { count: number }) {
  const t = useTranslations('Jobs');
  if (count <= 0) return null;
  return <span className="inline-flex min-h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#C82024] px-1.5 text-[11px] font-extrabold leading-5 text-white"><span aria-hidden="true">{count}</span><span className="sr-only">{t('count', { count })}</span></span>;
}
