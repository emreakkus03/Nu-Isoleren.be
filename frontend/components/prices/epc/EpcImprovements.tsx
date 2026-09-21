import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

interface EpcImprovementsProps {
  locale: string;
}

const SERVICE_SLUGS = {
  nl: {
    cavity: "spouwmuurisolatie",
    roof: "dakisolatie",
    facade: "crepi",
  },
  fr: {
    cavity: "isolation-mur-creux",
    roof: "isolation-de-toiture",
    facade: "crepi",
  },
  en: {
    cavity: "cavity-wall-insulation",
    roof: "roof-insulation",
    facade: "crepi",
  },
} as const;

export default async function EpcImprovements({
  locale,
}: EpcImprovementsProps) {
  const t = await getTranslations({
    locale,
    namespace: "EpcPage.improvements",
  });

  const currentLocale =
    locale === "fr" || locale === "en" ? locale : "nl";

  const slugs = SERVICE_SLUGS[currentLocale];

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase max-md:block max-md:w-full max-md:text-center max-md:[overflow-wrap:anywhere]">
            {t("badge")}
          </span>

          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15] max-md:text-balance max-md:[overflow-wrap:anywhere] max-md:w-full max-md:text-center">
            {t("title")}
          </h2>

          <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed max-md:text-center">
            {t("description")}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-5">
          <article className="rounded-2xl border border-gray-200 p-6">
            <span className="text-sm font-extrabold text-[#1A669A]">
              01
            </span>

            <h3 className="mt-3 text-xl font-extrabold text-gray-950">
              {t("cavity.title")}
            </h3>

            <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
              {t("cavity.description")}
            </p>

            <Link
              href={{
                pathname: "/services/[slug]",
                params: {
                  slug: slugs.cavity,
                },
              }}
              className="inline-flex mt-5 font-bold text-[#C82024] hover:underline"
            >
              {t("cavity.link")}
            </Link>
          </article>

          <article className="rounded-2xl border border-gray-200 p-6">
            <span className="text-sm font-extrabold text-[#1A669A]">
              02
            </span>

            <h3 className="mt-3 text-xl font-extrabold text-gray-950">
              {t("roof.title")}
            </h3>

            <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
              {t("roof.description")}
            </p>

            <Link
              href={{
                pathname: "/services/[slug]",
                params: {
                  slug: slugs.roof,
                },
              }}
              className="inline-flex mt-5 font-bold text-[#C82024] hover:underline"
            >
              {t("roof.link")}
            </Link>
          </article>

          <article className="rounded-2xl border border-gray-200 p-6">
            <span className="text-sm font-extrabold text-[#1A669A]">
              03
            </span>

            <h3 className="mt-3 text-xl font-extrabold text-gray-950">
              {t("facade.title")}
            </h3>

            <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
              {t("facade.description")}
            </p>

            <Link
              href={{
                pathname: "/services/[slug]",
                params: {
                  slug: slugs.facade,
                },
              }}
              className="inline-flex mt-5 font-bold text-[#C82024] hover:underline"
            >
              {t("facade.link")}
            </Link>
          </article>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-xl sm:text-2xl font-extrabold text-gray-950">
            {t("other.title")}
          </h3>

          <p className="mt-3 max-w-3xl text-sm sm:text-base text-gray-600 leading-relaxed">
            {t("other.description")}
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-extrabold text-gray-950">
                {t("other.windows.title")}
              </h4>

              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {t("other.windows.description")}
              </p>
            </div>

            <div>
              <h4 className="font-extrabold text-gray-950">
                {t("other.heating.title")}
              </h4>

              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {t("other.heating.description")}
              </p>
            </div>

            <div>
              <h4 className="font-extrabold text-gray-950">
                {t("other.solar.title")}
              </h4>

              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {t("other.solar.description")}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-8 max-w-4xl text-xs sm:text-sm text-gray-500 leading-relaxed">
          {t("note")}
        </p>
      </div>
    </section>
  );
}