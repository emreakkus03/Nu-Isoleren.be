import RichTextContent from '@/components/ui/RichTextContent';
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
    <div className="flex w-full min-w-0 flex-col items-start gap-10 lg:flex-row lg:gap-14">
      <aside className="mt-18 mb-18 hidden min-w-0 shrink-0 self-stretch lg:block lg:w-[35%]">
        <ServiceToc items={tocItems} />
      </aside>

      <section className="flex w-full min-w-0 flex-col lg:flex-1">
        {article.intro && (
          <article className="w-full min-w-0 border-b border-slate-100">
            <div className="max-w-3xl py-10 sm:py-14">
              <RichTextContent html={article.intro} />
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
                  <RichTextContent html={section.body} className="mb-6" />
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