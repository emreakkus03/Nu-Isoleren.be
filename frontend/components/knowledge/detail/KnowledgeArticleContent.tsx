import Image from 'next/image';

import ServiceToc from '@/components/services/ServiceToc';
import type { KnowledgeArticleDetail } from '@/types/knowledge';

interface KnowledgeArticleContentProps {
  article: KnowledgeArticleDetail;
}

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
    <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start w-full min-w-0">
      <aside className="hidden lg:block lg:w-[35%] shrink-0 self-stretch min-w-0 mt-18 mb-18">
        <ServiceToc items={tocItems} />
      </aside>

      <section className="w-full lg:flex-1 min-w-0 flex flex-col">
        {article.intro && (
          <article className="w-full min-w-0 border-b border-slate-100">
            <div className="py-10 sm:py-14 max-w-3xl">
              <div
                className="
                  prose prose-slate max-w-none max-md:[overflow-wrap:anywhere] max-md:[&_img]:max-w-full max-md:[&_table]:block max-md:[&_table]:overflow-x-auto max-md:[&_h2]:text-center max-md:[&_h2]:text-balance
                  text-sm sm:text-base
                  text-slate-600
                  leading-relaxed
                  prose-p:mb-4
                  prose-strong:font-bold
                  prose-strong:text-slate-900
                  prose-a:text-[#1A669A]
                  prose-a:underline
                  hover:prose-a:text-[#C82024]
                "
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
              className="scroll-mt-28 sm:scroll-mt-32 w-full min-w-0 border-b border-slate-100 last:border-b-0"
            >
              <div className="py-10 sm:py-14 max-w-3xl">
                {section.heading && (
                  <h2 className="mb-6 text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-snug text-slate-900 [overflow-wrap:anywhere] max-md:text-balance max-md:[overflow-wrap:anywhere] max-md:w-full max-md:text-center">
                    {section.heading}
                  </h2>
                )}

                {section.body && (
                  <div
                    className="
                      prose prose-slate max-w-none max-md:[overflow-wrap:anywhere] max-md:[&_img]:max-w-full max-md:[&_table]:block max-md:[&_table]:overflow-x-auto max-md:[&_h2]:text-center max-md:[&_h2]:text-balance
                      mb-6
                      text-sm sm:text-base
                      text-slate-600
                      leading-relaxed
                      prose-p:mb-4
                      prose-strong:font-bold
                      prose-strong:text-slate-900
                      prose-a:text-[#1A669A]
                      prose-a:underline
                      hover:prose-a:text-[#C82024]
                      prose-ul:my-5
                      prose-ol:my-5
                      prose-li:my-1
                    "
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
                      className={`mb-7 grid grid-cols-1 ${
                        section.images.length > 1
                          ? 'sm:grid-cols-2'
                          : ''
                      } gap-4`}
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
          <p className="py-10 sm:py-14 text-slate-500 font-medium text-sm sm:text-base">
            Geen inhoud beschikbaar.
          </p>
        )}
      </section>
    </div>
  );
}