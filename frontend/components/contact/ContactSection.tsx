import { useTranslations } from 'next-intl';

import ContactForm from '@/components/contact/ContactForm';
import ContactInfoCard from '@/components/contact/ContactInfoCard';

export default function ContactSection() {
  const t = useTranslations('ContactPage');

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-8">
            <div className="mb-8 sm:mb-10 max-md:text-center">
              <span className="text-sm md:text-base font-extrabold tracking-wider text-[#1A669A] uppercase max-md:block max-md:w-full max-md:text-center max-md:[overflow-wrap:anywhere]">
                {t('form.badge')}
              </span>

              <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15] max-md:text-balance max-md:[overflow-wrap:anywhere] max-md:w-full max-md:text-center">
                {t('form.title')}
              </h2>

              <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl">
                {t('form.description')}
              </p>
            </div>

            <ContactForm />
          </div>

          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <ContactInfoCard />
          </div>
        </div>
      </div>
    </section>
  );
}