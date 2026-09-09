import Image from 'next/image';
import { Link } from '@/i18n/routing';

interface ServiceCardProps {
  href: string;
  imageSrc: string;
  imageAlt: string;
  title?: string;
  badge?: string;
  description?: string;
}

export default function ServiceCard({
  href,
  imageSrc,
  imageAlt,
  title,
  badge,
  description,
}: ServiceCardProps) {
  return (
    <Link
      href={href as never}
      className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300"
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {badge && (
        <div className="absolute left-4 top-4 z-20">
          <span className="inline-flex items-center rounded-full bg-[#1A669A] px-3 py-1.5 text-xs font-bold text-white shadow-sm backdrop-blur-sm">
            {badge}
          </span>
        </div>
      )}

      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:transition-opacity lg:duration-300 lg:group-hover:opacity-0" />

      {title && (
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 lg:p-5 flex items-center justify-between text-white lg:group-hover:opacity-0 transition-opacity duration-300">
          <h3 className="text-lg lg:text-xl font-bold tracking-tight">
            {title}
          </h3>
          <span className="text-xl font-bold transition-transform duration-300 group-hover:translate-x-1">
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