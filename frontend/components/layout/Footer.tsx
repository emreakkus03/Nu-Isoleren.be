import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/routing';
import { getServices } from '@/lib/services';
import GoogleReviews from '@/components/layout/GoogleReviews';

interface FooterProps {
  locale: string;
}

const workAreas = [
  {
    name: 'Antwerpen',
    slug: 'antwerpen',
  },
  {
    name: 'Sint-Niklaas',
    slug: 'sint-niklaas',
  },
  {
    name: 'Aalst',
    slug: 'aalst',
  },
  {
    name: 'Zaventem',
    slug: 'zaventem',
  },
  {
    name: 'Gent',
    slug: 'gent',
  },
  {
    name: 'Genk',
    slug: 'genk',
  },
  {
    name: 'Brugge',
    slug: 'brugge',
  },
  {
    name: 'Oostende',
    slug: 'oostende',
  },
];

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5 sm:h-6 sm:w-6"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5 sm:h-6 sm:w-6"
      aria-hidden="true"
    >
      <path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v6h4v-6h3l1-4h-4V9c0-.7.3-1 1-1Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5 sm:h-6 sm:w-6"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
      />

      <circle
        cx="12"
        cy="12"
        r="4"
      />

      <circle
        cx="17.5"
        cy="6.5"
        r="1"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5 sm:h-6 sm:w-6"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="9"
        width="4"
        height="12"
      />

      <path d="M5 3.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />

      <path d="M11 21V9h4v2c1-1.5 2.5-2.5 4.5-2.5 3 0 4.5 2 4.5 5.5v7h-4v-6.5c0-1.8-.7-2.8-2.2-2.8-1.7 0-2.8 1.2-2.8 3.3v6Z" />
    </svg>
  );
}

export default async function Footer({
  locale,
}: FooterProps) {
  const [t, services] = await Promise.all([
    getTranslations({
      locale,
      namespace: 'Footer',
    }),

    getServices(locale).catch((error) => {
      console.error(
        'Kon diensten niet ophalen voor footer:',
        error,
      );

      return [];
    }),
  ]);

  const facebookUrl =
    process.env.NEXT_PUBLIC_FACEBOOK_URL;

  const instagramUrl =
    process.env.NEXT_PUBLIC_INSTAGRAM_URL;

  const linkedinUrl =
    process.env.NEXT_PUBLIC_LINKEDIN_URL;

  return (
    <footer className="w-full bg-[#EEF2F4] text-slate-950">
      <div className="border-b border-slate-200 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 sm:py-4">
          <GoogleReviews
            variant="footer"
            label={t('reviews.excellent')}
            outOfFiveLabel={t('reviews.outOfFive')}
            basedOnLabel={t('reviews.basedOn')}
            reviewsLabel={t('reviews.reviews')}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 sm:py-14 lg:py-20">
        <div
          className="
            grid grid-cols-1
            gap-y-10
            sm:gap-y-12
            md:grid-cols-2
            md:gap-x-12
            lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)_max-content]
            lg:gap-x-16
            lg:gap-y-14
          "
        >
          <div className="flex flex-col gap-10 sm:gap-12 lg:gap-14">
            <div>
              <Link
                href="/"
                className="inline-block"
              >
                <Image
                  src="/logo/logo.svg"
                  alt="Nu-Isoleren.be"
                  width={230}
                  height={70}
                  className="
                    h-auto
                    w-[180px]
                    sm:w-[205px]
                    lg:w-[230px]
                  "
                />
              </Link>

              <p className="mt-5 max-w-[280px] text-sm sm:text-base lg:text-lg font-medium leading-relaxed sm:leading-snug">
                {t('description')}
              </p>

              <div className="mt-5 flex items-center gap-3">
                {facebookUrl && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="transition hover:text-[#C82024]"
                  >
                    <FacebookIcon />
                  </a>
                )}

                {instagramUrl && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="transition hover:text-[#C82024]"
                  >
                    <InstagramIcon />
                  </a>
                )}

                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="transition hover:text-[#C82024]"
                  >
                    <LinkedInIcon />
                  </a>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-extrabold uppercase">
                {t('contact.title')}
              </h2>

              <address className="mt-4 sm:mt-5 not-italic text-sm sm:text-base lg:text-lg leading-relaxed">
                <p>
                  Neerstraat 5
                  <br />
                  9220 Hamme
                  <br />
                  België
                </p>

                <a
                  href="tel:+3280063635"
                  className="mt-2 block transition hover:text-[#C82024]"
                >
                  +32 (0) 800 63 63 5
                </a>

                <a
                  href="mailto:info@nu-isoleren.be"
                  className="block break-all transition hover:text-[#C82024]"
                >
                  info@nu-isoleren.be
                </a>

                <p className="mt-1">
                  BE 0726.774.181
                </p>
              </address>
            </div>
          </div>

          <div className="flex flex-col gap-10 sm:gap-12 lg:gap-14">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold uppercase">
                {t('services.title')}
              </h2>

              <div
                className="
                  mt-4 sm:mt-5
                  grid grid-cols-1
                  min-[430px]:grid-cols-2
                  gap-x-8
                  gap-y-2.5 sm:gap-y-3
                "
              >
                {services.map((service) => (
                  <Link
                    key={service.id}
                    href={{
                      pathname: '/services/[slug]',
                      params: {
                        slug: service.slug,
                      },
                    }}
                    className="
                      text-sm sm:text-base lg:text-lg
                      leading-snug
                      transition
                      hover:text-[#C82024]
                    "
                  >
                    {service.name}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-extrabold uppercase">
                {t('workAreas.title')}
              </h2>

              <div
                className="
                  mt-4 sm:mt-5
                  grid grid-cols-2
                  gap-x-6 sm:gap-x-10
                  gap-y-2.5 sm:gap-y-3
                "
              >
                {workAreas.map((area) => (
                  <Link
                    key={area.slug}
                    href={{
                      pathname: '/areas/[slug]',
                      params: {
                        slug: area.slug,
                      },
                    }}
                    className="
                      text-sm sm:text-base lg:text-lg
                      transition
                      hover:text-[#C82024]
                    "
                  >
                    {area.name}
                  </Link>
                ))}
              </div>

              <Link
                href="/areas"
                className="
                  mt-5
                  inline-flex items-center gap-2 sm:gap-3
                  text-sm sm:text-base
                  font-bold
                  text-[#D42027]
                  transition-all
                  hover:gap-4
                "
              >
                {t('workAreas.all')}

                <ArrowRightIcon />
              </Link>
            </div>
          </div>

          <div
            className="
              md:col-span-2
              lg:col-span-1
              lg:justify-self-end
            "
          >
            <div className="w-full lg:w-max">
              <span
                aria-hidden="true"
                className="
                  hidden
                  lg:block
                  invisible
                  h-0
                  overflow-hidden
                  whitespace-nowrap
                  text-base
                "
              >
                {t('builtBy')}{' '}
                <span className="font-extrabold">
                  Emre Akkus
                </span>
              </span>

              <div
                className="
                  grid grid-cols-1
                  sm:grid-cols-2
                  gap-10 sm:gap-12
                  lg:grid-cols-1
                  lg:gap-14
                "
              >
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold uppercase">
                    {t('calculate.title')}
                  </h2>

                  <nav className="mt-4 sm:mt-5 flex flex-col gap-2.5 sm:gap-3">
                    <Link
                      href="/prices/epc-calculator"
                      className="text-sm sm:text-base lg:text-lg transition hover:text-[#C82024]"
                    >
                      {t('calculate.epc')}
                    </Link>

                    <Link
                      href="/prices/energy-savings-calculator"
                      className="text-sm sm:text-base lg:text-lg transition hover:text-[#C82024]"
                    >
                      {t('calculate.savings')}
                    </Link>

                    <Link
                      href="/prices/home-insulation-check"
                      className="text-sm sm:text-base lg:text-lg transition hover:text-[#C82024]"
                    >
                      {t('calculate.homeCheck')}
                    </Link>
                  </nav>
                </div>

                <div>
                  <h2 className="text-base sm:text-lg font-extrabold uppercase">
                    {t('about.title')}
                  </h2>

                  <nav className="mt-4 sm:mt-5 flex flex-col gap-2.5 sm:gap-3">
                    <Link
                      href="/about"
                      className="text-sm sm:text-base lg:text-lg transition hover:text-[#C82024]"
                    >
                      {t('about.aboutUs')}
                    </Link>

                    <Link
                      href="/projects"
                      className="text-sm sm:text-base lg:text-lg transition hover:text-[#C82024]"
                    >
                      {t('about.projects')}
                    </Link>

                    <Link
                      href="/knowledge"
                      className="text-sm sm:text-base lg:text-lg transition hover:text-[#C82024]"
                    >
                      {t('about.knowledge')}
                    </Link>

                    <Link
                      href="/faq"
                      className="text-sm sm:text-base lg:text-lg transition hover:text-[#C82024]"
                    >
                      {t('about.faq')}
                    </Link>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-300">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-5 sm:py-6">
          <div
            className="
              grid grid-cols-1
              gap-4
              md:grid-cols-2
              md:items-center
              lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)_max-content]
            "
          >
            <div
              className="
                flex flex-wrap
                items-center
                justify-center
                gap-x-2
                gap-y-1
                text-center
                text-xs sm:text-sm md:text-base
                md:justify-start
                md:text-left
                lg:col-span-2
              "
            >
              <span>
                © Nu-Isoleren.be
              </span>

              <span>
                |
              </span>

              <Link
                href="/privacy-policy"
                className="transition hover:text-[#C82024]"
              >
                {t('legal.privacy')}
              </Link>

              <span>
                |
              </span>

              <Link
                href="/cookie-policy"
                className="transition hover:text-[#C82024]"
              >
                {t('legal.cookies')}
              </Link>
            </div>

            <p
              className="
                text-center
                text-xs sm:text-sm md:text-base
                whitespace-nowrap
                md:text-right
                lg:justify-self-end
                lg:text-left
              "
            >
              {t('builtBy')}{' '}
              <span className="font-extrabold">
                <a href="https://www.linkedin.com/in/emre-akkus-118363251/" target="_blank" rel="noopener noreferrer">
                  Emre Akkus
                </a>
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}