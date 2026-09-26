import { getTranslations } from 'next-intl/server';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import CookiePreferencesButton from '@/components/cookie/CookiePreferencesButton';
import PolicyLinks from './PolicyLinks';

type Section = { title: string; text: string };

export default async function PolicyPage({ locale, kind }: { locale: string; kind: 'privacy' | 'cookies' }) {
  const t = await getTranslations({ locale, namespace: 'LegalPages' });
  const company = await getTranslations({ locale, namespace: 'General.company' });
  const breadcrumbs = await getTranslations({ locale, namespace: 'Breadcrumbs' });
  const sections = t.raw(`${kind}.sections`) as Section[];
  return <article className="mx-auto max-w-4xl px-4 sm:px-6 page-header-start pb-16 md:pb-24">
    <Breadcrumbs items={[{ label: breadcrumbs('home'), href: '/' }, { label: t(`${kind}.title`) }]} />
    <header className="mb-10 max-md:text-center">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A669A]">{t(`${kind}.title`)}</h1>
      <p className="mt-4 text-gray-600">{t(`${kind}.description`)}</p>
      <p className="mt-3 text-sm text-gray-500">{t('updated')} <time dateTime="2026-09-26">{new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date('2026-09-26T12:00:00Z'))}</time></p>
    </header>
    <section className="mb-8 rounded-2xl bg-slate-50 p-6">
      <h2 className="text-xl font-bold">{t('controller')}</h2>
      <address className="mt-3 not-italic leading-relaxed">
        {company('legalName')}<br />
        {t('enterpriseNumber')}: {company('enterpriseNumber')}<br />
        {t('vatNumber')}: {company('vat')}<br />
        {company('address')}<br />
        <a className="text-[#1A669A] underline" href={`mailto:${company('email')}`}>{company('email')}</a><br />
        <a className="text-[#1A669A] underline" href={`tel:${company('phoneHref')}`}>{company('phone')}</a>
      </address>
    </section>
    <div className="space-y-8 text-gray-700 leading-relaxed">
      {sections.map(section => <section key={section.title}>
        <h2 className="text-xl font-bold text-gray-950">{section.title}</h2>
        <p className="mt-3 whitespace-pre-line">{section.text}</p>
      </section>)}
    </div>
    {kind === 'privacy' && <p className="mt-6"><a className="text-[#1A669A] underline" href="https://www.gegevensbeschermingsautoriteit.be/burger/acties/klacht-indienen">{t('authority')}</a></p>}
    <div className="mt-10 rounded-2xl border border-gray-200 p-6 text-[#1A669A]">
      <CookiePreferencesButton />
      <PolicyLinks />
    </div>
  </article>;
}
