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
  return <main className="page-header-start pb-16 sm:pb-24">
    <JsonLd data={await jobSchema(vacancy, locale)} />
    <VacancyAlternateLinks slugs={vacancy.alternate_slugs} />
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: crumbs('home'), href: '/' }, { label: t('title'), href: '/jobs' }, { label: vacancy.title }]} />
      <header className="max-w-3xl max-md:text-center">
        <p className="font-bold text-[#1A669A]">{vacancy.region} · {t(`employment.${vacancy.employment_type}`)}</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 [overflow-wrap:anywhere] sm:text-4xl">{vacancy.title}</h1>
        <p className="mt-5 text-base leading-8 text-slate-600">{vacancy.short_description}</p>
        <p className="mt-3 text-sm text-slate-500">{[vacancy.location_city, vacancy.location_region, vacancy.location_country].filter(Boolean).join(', ')}</p>
        {vacancy.published_at && <p className="mt-2 text-sm text-slate-500">{t('published')} <time dateTime={vacancy.published_at}>{new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'Europe/Brussels' }).format(new Date(vacancy.published_at))}</time></p>}
        {open && vacancy.application_available ? <a href="#application" className="mt-6 inline-flex rounded-lg bg-[#C82024] px-6 py-3 font-bold text-white">{t('apply')}</a> : <p className="mt-6 font-bold text-[#C82024]">{t(open ? 'unavailable' : 'closed')}</p>}
      </header>
      {vacancy.image && <div className="relative mt-10 aspect-[16/7] overflow-hidden rounded-2xl"><Image src={vacancy.image} alt={vacancy.title} fill sizes="(max-width: 1280px) 100vw, 1216px" className="object-cover" /></div>}
      <section className="max-w-3xl py-10 sm:py-14"><RichTextContent html={vacancy.content} /></section>
      {open && vacancy.application_available && <ApplicationForm vacancy={vacancy} source={recruitmentSource(await searchParams)} />}
      <Link href="/jobs" className="mt-10 inline-block font-bold text-[#1A669A] underline">{t('back')}</Link>
    </div>
  </main>;
}
