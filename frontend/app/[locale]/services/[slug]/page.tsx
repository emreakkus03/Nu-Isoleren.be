import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Image from 'next/image';

import { getServiceBySlug } from '@/lib/services';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ServiceToc from '@/components/services/ServiceToc';
import DynamicBulletIcon from '@/components/ui/DynamicBulletIcon';
import ServiceAlternateLinks from '@/components/services/ServiceAlternateLinks';

export const dynamic = 'force-dynamic';

const MEDIA_BASE_URL =
  process.env.NEXT_PUBLIC_S3_PUBLIC_URL ||
  'http://127.0.0.1:9000/nu-isoleren';

interface ServiceDetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

interface ContentBlock {
  type: string;
  data?: Record<string, any>;
}

interface ServiceSection {
  nav_title?: string;
  slug?: string;
  heading?: string;

  show_in_menu?: boolean;
  is_active?: boolean;

  background_color?: string;
  text_color?: string;
  content_width?: 'normal' | 'wide' | 'full';

  body?: string;

  bullet_points?: Array<{
    icon?: string;
    color?: string;
    text?: string;
  }>;

  images?: string[];

  content_blocks?: ContentBlock[];
}

const getMediaUrl = (
  path?: string | null,
): string | null => {
  if (!path) {
    return null;
  }

  if (
    path.startsWith('http://') ||
    path.startsWith('https://')
  ) {
    return path;
  }

  if (path.startsWith('/')) {
    return path;
  }

  return `${MEDIA_BASE_URL.replace(/\/+$/, '')}/${path.replace(
    /^\/+/,
    '',
  )}`;
};

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  const service = await getServiceBySlug(slug, locale);

  if (!service) {
    return {
      title: 'Dienst niet gevonden | Nu-Isoleren.be',
    };
  }

  const title =
    service.seo_title ||
    `${service.hero_title || service.name} | Nu-Isoleren.be`;

  const description =
    service.seo_description ||
    service.short_description ||
    `Ontdek alles over ${service.name} bij Nu-Isoleren.be. Vraag vrijblijvend advies of een offerte aan.`;

  const heroImage =
    getMediaUrl(service.hero_image) ||
    getMediaUrl(service.thumbnail);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: heroImage ? [heroImage] : [],
    },
  };
}

const formatIntroParagraphs = (rawText: string) => {
  if (!rawText) {
    return '';
  }

  if (!rawText.includes('<p>')) {
    return rawText
      .split(/\r\n|\n|\r/)
      .filter((paragraph) => paragraph.trim() !== '')
      .map(
        (paragraph) =>
          `<p class="mb-4 last:mb-0">${paragraph.trim()}</p>`,
      )
      .join('');
  }

  return rawText;
};

const localizeHref = (
  href: string,
  locale: string,
) => {
  if (!href) {
    return '#';
  }

  if (
    href.startsWith('#') ||
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:')
  ) {
    return href;
  }

  if (
    href.startsWith(`/${locale}/`) ||
    href === `/${locale}`
  ) {
    return href;
  }

  if (href.startsWith('/')) {
    return `/${locale}${href}`;
  }

  return `/${locale}/${href}`;
};

const getContentWidthClass = (
  width?: 'normal' | 'wide' | 'full',
) => {
  switch (width) {
    case 'full':
      return 'max-w-none';

    case 'wide':
      return 'max-w-5xl';

    default:
      return 'max-w-3xl';
  }
};

const getImageRadiusClass = (
  radius?: string,
) => {
  switch (radius) {
    case 'none':
      return 'rounded-none';

    case 'small':
      return 'rounded-md';

    case 'medium':
      return 'rounded-xl';

    case 'large':
    default:
      return 'rounded-2xl';
  }
};

const getButtonStyle = (
  style?: string,
  backgroundColor?: string,
  textColor?: string,
  borderColor?: string,
) => {
  const type = style || 'filled';

  if (type === 'text') {
    return {
      className:
        'inline-flex items-center gap-2 font-bold transition-opacity hover:opacity-70',
      style: {
        color:
          textColor ||
          backgroundColor ||
          '#C82024',
      },
    };
  }

  if (type === 'outline') {
    return {
      className:
        'inline-flex items-center justify-center gap-2 rounded-lg border-2 px-5 py-3 text-sm font-bold transition-opacity hover:opacity-80',
      style: {
        color:
          textColor ||
          borderColor ||
          '#C82024',
        borderColor:
          borderColor ||
          '#C82024',
        backgroundColor: 'transparent',
      },
    };
  }

  return {
    className:
      'inline-flex items-center justify-center gap-2 rounded-lg border-2 px-5 py-3 text-sm font-bold transition-opacity hover:opacity-90',
    style: {
      backgroundColor:
        backgroundColor ||
        '#C82024',
      color:
        textColor ||
        '#FFFFFF',
      borderColor:
        borderColor ||
        backgroundColor ||
        '#C82024',
    },
  };
};

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function ContentBlockRenderer({
  block,
  locale,
}: {
  block: ContentBlock;
  locale: string;
}) {
  const data = block.data || {};

  switch (block.type) {
    case 'rich_text': {
      if (!data.content) {
        return null;
      }

      return (
        <div
          className="
            prose prose-slate max-w-none
            text-sm sm:text-base
            leading-relaxed
            prose-p:mb-4
            prose-strong:font-bold
            prose-strong:text-slate-900
            prose-a:text-[#1A669A]
            prose-a:underline
            hover:prose-a:text-[#C82024]
          "
          dangerouslySetInnerHTML={{
            __html: data.content,
          }}
        />
      );
    }

    case 'text_image': {
      const imageUrl = getMediaUrl(
        data.image,
      );

      const imageFirst =
        data.image_position === 'left';

      return (
        <div
          className={`
            grid grid-cols-1
            lg:grid-cols-2
            gap-7 lg:gap-10
            ${
              data.vertical_alignment === 'start'
                ? 'items-start'
                : data.vertical_alignment === 'end'
                  ? 'items-end'
                  : 'items-center'
            }
          `}
          style={{
            backgroundColor:
              data.background_color ||
              'transparent',
          }}
        >
          <div
            className={
              imageFirst
                ? 'order-2 lg:order-2'
                : 'order-2 lg:order-1'
            }
          >
            {data.content && (
              <div
                className="
                  prose prose-slate max-w-none
                  text-sm sm:text-base
                  leading-relaxed
                  prose-p:mb-4
                  prose-strong:text-slate-900
                  prose-a:text-[#1A669A]
                  prose-a:underline
                "
                dangerouslySetInnerHTML={{
                  __html: data.content,
                }}
              />
            )}
          </div>

          {imageUrl && (
            <div
              className={`
                relative
                min-h-[260px]
                sm:min-h-[320px]
                overflow-hidden
                bg-slate-100
                ${getImageRadiusClass(
                  data.image_radius,
                )}
                ${
                  imageFirst
                    ? 'order-1 lg:order-1'
                    : 'order-1 lg:order-2'
                }
              `}
            >
              <Image
                src={imageUrl}
                alt={data.image_alt || ''}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          )}

          {data.caption && (
            <p className="text-xs text-slate-500 lg:col-span-2">
              {data.caption}
            </p>
          )}
        </div>
      );
    }

    case 'image': {
      const imageUrl = getMediaUrl(
        data.image,
      );

      if (!imageUrl) {
        return null;
      }

      const widthClass =
        data.width === 'small'
          ? 'max-w-md'
          : data.width === 'medium'
            ? 'max-w-2xl'
            : data.width === 'large'
              ? 'max-w-4xl'
              : 'max-w-none';

      const alignmentClass =
        data.alignment === 'left'
          ? 'mr-auto'
          : data.alignment === 'right'
            ? 'ml-auto'
            : 'mx-auto';

      const aspectClass =
        data.aspect_ratio === 'square'
          ? 'aspect-square'
          : data.aspect_ratio ===
              'landscape'
            ? 'aspect-[4/3]'
            : data.aspect_ratio ===
                'wide'
              ? 'aspect-video'
              : 'aspect-[16/10]';

      return (
        <figure
          className={`${widthClass} ${alignmentClass} w-full`}
        >
          <div
            className={`relative ${aspectClass} overflow-hidden rounded-xl bg-slate-100`}
          >
            <Image
              src={imageUrl}
              alt={data.alt || ''}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>

          {data.caption && (
            <figcaption className="mt-2 text-sm text-slate-500">
              {data.caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case 'bullets': {
      const items = Array.isArray(
        data.items,
      )
        ? data.items
        : [];

      if (items.length === 0) {
        return null;
      }

      const gridClass =
        String(data.columns) === '3'
          ? 'md:grid-cols-3'
          : String(data.columns) === '2'
            ? 'md:grid-cols-2'
            : 'grid-cols-1';

      return (
        <div
          className={`grid ${gridClass} gap-4`}
        >
          {items.map(
            (
              item: any,
              index: number,
            ) => (
              <div
                key={index}
                className="flex items-start gap-3"
              >
                <div className="mt-0.5 shrink-0">
                  <DynamicBulletIcon
                    icon={
                      item.icon ||
                      'check'
                    }
                    color={
                      data.icon_color ||
                      '#1A669A'
                    }
                  />
                </div>

                <div className="min-w-0">
                  {item.title && (
                    <h3 className="mb-1 font-bold text-slate-900">
                      {item.title}
                    </h3>
                  )}

                  {item.text && (
                    <p className="text-sm sm:text-base leading-relaxed text-slate-600">
                      {item.text}
                    </p>
                  )}
                </div>
              </div>
            ),
          )}
        </div>
      );
    }

    case 'cards': {
      const items = Array.isArray(
        data.items,
      )
        ? data.items
        : [];

      if (items.length === 0) {
        return null;
      }

      const columns =
        String(data.columns) === '4'
          ? 'lg:grid-cols-4'
          : String(data.columns) === '2'
            ? 'md:grid-cols-2'
            : 'md:grid-cols-2 lg:grid-cols-3';

      return (
        <div
          className={`grid grid-cols-1 ${columns} gap-4`}
        >
          {items.map(
            (
              item: any,
              index: number,
            ) => {
              const cardBackground =
                item.background_color ||
                data.background_color ||
                '#F7F8FA';

              const cardImage =
                getMediaUrl(
                  item.image,
                );

              return (
                <div
                  key={index}
                  className={`
                    h-full
                    rounded-xl
                    p-5 sm:p-6
                    ${
                      data.card_style ===
                      'minimal'
                        ? ''
                        : 'border'
                    }
                  `}
                  style={{
                    backgroundColor:
                      cardBackground,
                    borderColor:
                      data.border_color ||
                      '#E2E8F0',
                    color:
                      data.text_color ||
                      '#0F172A',
                  }}
                >
                  {cardImage && (
                    <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-lg bg-slate-100">
                      <Image
                        src={
                          cardImage
                        }
                        alt={
                          item.image_alt ||
                          item.title ||
                          ''
                        }
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  )}

                  {item.icon && (
                    <div className="mb-4">
                      <DynamicBulletIcon
                        icon={
                          item.icon
                        }
                        color={
                          item.icon_color ||
                          '#1A669A'
                        }
                      />
                    </div>
                  )}

                  {item.title && (
                    <h3 className="mb-2 text-lg font-extrabold">
                      {item.title}
                    </h3>
                  )}

                  {item.description && (
                    <p className="text-sm leading-relaxed opacity-75">
                      {
                        item.description
                      }
                    </p>
                  )}

                  {item.url && (
                    <a
                      href={localizeHref(
                        item.url,
                        locale,
                      )}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#C82024]"
                    >
                      {item.link_label ||
                        'Lees meer'}

                      <ArrowRightIcon />
                    </a>
                  )}
                </div>
              );
            },
          )}
        </div>
      );
    }

    case 'steps': {
      const items = Array.isArray(
        data.items,
      )
        ? data.items
        : [];

      if (items.length === 0) {
        return null;
      }

      if (
        data.layout === 'horizontal' ||
        data.layout === 'cards'
      ) {
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {items.map(
              (
                item: any,
                index: number,
              ) => {
                const stepImage =
                  getMediaUrl(
                    item.image,
                  );

                return (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-200 bg-white p-5"
                  >
                    <div
                      className="mb-4 text-3xl font-black"
                      style={{
                        color:
                          data.accent_color ||
                          '#1A669A',
                      }}
                    >
                      {item.number ||
                        String(
                          index + 1,
                        ).padStart(
                          2,
                          '0',
                        )}
                    </div>

                    <h3 className="mb-2 text-lg font-extrabold text-slate-900">
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="text-sm leading-relaxed text-slate-600">
                        {
                          item.description
                        }
                      </p>
                    )}

                    {stepImage && (
                      <div className="relative mt-5 aspect-[16/10] overflow-hidden rounded-lg bg-slate-100">
                        <Image
                          src={
                            stepImage
                          }
                          alt={
                            item.image_alt ||
                            item.title ||
                            ''
                          }
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                );
              },
            )}
          </div>
        );
      }

      return (
        <div className="flex flex-col">
          {items.map(
            (
              item: any,
              index: number,
            ) => (
              <div
                key={index}
                className="relative flex gap-5 pb-8 last:pb-0"
              >
                {index !==
                  items.length - 1 && (
                  <div
                    className="absolute left-[22px] top-12 bottom-0 w-px"
                    style={{
                      backgroundColor:
                        data.accent_color ||
                        '#1A669A',
                      opacity: 0.25,
                    }}
                  />
                )}

                <div
                  className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-black text-white"
                  style={{
                    backgroundColor:
                      data.accent_color ||
                      '#1A669A',
                  }}
                >
                  {item.number ||
                    index + 1}
                </div>

                <div className="min-w-0 pt-1.5">
                  <h3 className="font-extrabold text-slate-900">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="mt-1.5 text-sm sm:text-base leading-relaxed text-slate-600">
                      {
                        item.description
                      }
                    </p>
                  )}
                </div>
              </div>
            ),
          )}
        </div>
      );
    }

    case 'buttons': {
      const items = Array.isArray(
        data.items,
      )
        ? data.items
        : [];

      if (items.length === 0) {
        return null;
      }

      const alignment =
        data.alignment === 'center'
          ? 'justify-center'
          : data.alignment ===
              'right'
            ? 'justify-end'
            : 'justify-start';

      return (
        <div
          className={`flex flex-wrap gap-3 ${alignment}`}
        >
          {items.map(
            (
              item: any,
              index: number,
            ) => {
              const button =
                getButtonStyle(
                  item.style,
                  item.background_color,
                  item.text_color,
                  item.border_color,
                );

              return (
                <a
                  key={index}
                  href={localizeHref(
                    item.url,
                    locale,
                  )}
                  target={
                    item.new_tab
                      ? '_blank'
                      : undefined
                  }
                  rel={
                    item.new_tab
                      ? 'noopener noreferrer'
                      : undefined
                  }
                  className={
                    button.className
                  }
                  style={
                    button.style
                  }
                >
                  {item.label}

                  {item.icon !==
                    'none' && (
                    <ArrowRightIcon />
                  )}
                </a>
              );
            },
          )}
        </div>
      );
    }

    case 'callout': {
      const button =
        getButtonStyle(
          data.button_style,
          data.button_background,
          data.button_text_color,
          data.button_background,
        );

      return (
        <div
          className="rounded-2xl border p-6 sm:p-8"
          style={{
            backgroundColor:
              data.background_color ||
              '#F1F5F9',
            color:
              data.text_color ||
              '#0F172A',
            borderColor:
              data.border_color ||
              '#CBD5E1',
          }}
        >
          {data.title && (
            <h3 className="mb-3 text-xl font-extrabold">
              {data.title}
            </h3>
          )}

          {data.content && (
            <div
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{
                __html:
                  data.content,
              }}
            />
          )}

          {data.button_label &&
            data.button_url && (
              <a
                href={localizeHref(
                  data.button_url,
                  locale,
                )}
                className={`${button.className} mt-5`}
                style={button.style}
              >
                {
                  data.button_label
                }

                <ArrowRightIcon />
              </a>
            )}
        </div>
      );
    }

    case 'table': {
      const rows = Array.isArray(
        data.rows,
      )
        ? data.rows
        : [];

      if (rows.length === 0) {
        return null;
      }

      return (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          {data.caption && (
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-4 font-extrabold text-slate-900">
              {data.caption}
            </div>
          )}

          <table className="w-full text-left text-sm">
            <tbody>
              {rows.map(
                (
                  row: any,
                  index: number,
                ) => (
                  <tr
                    key={index}
                    className="border-b last:border-b-0"
                    style={{
                      borderColor:
                        data.border_color ||
                        '#E2E8F0',
                    }}
                  >
                    <th className="px-5 py-4 font-bold text-slate-900">
                      {row.label}
                    </th>

                    <td className="px-5 py-4 text-slate-600">
                      {row.value}
                    </td>

                    {row.extra && (
                      <td className="px-5 py-4 text-slate-500">
                        {
                          row.extra
                        }
                      </td>
                    )}
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      );
    }

    case 'document': {
      const uploadedFile =
        getMediaUrl(data.file);

      const documentUrl =
        data.url || uploadedFile;

      const previewImage =
        getMediaUrl(
          data.preview_image,
        );

      if (
        !data.title &&
        !documentUrl
      ) {
        return null;
      }

      return (
        <div
          className="flex flex-col sm:flex-row gap-5 rounded-2xl border border-slate-200 p-5 sm:p-6"
          style={{
            backgroundColor:
              data.background_color ||
              '#F7F8FA',
            color:
              data.text_color ||
              '#0F172A',
          }}
        >
          {previewImage && (
            <div className="relative h-40 w-full sm:w-32 shrink-0 overflow-hidden rounded-lg bg-white">
              <Image
                src={previewImage}
                alt={
                  data.title ||
                  'Document'
                }
                fill
                sizes="128px"
                className="object-cover"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            {data.title && (
              <h3 className="text-lg font-extrabold">
                {data.title}
              </h3>
            )}

            {(data.document_number ||
              data.issuer) && (
              <p className="mt-1 text-sm opacity-60">
                {[
                  data.document_number,
                  data.issuer,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            )}

            {data.description && (
              <p className="mt-3 text-sm leading-relaxed opacity-75">
                {
                  data.description
                }
              </p>
            )}

            {documentUrl && (
              <a
                href={documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 font-bold"
                style={{
                  color:
                    data.accent_color ||
                    '#1A669A',
                }}
              >
                {data.button_label ||
                  'Bekijk document'}

                <ArrowRightIcon />
              </a>
            )}
          </div>
        </div>
      );
    }

    case 'projects':
      return (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
          Realisaties-blok is
          geconfigureerd. De
          automatische projectdata moet
          nog gekoppeld worden.
        </div>
      );

    case 'faq':
      return (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
          FAQ-blok is geconfigureerd.
          De automatische FAQ-data moet
          nog gekoppeld worden.
        </div>
      );

    case 'divider':
      return data.style ===
        'line' ? (
        <div
          className={
            data.size === 'large'
              ? 'my-12'
              : data.size ===
                  'small'
                ? 'my-4'
                : 'my-8'
          }
        >
          <div
            className="h-px w-full"
            style={{
              backgroundColor:
                data.color ||
                '#E2E8F0',
            }}
          />
        </div>
      ) : (
        <div
          className={
            data.size === 'large'
              ? 'h-16'
              : data.size ===
                  'small'
                ? 'h-6'
                : 'h-10'
          }
        />
      );

    default:
      return null;
  }
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { locale, slug } =
    await params;

  const [tBreadcrumb, service] =
    await Promise.all([
      getTranslations({
        locale,
        namespace:
          'Breadcrumbs',
      }),
      getServiceBySlug(
        slug,
        locale,
      ),
    ]);

  if (!service) {
    notFound();
  }

  const sections: ServiceSection[] = (
    service.sections || []
  ).filter(
    (
      section: ServiceSection,
    ) =>
      section.is_active !==
      false,
  );

  const tocItems = sections
    .filter(
      (section) =>
        section.show_in_menu !==
          false &&
        section.nav_title &&
        section.slug,
    )
    .map((section) => ({
      nav_title:
        section.nav_title!,
      slug: section.slug!,
    }));

  const breadcrumbs = [
    {
      label:
        tBreadcrumb('home'),
      href: '/',
    },
    {
      label:
        tBreadcrumb(
          'services',
        ),
      href: '/diensten',
    },
    {
      label: service.name,
    },
  ];

  const heroImage =
    getMediaUrl(
      service.hero_image,
    ) ||
    getMediaUrl(
      service.thumbnail,
    ) ||
    '/images/placeholder.jpg';

  return (
    <main className="min-h-screen bg-white pt-8 sm:pt-12 lg:pt-16 pb-20 sm:pb-24 w-full overflow-x-clip">
       <ServiceAlternateLinks
      alternateSlugs={service.alternate_slugs}
    />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-w-0">
        <div className="mb-6 sm:mb-8 overflow-x-auto py-1">
          <Breadcrumbs
            items={breadcrumbs}
          />
        </div>

        <header className="flex flex-col lg:flex-row gap-8 sm:gap-10 lg:gap-14 items-start mb-14 sm:mb-32 w-full min-w-0">
          <div className="w-full lg:w-[35%] shrink-0 flex flex-col gap-3 sm:gap-4 min-w-0">
            {service.eyebrow && (
              <span className="text-xs sm:text-sm md:text-base font-extrabold tracking-wider text-[#1A669A] uppercase [overflow-wrap:anywhere]">
                {
                  service.eyebrow
                }
              </span>
            )}

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight [overflow-wrap:anywhere]">
              {service.hero_title ||
                service.name}
            </h1>

            {service.intro_text && (
              <div
                className="text-sm sm:text-base text-slate-600 leading-relaxed [overflow-wrap:anywhere] [&>p]:mb-4 last:[&>p]:mb-0"
                dangerouslySetInnerHTML={{
                  __html:
                    formatIntroParagraphs(
                      service.intro_text,
                    ),
                }}
              />
            )}
          </div>

          <div className="w-full lg:flex-1 min-w-0">
            <div className="relative w-full h-[240px] sm:h-[380px] md:h-[440px] lg:h-[500px] overflow-hidden bg-slate-100 rounded-lg lg:rounded-none">
              <Image
                src={heroImage}
                alt={
                  service.hero_title ||
                  service.name
                }
                fill
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 65vw"
                className="object-cover"
              />
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start w-full min-w-0">
          <aside className="hidden lg:block lg:w-[35%] shrink-0 self-stretch min-w-0">
            <ServiceToc
              items={tocItems}
            />
          </aside>

          <section className="w-full lg:flex-1 min-w-0 flex flex-col">
            {sections.length >
            0 ? (
              sections.map(
                (
                  section,
                  sectionIndex,
                ) => {
                  const contentWidth =
                    getContentWidthClass(
                      section.content_width,
                    );

                  return (
                    <article
                      key={
                        section.slug ||
                        `${section.heading}-${sectionIndex}`
                      }
                      id={
                        section.slug
                      }
                      className="scroll-mt-28 sm:scroll-mt-32 w-full min-w-0 border-b border-slate-100 last:border-b-0"
                      style={{
                        backgroundColor:
                          section.background_color ||
                          '#FFFFFF',
                        color:
                          section.text_color ||
                          '#0F172A',
                      }}
                    >
                      <div
                        className={`py-10 sm:py-14 ${contentWidth}`}
                      >
                        {section.heading && (
                          <h2
                            className="mb-6 text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-snug [overflow-wrap:anywhere]"
                            style={{
                              color:
                                section.text_color ||
                                '#0F172A',
                            }}
                          >
                            {
                              section.heading
                            }
                          </h2>
                        )}

                        {section.body && (
                          <div
                            className="
                              prose prose-slate max-w-none
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
                            "
                            dangerouslySetInnerHTML={{
                              __html:
                                section.body,
                            }}
                          />
                        )}

                        {section.bullet_points &&
                          section
                            .bullet_points
                            .length >
                            0 && (
                            <ul className="mb-7 flex flex-col gap-3">
                              {section.bullet_points.map(
                                (
                                  bp,
                                  idx,
                                ) => (
                                  <li
                                    key={
                                      idx
                                    }
                                    className="flex items-start gap-3"
                                  >
                                    <DynamicBulletIcon
                                      icon={
                                        bp.icon ||
                                        'check'
                                      }
                                      color={
                                        bp.color ||
                                        '#1A669A'
                                      }
                                    />

                                    <span className="flex-1 text-sm sm:text-base font-medium leading-relaxed text-slate-700">
                                      {
                                        bp.text
                                      }
                                    </span>
                                  </li>
                                ),
                              )}
                            </ul>
                          )}

                        {section.images &&
                          section
                            .images
                            .length >
                            0 && (
                            <div className="mb-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {section.images.map(
                                (
                                  imgUrl,
                                  idx,
                                ) => {
                                  const resolvedImage =
                                    getMediaUrl(
                                      imgUrl,
                                    );

                                  if (
                                    !resolvedImage
                                  ) {
                                    return null;
                                  }

                                  return (
                                    <div
                                      key={
                                        idx
                                      }
                                      className="relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-100"
                                    >
                                      <Image
                                        src={
                                          resolvedImage
                                        }
                                        alt={`${section.heading || service.name} - ${idx + 1}`}
                                        fill
                                        sizes="(max-width: 640px) 100vw, 50vw"
                                        className="object-cover"
                                      />
                                    </div>
                                  );
                                },
                              )}
                            </div>
                          )}

                        {section.content_blocks &&
                          section
                            .content_blocks
                            .length >
                            0 && (
                            <div className="flex flex-col gap-7 sm:gap-9">
                              {section.content_blocks.map(
                                (
                                  block,
                                  blockIndex,
                                ) => (
                                  <ContentBlockRenderer
                                    key={`${block.type}-${blockIndex}`}
                                    block={
                                      block
                                    }
                                    locale={
                                      locale
                                    }
                                  />
                                ),
                              )}
                            </div>
                          )}
                      </div>
                    </article>
                  );
                },
              )
            ) : (
              <p className="text-slate-500 font-medium text-sm sm:text-base">
                Geen inhoud
                beschikbaar.
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}