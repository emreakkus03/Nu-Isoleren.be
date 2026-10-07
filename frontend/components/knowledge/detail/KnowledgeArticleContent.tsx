import Image from 'next/image';

import ServiceToc from '@/components/services/ServiceToc';
import type { KnowledgeArticleDetail } from '@/types/knowledge';

interface KnowledgeArticleContentProps {
  article: KnowledgeArticleDetail;
}

const richTextClasses = `
  prose prose-slate max-w-none
  max-md:[overflow-wrap:anywhere]
  max-md:[&_img]:max-w-full
  max-md:[&_table]:block
  max-md:[&_table]:overflow-x-auto

  text-sm sm:text-base
  text-slate-600
  leading-relaxed

  prose-p:my-4
  prose-p:leading-7

  prose-strong:font-extrabold
  prose-strong:text-slate-900

  prose-em:text-slate-700

  prose-a:font-bold
  prose-a:text-[#1A669A]
  prose-a:underline
  prose-a:decoration-2
  prose-a:underline-offset-4
  prose-a:decoration-[#1A669A]/40
  hover:prose-a:text-[#C82024]
  hover:prose-a:decoration-[#C82024]

  prose-h2:mt-9
  prose-h2:mb-4
  prose-h2:text-2xl
  prose-h2:font-extrabold
  prose-h2:tracking-tight
  prose-h2:text-slate-900
  sm:prose-h2:text-3xl

  prose-h3:mt-7
  prose-h3:mb-3
  prose-h3:text-xl
  prose-h3:font-extrabold
  prose-h3:text-[#1A669A]
  sm:prose-h3:text-2xl

  prose-ul:my-6
  prose-ul:space-y-2
  prose-ol:my-6
  prose-ol:space-y-2

  prose-li:my-0
  prose-li:pl-1
  prose-li:leading-7

  prose-ul:marker:text-[#C82024]
  prose-ul:marker:text-lg

  prose-ol:marker:font-extrabold
  prose-ol:marker:text-[#C82024]

  prose-blockquote:my-7
  prose-blockquote:rounded-r-xl
  prose-blockquote:border-l-4
  prose-blockquote:border-[#1A669A]
  prose-blockquote:bg-[#F2F8FC]
  prose-blockquote:px-5
  prose-blockquote:py-4
  prose-blockquote:not-italic
  prose-blockquote:text-slate-700

  prose-code:rounded-md
  prose-code:bg-slate-100
  prose-code:px-1.5
  prose-code:py-0.5
  prose-code:font-semibold
  prose-code:text-[#1A669A]
  prose-code:before:content-none
  prose-code:after:content-none

  prose-pre:my-6
  prose-pre:overflow-x-auto
  prose-pre:rounded-xl
  prose-pre:bg-slate-900
  prose-pre:text-slate-100

  prose-table:my-7
  prose-table:w-full
  prose-table:border-collapse

  prose-thead:bg-slate-50

  prose-th:border
  prose-th:border-slate-200
  prose-th:px-4
  prose-th:py-3
  prose-th:text-left
  prose-th:font-extrabold
  prose-th:text-slate-900

  prose-td:border
  prose-td:border-slate-200
  prose-td:px-4
  prose-td:py-3
  prose-td:align-top

  prose-hr:my-9
  prose-hr:border-slate-200

  [&_u]:decoration-2
  [&_u]:underline-offset-2

  [&_s]:text-slate-500

  [&_sub]:text-xs
  [&_sup]:text-xs

  [&_img]:rounded-xl
`;

export default function KnowledgeArticleContent({
  article,
}: KnowledgeArticleContentProps) {
  const sections = article.sections ?? [];

  const tocItems = sections
    .filter((section) => section.nav_title && section.slug)
    .map((section) => ({
      nav_title: section.nav_title,
      slug: section.slug,
    }));

  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-10 lg:flex-row lg:gap-14">
      <aside className="mt-18 mb-18 hidden min-w-0 shrink-0 self-stretch lg:block lg:w-[35%]">
        <ServiceToc items={tocItems} />
      </aside>

      <section className="flex w-full min-w-0 flex-col lg:flex-1">
        {article.intro && (
          <article className="w-full min-w-0 border-b border-slate-100">
            <div className="max-w-3xl py-10 sm:py-14">
              <div
                className={richTextClasses}
                dangerouslySetInnerHTML={{
                  __html: article.intro,
                }}
              />
            </div>
          </article>
        )}

        {sections.length > 0 ? (
          sections.map((section, sectionIndex) => (
            <article
              key={
                section.slug ||
                `${section.heading}-${sectionIndex}`
              }
              id={section.slug}
              className="w-full min-w-0 scroll-mt-28 border-b border-slate-100 last:border-b-0 sm:scroll-mt-32"
            >
              <div className="max-w-3xl py-10 sm:py-14">
                {section.heading && (
                  <h2 className="mb-6 w-full text-xl font-extrabold leading-snug tracking-tight text-slate-900 [overflow-wrap:anywhere] max-md:text-center max-md:text-balance sm:text-2xl md:text-3xl">
                    {section.heading}
                  </h2>
                )}

                {section.body && (
                  <div
                    className={`${richTextClasses} mb-6`}
                    dangerouslySetInnerHTML={{
                      __html: section.body,
                    }}
                  />
                )}

                {section.image && (
                  <div className="relative mb-7 aspect-[16/10] overflow-hidden rounded-xl bg-slate-100">
                    <Image
                      src={section.image}
                      alt={section.heading || article.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 65vw"
                      className="object-cover"
                    />
                  </div>
                )}

                {section.images &&
                  section.images.length > 0 && (
                    <div
                      className={`mb-7 grid grid-cols-1 gap-4 ${
                        section.images.length > 1
                          ? 'sm:grid-cols-2'
                          : ''
                      }`}
                    >
                      {section.images.map(
                        (image, index) => (
                          <div
                            key={`${section.slug}-${index}`}
                            className="relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-100"
                          >
                            <Image
                              src={image}
                              alt={`${section.heading || article.title} - ${
                                index + 1
                              }`}
                              fill
                              sizes="(max-width: 640px) 100vw, 50vw"
                              className="object-cover"
                            />
                          </div>
                        ),
                      )}
                    </div>
                  )}
              </div>
            </article>
          ))
        ) : (
          <p className="py-10 text-sm font-medium text-slate-500 sm:py-14 sm:text-base">
            Geen inhoud beschikbaar.
          </p>
        )}
      </section>
    </div>
  );
}