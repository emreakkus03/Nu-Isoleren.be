import { getPathname, Link } from '@/i18n/routing';
import type { ServiceFaq } from '@/types/service';

interface ServiceFaqsProps {
  faqs: ServiceFaq[];

  locale: string;

  limit?: number;

  buttonLabel?: string;

  buttonUrl?: string;
}

const splitHrefSuffix = (
  href: string,
) => {
  const match = href.match(
    /^([^?#]*)(.*)$/,
  );

  return {
    pathname:
      match?.[1] || href,

    suffix:
      match?.[2] || '',
  };
};

const localizeHref = (
  href: string,
  locale: string,
) => {
  if (!href) {
    return '#';
  }

  const trimmedHref =
    href.trim();

  if (
    trimmedHref.startsWith('#') ||
    trimmedHref.startsWith('http://') ||
    trimmedHref.startsWith('https://') ||
    trimmedHref.startsWith('mailto:') ||
    trimmedHref.startsWith('tel:')
  ) {
    return trimmedHref;
  }

  if (
    trimmedHref.startsWith(
      `/${locale}/`,
    ) ||
    trimmedHref === `/${locale}`
  ) {
    return trimmedHref;
  }

  const normalizedHref =
    trimmedHref.startsWith('/')
      ? trimmedHref
      : `/${trimmedHref}`;

  const {
    pathname,
    suffix,
  } = splitHrefSuffix(
    normalizedHref,
  );

  const staticRoutes =
    new Set([
      '/',
      '/projects',
      '/services',
      '/faq',
      '/areas',
      '/contact',
      '/privacy-policy',
      '/about',
      '/prices',
      '/prices/epc-calculator',
      '/prices/energy-savings-calculator',
      '/prices/home-insulation-check',
      '/grants',
      '/grants/flanders',
      '/grants/brussels',
      '/grants/wallonia',
      '/quote',
      '/knowledge',
      '/cookie-policy',
    ]);

  try {
    if (
      staticRoutes.has(
        pathname,
      )
    ) {
      const localizedPath =
        getPathname({
          locale:
            locale as any,

          href:
            pathname as any,
        });

      return `${localizedPath}${suffix}`;
    }

    const dynamicRoutes = [
      {
        prefix:
          '/projects/',

        pathname:
          '/projects/[slug]',
      },

      {
        prefix:
          '/services/',

        pathname:
          '/services/[slug]',
      },

      {
        prefix:
          '/areas/',

        pathname:
          '/areas/[slug]',
      },

      {
        prefix:
          '/knowledge/',

        pathname:
          '/knowledge/[slug]',
      },

      {
        prefix:
          '/materials/',

        pathname:
          '/materials/[slug]',
      },
    ];

    for (
      const route
      of dynamicRoutes
    ) {
      if (
        pathname.startsWith(
          route.prefix,
        )
      ) {
        const slug =
          pathname
            .slice(
              route.prefix.length,
            )
            .replace(
              /^\/+|\/+$/g,
              '',
            );

        if (!slug) {
          break;
        }

        const localizedPath =
          getPathname({
            locale:
              locale as any,

            href: {
              pathname:
                route.pathname as any,

              params: {
                slug,
              },
            } as any,
          });

        return `${localizedPath}${suffix}`;
      }
    }
  } catch {
    return `${normalizedHref}${suffix}`;
  }

  return `/${locale}${pathname}${suffix}`;
};

const localizeRichTextHtml = (
  html: string,
  locale: string,
) => {
  if (!html) {
    return '';
  }

  return html.replace(
    /href=(["'])(.*?)\1/gi,
    (
      fullMatch,
      quote: string,
      href: string,
    ) => {
      const localizedHref =
        localizeHref(
          href,
          locale,
        );

      return `href=${quote}${localizedHref}${quote}`;
    },
  );
};

export default function ServiceFaqs({
  faqs,
  locale,
  limit = 8,
  buttonLabel,
  buttonUrl = '/faq',
}: ServiceFaqsProps) {
  const visibleFaqs =
    faqs.slice(
      0,
      limit,
    );

  if (
    visibleFaqs.length === 0
  ) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3 sm:gap-4">
        {visibleFaqs.map(
          (faq) => (
            <details
              key={faq.id}
              className="
                group
                bg-white
                rounded-xl
                sm:rounded-2xl
                border
                border-slate-200
                shadow-sm
                overflow-hidden
              "
            >
              <summary
                className="
                  cursor-pointer
                  list-none
                  px-5
                  sm:px-8
                  py-4
                  sm:py-5
                  flex
                  items-center
                  justify-between
                  gap-4
                  hover:bg-slate-50/70
                  transition-colors
                "
              >
                <span className="font-semibold text-black text-sm sm:text-lg leading-snug">
                  {faq.question}
                </span>

                <span
                  className="
                    shrink-0
                    w-7
                    h-7
                    sm:w-8
                    sm:h-8
                    rounded-full
                    flex
                    items-center
                    justify-center
                    border
                    border-slate-200
                    text-slate-500
                    bg-white
                    transition-all
                    duration-200
                    group-open:bg-[#C82024]
                    group-open:border-[#C82024]
                    group-open:text-white
                    group-open:rotate-180
                  "
                >
                  <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={
                        2.5
                      }
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </summary>

              <div className="px-5 sm:px-8 pb-5 sm:pb-7 pt-4 border-t border-slate-100">
                <div
                  className="
                    text-black
                    text-sm
                    sm:text-base
                    leading-relaxed

                    [&_p]:mb-3
                    [&_p:last-child]:mb-0

                    [&_ul]:list-disc
                    [&_ul]:pl-5
                    [&_ul]:mb-3

                    [&_ol]:list-decimal
                    [&_ol]:pl-5
                    [&_ol]:mb-3

                    [&_li]:text-black

                    [&_strong]:text-black
                    [&_strong]:font-semibold

                    [&_a]:font-bold
                    [&_a]:text-[#1A669A]
                    [&_a]:underline
                    [&_a]:decoration-2
                    [&_a]:decoration-[#1A669A]
                    [&_a]:underline-offset-4
                    [&_a]:transition-colors

                    [&_a:hover]:text-[#C82024]
                    [&_a:hover]:decoration-[#C82024]
                  "
                  dangerouslySetInnerHTML={{
                    __html:
                      localizeRichTextHtml(
                        faq.answer,
                        locale,
                      ),
                  }}
                />
              </div>
            </details>
          ),
        )}
      </div>

      {buttonLabel && (
        <div className="mt-8">
          <Link
            href={
              buttonUrl as never
            }
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-lg
              border-2
              border-[#C82024]
              bg-[#C82024]
              px-5
              py-3
              text-sm
              font-bold
              text-white
              transition-colors
              duration-200
              hover:bg-white
              hover:text-[#C82024]
            "
          >
            {buttonLabel}

            <span aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}