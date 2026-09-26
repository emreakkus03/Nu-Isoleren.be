import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

export default async function ThankYouPage({ locale, kind }: { locale: string; kind: 'contact' | 'quote' }) {
  const t = await getTranslations({ locale, namespace: 'ThankYouPage' });
  return <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16 md:py-24 text-center">
    <span aria-hidden="true" className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl text-[#1A669A]">✓</span>
    <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold text-[#1A669A]">{t(`${kind}.title`)}</h1>
    <p className="mt-5 text-lg leading-relaxed text-gray-600">{t(`${kind}.description`)}</p>
    <div className="mt-8 flex flex-wrap justify-center gap-4">
      <Link href="/" className="rounded-full bg-[#C82024] px-6 py-3 font-bold text-white">{t('home')}</Link>
      <Link href="/services" className="rounded-full border border-[#1A669A] px-6 py-3 font-bold text-[#1A669A]">{t('services')}</Link>
    </div>
  </section>;
}
