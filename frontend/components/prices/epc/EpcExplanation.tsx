import { getTranslations } from "next-intl/server";
import Image from "next/image";

interface EpcExplanationProps {
  locale: string;
}

export default async function EpcExplanation({
  locale,
}: EpcExplanationProps) {
  const t = await getTranslations({
    locale,
    namespace: "EpcPage.explanation",
  });

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="max-w-xl">
            <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase">
              {t("badge")}
            </span>

            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15]">
              {t("title")}
            </h2>

            <p className="mt-6 text-base sm:text-lg text-gray-600 leading-relaxed">
              {t("description")}
            </p>

            <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
              {t("secondary")}
            </p>
            <div className="mt-8 w-full max-w-[480px] overflow-hidden rounded-2xl">
  <Image
    src="/images/epc/epc-woning.jpg"
    alt="Woning waarvan dak, gevel, ramen en isolatie invloed hebben op de EPC-waarde"
    width={700}
    height={430}
    className="w-full h-[190px] sm:h-[280px] object-cover object-[center_35%]"
    sizes="(max-width: 640px) 100vw, 480px"
  />
</div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <article className="border border-gray-200 rounded-2xl p-5 sm:p-6">
              <p className="text-sm font-extrabold tracking-wider text-[#1A669A] uppercase">
                {t("score.badge")}
              </p>

              <h3 className="mt-2 text-xl font-extrabold text-gray-950">
                {t("score.title")}
              </h3>

              <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                {t("score.description")}
              </p>
            </article>

            <article className="border border-gray-200 rounded-2xl p-5 sm:p-6">
              <p className="text-sm font-extrabold tracking-wider text-[#1A669A] uppercase">
                {t("label.badge")}
              </p>

              <h3 className="mt-2 text-xl font-extrabold text-gray-950">
                {t("label.title")}
              </h3>

              <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                {t("label.description")}
              </p>
            </article>

            <article className="border border-gray-200 rounded-2xl p-5 sm:p-6">
              <p className="text-sm font-extrabold tracking-wider text-[#1A669A] uppercase">
                {t("usage.badge")}
              </p>

              <h3 className="mt-2 text-xl font-extrabold text-gray-950">
                {t("usage.title")}
              </h3>

              <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                {t("usage.description")}
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}