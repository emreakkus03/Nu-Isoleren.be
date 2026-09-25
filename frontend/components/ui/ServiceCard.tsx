'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { localizedLink } from '@/lib/seo/urls';

interface ServiceCardProps {
  href: string;
  imageSrc?: string | null;
  imageAlt: string;
  title?: string;
  badge?: string;
  description?: string;
}

const FALLBACK_IMAGE = '/logo/logo.svg';

export default function ServiceCard({
  href,
  imageSrc,
  imageAlt,
  title,
  badge,
  description,
}: ServiceCardProps) {
  const initialSrc = imageSrc && imageSrc.trim() !== '' ? imageSrc : FALLBACK_IMAGE;
  const [currentSrc, setCurrentSrc] = useState(initialSrc);

  const locale = useLocale();
  return (
    <Link
      href={localizedLink(href, locale)}
      className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300"
    >
      <Image
        src={currentSrc}
        alt={imageAlt || 'Service afbeelding'}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        onError={() => {
          if (currentSrc !== FALLBACK_IMAGE) {
            setCurrentSrc(FALLBACK_IMAGE);
          }
        }}
      />

      {badge && (
        <div className="relative mx-4 mt-4 mb-16 z-20 md:absolute md:left-4 md:top-4 md:m-0">
          <span className="inline-flex max-w-full max-md:[overflow-wrap:anywhere] items-center rounded-full bg-[#1A669A] px-3 py-1.5 text-xs font-bold text-white shadow-sm backdrop-blur-sm">
            {badge}
          </span>
        </div>
      )}

      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:transition-opacity lg:duration-300 lg:group-hover:opacity-0" />

      {title && (
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 lg:p-5 flex items-center justify-between max-md:gap-3 text-white lg:group-hover:opacity-0 transition-opacity duration-300">
          <h3 className="text-lg lg:text-xl font-bold tracking-tight max-md:min-w-0 max-md:[overflow-wrap:anywhere]">
            {title}
          </h3>
          <span className="text-xl font-bold max-md:shrink-0 transition-transform duration-300 group-hover:translate-x-1">
            &rarr;
          </span>
        </div>
      )}

      {description && (
        <div className="hidden lg:flex absolute inset-0 z-30 flex-col justify-end bg-gradient-to-t from-[#C82024]/95 via-[#C82024]/85 to-transparent p-6 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <div className="flex items-center justify-between border-b border-white/20 pb-2 mb-2">
            <h3 className="text-lg font-bold">{title}</h3>
            <span className="text-xl font-bold">&rarr;</span>
          </div>
          <p className="text-xs text-white/90 leading-relaxed">
            {description}
          </p>
        </div>
      )}
    </Link>
  );
}