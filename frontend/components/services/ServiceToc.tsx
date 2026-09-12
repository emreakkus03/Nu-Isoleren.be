'use client';

import { useEffect, useState } from 'react';

interface TocItem {
  nav_title: string;
  slug: string;
}

interface ServiceTocProps {
  items: TocItem[];
}

export default function ServiceToc({ items }: ServiceTocProps) {
  const [activeSlug, setActiveSlug] = useState<string>(items[0]?.slug || '');

  useEffect(() => {
    if (items.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;

      for (let i = items.length - 1; i >= 0; i--) {
        const el = document.getElementById(items[i].slug);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSlug(items[i].slug);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  const scrollToSection = (slug: string) => {
    const el = document.getElementById(slug);
    if (!el) return;

    el.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    setActiveSlug(slug);
  };

  if (!items || items.length === 0) return null;

  return (
    <nav className="sticky top-40 inline-block pr-8 border-r border-slate-200">
      <ul className="flex flex-col gap-4">
        {items.map((item) => {
          const isActive = activeSlug === item.slug;
          return (
            <li key={item.slug} className="w-full">
              <button
                type="button"
                onClick={() => scrollToSection(item.slug)}
                className={`group flex items-center gap-3.5 w-full text-left text-base lg:text-lg transition-colors py-1 cursor-pointer ${
                  isActive
                    ? 'text-[#1A669A] font-bold'
                    : 'text-slate-400 hover:text-slate-800 font-medium'
                }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 transition-all duration-200 ${
                    isActive
                      ? 'bg-[#1A669A] scale-100 opacity-100'
                      : 'bg-transparent scale-50 opacity-0 group-hover:bg-slate-300 group-hover:opacity-100'
                  }`}
                />
                <span className="truncate">{item.nav_title}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}