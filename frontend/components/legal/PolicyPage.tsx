import { getTranslations } from 'next-intl/server';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import CookiePreferencesButton from '@/components/cookie/CookiePreferencesButton';
import PolicyLinks from './PolicyLinks';

type Section = {
  title: string;
  text: string;
};

export default async function PolicyPage({
  locale,
  kind,
}: {
  locale: string;
  kind: 'privacy' | 'cookies';
}) {
  const t = await getTranslations({
    locale,
    namespace: 'LegalPages',
  });

  const company = await getTranslations({
    locale,
    namespace: 'General.company',
  });

  const breadcrumbs = await getTranslations({
    locale,
    namespace: 'Breadcrumbs',
  });

  const sections = t.raw(`${kind}.sections`) as Section[];

  return (
    <main className="w-full bg-white text-gray-900">
      <article className="mx-auto max-w-4xl px-4 pb-16 page-header-start sm:px-6 md:pb-24">
        <Breadcrumbs
          items={[
            {
              label: breadcrumbs('home'),
              href: '/',
            },
            {
              label: t(`${kind}.title`),
            },
          ]}
        />

        <header className="mb-10 max-md:text-center">
          <h1 className="text-3xl font-extrabold text-[#1A669A] sm:text-4xl">
            {t(`${kind}.title`)}
          </h1>

          <p className="mt-4 text-base leading-relaxed text-gray-700">
            {t(`${kind}.description`)}
          </p>

          <p className="mt-3 text-sm text-gray-500">
            {t('updated')}{' '}
            <time dateTime="2026-09-26">
              {new Intl.DateTimeFormat(locale, {
                dateStyle: 'long',
              }).format(new Date('2026-09-26T12:00:00Z'))}
            </time>
          </p>
        </header>

        <section className="mb-10 rounded-2xl border border-gray-200 bg-slate-50 p-6 sm:p-7">
          <h2 className="text-xl font-bold text-gray-950">
            {t('controller')}
          </h2>

          <address className="mt-4 not-italic leading-7 text-gray-700">
            <span className="font-semibold text-gray-900">
              {company('legalName')}
            </span>
            <br />

            {t('enterpriseNumber')}: {company('enterpriseNumber')}
            <br />

            {t('vatNumber')}: {company('vat')}
            <br />

            {company('address')}
            <br />

            <a
              className="font-medium text-[#1A669A] underline decoration-[#1A669A]/40 underline-offset-2 transition hover:text-[#15547e]"
              href={`mailto:${company('email')}`}
            >
              {company('email')}
            </a>

            <br />

            <a
              className="font-medium text-[#1A669A] underline decoration-[#1A669A]/40 underline-offset-2 transition hover:text-[#15547e]"
              href={`tel:${company('phoneHref')}`}
            >
              {company('phone')}
            </a>
          </address>
        </section>

        <div className="space-y-10 text-base leading-7 text-gray-700">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-bold text-gray-950">
                {section.title}
              </h2>

              <p className="mt-3 whitespace-pre-line">
                {section.text}
              </p>
            </section>
          ))}
        </div>

        
        <div className="mt-12 rounded-2xl border border-gray-200 bg-slate-50 p-6 text-[#1A669A]">
          <CookiePreferencesButton />
          <PolicyLinks />
        </div>
      </article>
    </main>
  );
}