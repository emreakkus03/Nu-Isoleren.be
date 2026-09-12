'use client';

import { useState, useMemo } from 'react';

interface FaqSectionProps {
  faqs: Array<{
    id: number;
    question: string;
    answer: string;
    category: string;
    service: { id: number; name: string; slug: string } | null;
  }>;
  labels: {
    all: string;
    searchPlaceholder: string;
    noResults: string;
    general: string;
  };
}

export default function FaqSection({ faqs, labels }: FaqSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [openIds, setOpenIds] = useState<number[]>([]);

  const toggleFaq = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const groups = useMemo(() => {
    const map = new Map<string, { key: string; title: string; items: typeof faqs }>();

    const generalFaqs = faqs.filter((f) => !f.service);
    if (generalFaqs.length > 0) {
      map.set('general', {
        key: 'general',
        title: labels.general,
        items: generalFaqs,
      });
    }

    faqs.forEach((f) => {
      if (f.service) {
        const key = `service-${f.service.id}`;
        if (!map.has(key)) {
          map.set(key, {
            key,
            title: f.service.name,
            items: [],
          });
        }
        map.get(key)!.items.push(f);
      }
    });

    return Array.from(map.values());
  }, [faqs, labels]);

  const filteredGroups = useMemo(() => {
    return groups
      .map((group) => {
        if (selectedFilter !== 'all' && group.key !== selectedFilter) {
          return null;
        }

        const filteredItems = group.items.filter((faq) => {
          if (!searchQuery.trim()) return true;
          const query = searchQuery.toLowerCase();
          return (
            faq.question.toLowerCase().includes(query) ||
            faq.answer.toLowerCase().includes(query)
          );
        });

        if (filteredItems.length === 0) return null;

        return {
          ...group,
          items: filteredItems,
        };
      })
      .filter((g): g is NonNullable<typeof g> => g !== null);
  }, [groups, selectedFilter, searchQuery]);

  const handleFilterClick = (key: string) => {
    setSelectedFilter(key);
    if (key !== 'all') {
      const el = document.getElementById(key);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="w-full">
      <div className="relative max-w-xl mx-auto mb-8 sm:mb-10">
        <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={labels.searchPlaceholder}
          className="w-full pl-11 sm:pl-12 pr-12 sm:pr-14 py-3 sm:py-3.5 bg-white border border-slate-200 rounded-xl sm:rounded-2xl shadow-sm text-slate-900 placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#C82024] focus:border-transparent transition"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-4 sm:pr-5 flex items-center text-xs font-semibold text-slate-400 hover:text-slate-600"
          >
            Wissen
          </button>
        )}
      </div>

      <div className="w-full mb-12 sm:mb-16 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-2 overflow-x-auto sm:flex-wrap sm:justify-center py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <button
            onClick={() => handleFilterClick('all')}
            className={`shrink-0 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-[#C82024] text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {labels.all}
          </button>

          {groups.map((group) => {
            const isActive = selectedFilter === group.key;
            return (
              <button
                key={group.key}
                onClick={() => handleFilterClick(group.key)}
                className={`shrink-0 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-[#C82024] text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                {group.title}
              </button>
            );
          })}
        </div>
      </div>

      {filteredGroups.length === 0 ? (
        <div className="text-center py-16 sm:py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 font-medium">{labels.noResults}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-10 sm:gap-14">
          {filteredGroups.map((group) => (
            <section key={group.key} id={group.key} className="scroll-mt-24 sm:scroll-mt-28">
              <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-5">
                <span className="w-1.5 h-5 sm:h-6 rounded-full bg-[#C82024]" />
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {group.title}
                </h2>
              </div>

              <div className="flex flex-col gap-3 sm:gap-4">
                {group.items.map((faq) => {
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
            </section>
          ))}
        </div>
      )}
    </div>
  );
}