import Image from 'next/image';

import type { Material } from '@/types/material';

interface MaterialHeroProps {
  material: Material;
}

export default function MaterialHero({
  material,
}: MaterialHeroProps) {
  return (
    <section className="w-full bg-white pb-10 md:pb-14 lg:pb-16">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
        <div className="page-header-content max-w-3xl max-md:text-center">
          {material.eyebrow && (
            <span className="text-md md:text-lg font-extrabold tracking-wider text-[#1A669A] uppercase max-md:block max-md:w-full max-md:text-center max-md:[overflow-wrap:anywhere]">
              {material.eyebrow}
            </span>
          )}

          <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-950 tracking-tight leading-[1.1] max-md:text-balance max-md:[overflow-wrap:anywhere] max-md:w-full max-md:text-center">
            {material.hero_title || material.name}
          </h1>

          {material.short_description && (
            <p className="mt-5 text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl">
              {material.short_description}
            </p>
          )}
        </div>

        {material.hero_image && (
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-100">
            <Image
              src={material.hero_image}
              alt={material.hero_title || material.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}