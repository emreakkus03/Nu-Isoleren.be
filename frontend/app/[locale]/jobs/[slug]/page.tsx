import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import RichTextContent from '@/components/ui/RichTextContent';
import JsonLd from '@/components/seo/JsonLd';
import ApplicationForm from '@/components/jobs/ApplicationForm';
import VacancyAlternateLinks from '@/components/jobs/VacancyAlternateLinks';
import { getVacancy } from '@/lib/vacancies';
import { pageMetadata } from '@/lib/seo/metadata';
import { jobSchema } from '@/lib/seo/job-schema';
import { recruitmentSource, vacancyOpen } from '@/lib/recruitment';

type Props = { params: Promise<{ locale: string; slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };
export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const vacancy = await getVacancy(locale, slug);
  if (!vacancy) notFound();
  return pageMetadata('/jobs/[slug]', locale, { title: vacancy.meta_title || vacancy.title, description: vacancy.meta_description || vacancy.short_description }, { slugs: vacancy.alternate_slugs, indexable: vacancy.is_indexable && vacancyOpen(vacancy) });
}
export default async function VacancyPage({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  const vacancy = await getVacancy(locale, slug);
  if (!vacancy) notFound();
  const t = await getTranslations({ locale, namespace: 'Jobs' });
  const crumbs = await getTranslations({ locale, namespace: 'Breadcrumbs' });
  const open = vacancyOpen(vacancy);
  const canApply = open && vacancy.application_available;
  const applyClass = 'inline-flex min-h-11 items-center justify-center gap-3 rounded-full bg-[#C82024] px-7 py-3.5 text-center text-base font-bold text-white shadow-md transition hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1A669A]';
  return <div className="bg-white pb-16 sm:pb-24">
    <JsonLd data={await jobSchema(vacancy, locale)} />
    <VacancyAlternateLinks slugs={vacancy.alternate_slugs} />
    <section className="page-header-start border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white pb-10 md:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: crumbs('home'), href: '/' }, { label: t('title'), href: '/jobs' }, { label: vacancy.title }]} />
        <div className={`grid items-center gap-8 lg:gap-12 ${vacancy.image ? 'lg:grid-cols-2' : ''}`}>
          <header className="min-w-0 max-w-3xl max-md:text-center">
            <p className="text-sm font-extrabold uppercase tracking-wider text-[#1A669A] [overflow-wrap:anywhere] md:text-base">{vacancy.region}</p>
            <h1 className="mt-3 text-3xl font-extrabold leading-[1.1] tracking-tight text-gray-950 [overflow-wrap:anywhere] max-md:text-balance sm:text-4xl md:text-5xl">{vacancy.title}</h1>
            <p className="mt-5 text-sm leading-relaxed text-gray-600 [overflow-wrap:anywhere] sm:text-base md:text-lg">{vacancy.short_description}</p>
            <p className="mt-5 inline-flex rounded-full bg-[#1A669A]/10 px-4 py-2 text-sm font-bold text-[#1A669A]">{t(`employment.${vacancy.employment_type}`)}</p>
            <p className="mt-4 text-sm text-slate-500 [overflow-wrap:anywhere]">{[vacancy.location_city, vacancy.location_region, vacancy.location_country].filter(Boolean).join(', ')}</p>
            {vacancy.published_at && <p className="mt-2 text-sm text-slate-500">{t('published')} <time dateTime={vacancy.published_at}>{new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'Europe/Brussels' }).format(new Date(vacancy.published_at))}</time></p>}
            {canApply ? <a href="#application" className={`mt-7 ${applyClass}`}>{t('apply')}<span aria-hidden="true">→</span></a> : <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
              <p className="font-bold text-slate-900">{t(open ? 'unavailable' : 'closed')}</p>
              <Link href="/jobs" className="mt-3 inline-flex min-h-11 items-center font-bold text-[#1A669A] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[#1A669A]">{t('otherJobs')}</Link>
            </div>}
          </header>
          {vacancy.image && <div className="relative aspect-[4/3] min-w-0 overflow-hidden rounded-2xl bg-slate-100 shadow-sm"><Image src={vacancy.image} alt={vacancy.title} fill sizes="(max-width: 1023px) calc(100vw - 48px), 584px" className="object-cover" /></div>}
        </div>
      </div>
    </section>
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-3xl py-10 sm:py-14">
        <RichTextContent html={vacancy.content} />
        {canApply && <div className="mt-8 border-t border-slate-100 pt-7 max-md:text-center"><a href="#application" className={applyClass}>{t('apply')}<span aria-hidden="true">→</span></a></div>}
      </section>
      {canApply && <ApplicationForm vacancy={vacancy} source={recruitmentSource(await searchParams)} />}
      <div className="mx-auto mt-10 max-w-3xl max-md:text-center"><Link href="/jobs" className="inline-flex min-h-11 items-center gap-2 font-bold text-[#1A669A] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1A669A]"><span aria-hidden="true">←</span>{t('back')}</Link></div>
    </div>
  </div>;
}
