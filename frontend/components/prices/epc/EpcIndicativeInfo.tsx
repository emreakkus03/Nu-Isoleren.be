import { getTranslations } from "next-intl/server";

interface EpcIndicativeInfoProps {
  locale: string;
}

export default async function EpcIndicativeInfo({
  locale,
}: EpcIndicativeInfoProps) {
  const t = await getTranslations({
    locale,
    namespace: "EpcPage.indicative",
  });

  return (
    <section className="w-full bg-[#F8F9FA] py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="max-w-xl">
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

          <div className="border-t border-gray-300">
            <div className="py-5 border-b border-gray-300">
              <h3 className="text-lg font-extrabold text-gray-950">
                {t("data.title")}
              </h3>

              <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
                {t("data.description")}
              </p>
            </div>

            <div className="py-5 border-b border-gray-300">
              <h3 className="text-lg font-extrabold text-gray-950">
                {t("assumptions.title")}
              </h3>

              <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
                {t("assumptions.description")}
              </p>
            </div>

            <div className="py-5 border-b border-gray-300">
              <h3 className="text-lg font-extrabold text-gray-950">
                {t("official.title")}
              </h3>

              <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
                {t("official.description")}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 px-5 sm:px-6 py-5">
          <p className="text-sm sm:text-base text-amber-950 leading-relaxed">
            <strong>{t("notice.title")}</strong>{" "}
            {t("notice.description")}
          </p>
        </div>
      </div>
    </section>
  );
}