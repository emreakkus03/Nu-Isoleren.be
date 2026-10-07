import Image from 'next/image';

import ServiceToc from '@/components/services/ServiceToc';
import type { KnowledgeArticleDetail } from '@/types/knowledge';

interface KnowledgeArticleContentProps {
  article: KnowledgeArticleDetail;
}

const richTextClasses = `
  max-w-none
  text-sm
  leading-7
  text-slate-600
  sm:text-base
  sm:leading-8
  max-md:[overflow-wrap:anywhere]

  [&_p]:my-4

  [&_strong]:font-extrabold
  [&_strong]:text-slate-900

  [&_em]:italic
  [&_em]:text-slate-700

  [&_u]:decoration-2
  [&_u]:underline-offset-2

  [&_s]:text-slate-500

  [&_a]:font-bold
  [&_a]:text-[#1A669A]
  [&_a]:underline
  [&_a]:decoration-2
  [&_a]:decoration-[#1A669A]/40
  [&_a]:underline-offset-4
  [&_a]:transition-colors
  hover:[&_a]:text-[#C82024]
  hover:[&_a]:decoration-[#C82024]

  [&_h2]:mt-10
  [&_h2]:mb-4
  [&_h2]:text-2xl
  [&_h2]:font-extrabold
  [&_h2]:leading-tight
  [&_h2]:tracking-tight
  [&_h2]:text-slate-900
  sm:[&_h2]:text-3xl

  [&_h3]:mt-8
  [&_h3]:mb-3
  [&_h3]:text-xl
  [&_h3]:font-extrabold
  [&_h3]:leading-snug
  [&_h3]:text-[#1A669A]
  sm:[&_h3]:text-2xl

  [&_ul]:my-6
  [&_ul]:list-disc
  [&_ul]:space-y-2
  [&_ul]:pl-7

  [&_ol]:my-6
  [&_ol]:list-decimal
  [&_ol]:space-y-2
  [&_ol]:pl-7

  [&_li]:pl-1
  [&_li]:leading-7

  [&_li::marker]:font-extrabold
  [&_li::marker]:text-[#C82024]

  [&_ul_ul]:mt-2
  [&_ul_ul]:mb-2
  [&_ul_ul]:list-[circle]

  [&_ol_ol]:mt-2
  [&_ol_ol]:mb-2

  [&_blockquote]:my-7
  [&_blockquote]:rounded-r-xl
  [&_blockquote]:border-l-4
  [&_blockquote]:border-[#1A669A]
  [&_blockquote]:bg-[#F2F8FC]
  [&_blockquote]:px-5
  [&_blockquote]:py-4
  [&_blockquote]:font-medium
  [&_blockquote]:text-slate-700

  [&_blockquote_p]:my-0

  [&_code]:rounded
  [&_code]:bg-slate-100
  [&_code]:px-1.5
  [&_code]:py-0.5
  [&_code]:font-semibold
  [&_code]:text-[#1A669A]

  [&_pre]:my-7
  [&_pre]:overflow-x-auto
  [&_pre]:rounded-xl
  [&_pre]:bg-slate-900
  [&_pre]:p-5
  [&_pre]:text-sm
  [&_pre]:text-white

  [&_pre_code]:bg-transparent
  [&_pre_code]:p-0
  [&_pre_code]:text-inherit

  [&_table]:my-7
  [&_table]:w-full
  [&_table]:border-collapse
  [&_table]:text-sm

  [&_thead]:bg-slate-50

  [&_th]:border
  [&_th]:border-slate-200
  [&_th]:px-4
  [&_th]:py-3
  [&_th]:text-left
  [&_th]:font-extrabold
  [&_th]:text-slate-900

  [&_td]:border
  [&_td]:border-slate-200
  [&_td]:px-4
  [&_td]:py-3
  [&_td]:align-top

  [&_hr]:my-9
  [&_hr]:border-0
  [&_hr]:border-t
  [&_hr]:border-slate-200

  [&_sub]:text-xs
  [&_sup]:text-xs

  [&_img]:h-auto
  [&_img]:max-w-full
  [&_img]:rounded-xl

  max-md:[&_table]:block
  max-md:[&_table]:overflow-x-auto
`;

export default function KnowledgeArticleContent({
  article,
}: KnowledgeArticleContentProps) {
  const sections = article.sections ?? [];

  const tocItems = sections
    .filter(
      (section) =>
        section.nav_title &&
        section.slug,
    )
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