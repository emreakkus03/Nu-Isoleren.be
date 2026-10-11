import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

export default async function ThankYouPage({
  locale,
  kind,
}: {
  locale: string;
  kind: 'contact' | 'quote' | 'application';
}) {
  const t = await getTranslations({
    locale,
    namespace: 'ThankYouPage',
  });

  return (
  <section className="w-full min-h-screen bg-white">
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 md:py-24 text-center">
      <span
        aria-hidden="true"
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl text-[#1A669A]"
      >
        ✓
      </span>

      {kind === 'application' && <p className="mt-5 text-sm font-bold uppercase tracking-wide text-[#1A669A]">{t('application.eyebrow')}</p>}

      <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold text-[#1A669A]">
        {t(`${kind}.title`)}
      </h1>

      <p className="mt-5 text-lg leading-relaxed text-gray-600">
        {t(`${kind}.description`)}
      </p>

      {kind === 'application' && <>
        <p className="mt-5 text-lg leading-relaxed text-gray-600">{t('application.details')}</p>
        <p className="mt-5 leading-relaxed text-gray-600">{t('application.email')}</p>
      </>}

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href={kind === 'application' ? '/jobs' : '/'}
          className="rounded-full bg-[#C82024] px-6 py-3 font-bold text-white"
        >
          {t(kind === 'application' ? 'application.jobs' : 'home')}
        </Link>

        <Link
          href={kind === 'application' ? '/' : '/services'}
          className="rounded-full border border-[#1A669A] px-6 py-3 font-bold text-[#1A669A]"
        >
          {t(kind === 'application' ? 'home' : 'services')}
        </Link>
      </div>
    </div>
  </section>
);
}