"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export interface EpcFaqItem {
  id: number | string;
  question: string;
  answer: string;
}

interface EpcFaqProps {
  faqs: EpcFaqItem[];
}

export default function EpcFaq({
  faqs,
}: EpcFaqProps) {
  const t = useTranslations("EpcPage.faq");

  const [openId, setOpenId] = useState<
    number | string | null
  >(null);

  if (faqs.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase">
            {t("badge")}
          </span>

          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 tracking-tight leading-[1.15]">
            {t("title")}
          </h2>

          <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-gray-600 leading-relaxed">
            {t("description")}
          </p>
        </div>

        <div className="mt-10 border-t border-gray-200">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className="border-b border-gray-200"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenId(
                      isOpen ? null : faq.id,
                    )
                  }
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-6 py-6 text-left"
                >
                  <h3 className="text-base sm:text-lg font-extrabold text-gray-950">
                    {faq.question}
                  </h3>

                  <span className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 text-[#1A669A] text-xl font-medium">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div
                    className="pb-6 pr-12 text-sm sm:text-base text-gray-600 leading-relaxed [&_p:not(:last-child)]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-[#C82024] [&_a]:underline"
                    dangerouslySetInnerHTML={{
                      __html: faq.answer,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}