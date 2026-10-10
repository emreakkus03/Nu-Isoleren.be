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
  return pageMetadata('/jobs', locale, { title: t('title'), description: t('intro') });
}
export default async function JobsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const [t, crumbs, vacancies, query] = await Promise.all([getTranslations({ locale, namespace: 'Jobs' }), getTranslations({ locale, namespace: 'Breadcrumbs' }), getVacancies(locale), searchParams]);
  const source = recruitmentSource(query);
  return <main className="page-header-start pb-16 sm:pb-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: crumbs('home'), href: '/' }, { label: t('title') }]} />
      <header className="mb-10 max-md:text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{t('title')}</h1>
        <p className="mt-4 max-w-2xl text-slate-600 max-md:mx-auto">{t('intro')}</p>
      </header>
      {vacancies.length === 0 ? <p className="text-slate-600">{t('empty')}</p> : <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {vacancies.map(vacancy => <article key={vacancy.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold text-[#1A669A]">{vacancy.region} · {t(`employment.${vacancy.employment_type}`)}</p>
          <h2 className="mt-3 text-xl font-extrabold text-slate-900">{vacancy.title}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">{vacancy.short_description}</p>
          <Link href={{ pathname: '/jobs/[slug]', params: { slug: vacancy.slug }, query: source }} className="mt-5 inline-block font-bold text-[#C82024] underline underline-offset-4">{t('view')}</Link>
        </article>)}
      </div>}
    </div>
  </main>;
}
