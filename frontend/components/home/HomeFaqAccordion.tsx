'use client';

import { useState } from 'react';
import type { FaqItem } from '@/types/faq';

export default function HomeFaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openIds, setOpenIds] = useState<number[]>([]);

  const toggleFaq = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {faqs.map((faq) => {
        const isOpen = openIds.includes(faq.id);

        return (
          <div
            key={faq.id}
            className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm transition overflow-hidden"
          >
            <button
              onClick={() => toggleFaq(faq.id)}
              className="w-full text-left px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between gap-3 sm:gap-4 select-none hover:bg-slate-50/70 transition cursor-pointer"
            >
              <span className="font-semibold text-slate-900 text-sm sm:text-lg pr-2 leading-snug">
                {faq.question}
              </span>

              <span
                className={`shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border transition-all duration-200 ${
                  isOpen
                    ? 'bg-[#C82024] border-[#C82024] text-white rotate-180'
                    : 'border-slate-200 text-slate-500 bg-slate-50'
                }`}
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>

            {isOpen && (
              <div className="px-5 sm:px-8 pb-5 sm:pb-7 pt-2 border-t border-slate-100">
                <div
                  className="text-slate-600 text-sm sm:text-base leading-relaxed 
                             [&_p]:mb-3 [&_p:last-child]:mb-0 
                             [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ul]:space-y-1 
                             [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_ol]:space-y-1 
                             [&_li]:text-slate-600 
                             [&_strong]:text-slate-900 [&_strong]:font-semibold 
                             [&_a]:text-[#C82024] [&_a]:font-semibold hover:[&_a]:underline"
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}