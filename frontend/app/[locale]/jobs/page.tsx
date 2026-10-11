import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { getVacancies } from '@/lib/vacancies';
import { pageMetadata } from '@/lib/seo/metadata';
import { recruitmentSource } from '@/lib/recruitment';

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };
export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Jobs' });
  return pageMetadata('/jobs', locale, { title: t('metaTitle'), description: t('metaDescription') });
}
export default async function JobsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const [t, crumbs, vacancies, query] = await Promise.all([getTranslations({ locale, namespace: 'Jobs' }), getTranslations({ locale, namespace: 'Breadcrumbs' }), getVacancies(locale), searchParams]);
  const source = recruitmentSource(query);
  return <div className="bg-white pb-16 sm:pb-24">
    <section className="page-header-start border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white pb-10 md:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: crumbs('home'), href: '/' }, { label: t('title') }]} />
        <header className="max-w-3xl max-md:mx-auto max-md:text-center">
          <span className="text-base font-extrabold uppercase tracking-wider text-[#1A669A] md:text-lg">{t('title')}</span>
          <h1 className="mt-3 text-3xl font-extrabold leading-[1.1] tracking-tight text-gray-950 [overflow-wrap:anywhere] max-md:text-balance sm:text-4xl md:text-5xl lg:text-6xl">{t('heroTitle')}</h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-gray-600 max-md:mx-auto sm:text-base md:text-lg">{t('intro')}</p>
          {vacancies.length > 0 && <p className="mt-6 inline-flex rounded-full bg-[#1A669A]/10 px-4 py-2 text-sm font-bold text-[#1A669A]">{t('count', { count: vacancies.length })}</p>}
        </header>
      </div>
    </section>
    <section aria-label={t('title')} className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 md:pt-14 lg:px-8">
      {vacancies.length === 0 ? <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-slate-50 px-6 py-10 text-center sm:p-12">
        <span aria-hidden="true" className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#1A669A]/10 text-[#1A669A]"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6"><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v3h4v-3"/></svg></span>
        <h2 className="text-xl font-extrabold leading-snug text-gray-950 sm:text-2xl">{t('empty')}</h2>
        <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">{t('emptyDescription')}</p>
        <Link href="/about" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-[#1A669A] px-6 py-3 text-sm font-bold text-[#1A669A] transition hover:bg-[#1A669A] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1A669A]">{t('about')}</Link>
      </div> : <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {vacancies.map(vacancy => <article key={vacancy.id} className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-xl focus-within:ring-2 focus-within:ring-[#1A669A] focus-within:ring-offset-4">
          {vacancy.image && <div className="relative aspect-[16/9] bg-slate-100"><Image src={vacancy.image} alt={vacancy.title} fill sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1279px) calc(50vw - 48px), 389px" className="object-cover" /></div>}
          <div className="flex flex-1 flex-col items-start p-6 sm:p-7">
            <span className="max-w-full rounded-full bg-[#1A669A]/10 px-3 py-1.5 text-xs font-bold text-[#1A669A] [overflow-wrap:anywhere]">{t(`employment.${vacancy.employment_type}`)}</span>
            <h2 className="mt-4 text-xl font-extrabold leading-snug tracking-tight text-gray-950 [overflow-wrap:anywhere] sm:text-2xl">{vacancy.title}</h2>
            <p className="mt-3 text-sm font-semibold text-[#1A669A] [overflow-wrap:anywhere]">{vacancy.region}</p>
            <p className="mb-6 mt-3 text-sm leading-7 text-slate-600 [overflow-wrap:anywhere]">{vacancy.short_description}</p>
            <Link href={{ pathname: '/jobs/[slug]', params: { slug: vacancy.slug }, query: source }} className="mt-auto inline-flex min-h-11 max-w-full items-center justify-center gap-3 rounded-full bg-[#C82024] px-6 py-3 text-center text-sm font-bold text-white shadow-sm transition hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1A669A]">{t('view')}<span aria-hidden="true">→</span></Link>
          </div>
        </article>)}
      </div>}
    </section>
  </div>;
}
