'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import Image from 'next/image';
import type { ServiceItem } from '@/types/service';

interface HeaderNavProps {
  services?: ServiceItem[];
}

export default function HeaderNav({ services = [] }: HeaderNavProps) {
  const t = useTranslations('Header');
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const getLinkClasses = (href: string) => {
    const active = isActive(href);
    return `transition lg:text-lg relative py-1 ${
      active
        ? 'text-[#C82024] font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#C82024] after:rounded-full'
        : 'text-gray-900 hover:text-[#C82024]'
    }`;
  };

  return (
    <nav className="hidden lg:flex justify-center items-center gap-8 font-medium text-gray-900 shrink-0 px-4">
      <div className="relative group py-2">
        <Link
          href="/services"
          className={`flex items-center gap-1.5 ${getLinkClasses('/services')}`}
        >
          <span>{t('mainbar.services')}</span>
          <Image
            src="/icons/red-arrow-down.svg"
            alt="Arrow"
            width={16}
            height={16}
            className="transition-transform duration-200 group-hover:rotate-180"
          />
        </Link>

        <div className="absolute top-full -left-20 pt-3 w-[680px] opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 ease-out z-50">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-5 overflow-hidden">
            <div className="grid grid-cols-2 gap-2">
              {services.map((service) => (
                <Link
                  key={service.id}
                  href={{
                    pathname: '/services/[slug]',
                    params: { slug: service.slug },
                  }}
                  className="group/item flex items-start gap-3.5 p-3 rounded-2xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100"
                >
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200/60">
                    {service.thumbnail ? (
                      <Image
                        src={service.thumbnail}
                        alt={service.name}
                        fill
                        sizes="56px"
                        className="object-cover group-hover/item:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-200" />
                    )}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 group-hover/item:text-[#C82024] transition truncate">
                        {service.name}
                      </span>
                    </div>

                    {service.short_description && (
                      <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                        {service.short_description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between px-2">
              <Link
                href="/services"
                className="text-sm font-bold text-slate-800 hover:text-[#C82024] flex items-center gap-1.5 transition"
              >
                <span>{t('mainbar.allServices') || 'Alle diensten bekijken'}</span>
                <svg className="w-4 h-4 text-[#C82024]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <span className="text-xs text-slate-400 font-medium">
                Erkend installateur met <span className="text-[#C82024] font-bold">ATG-certificaat</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <Link
        href="/projects"
        className={getLinkClasses('/projects')}
      >
        {t('mainbar.projects')}
      </Link>

      <Link
        href="/"
        className={getLinkClasses('/pricing')}
      >
        {t('mainbar.pricing')}
      </Link>

      <Link
        href="/"
        className={getLinkClasses('/knowledge')}
      >
        {t('mainbar.knowledgeBase')}
      </Link>
    </nav>
  );
}