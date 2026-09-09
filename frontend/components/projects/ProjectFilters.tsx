'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { ProjectFilterItem } from '@/types/project';

interface ProjectFiltersProps {
  services: ProjectFilterItem[];
  cities: ProjectFilterItem[];
  totalResults: number;
}

export default function ProjectFilters({ services, cities, totalResults }: ProjectFiltersProps) {
  const t = useTranslations('ProjectsPage');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [citySearch, setCitySearch] = useState('');

  const paramKeys = {
    service: locale === 'nl' ? 'dienst' : 'service',
    city: locale === 'nl' ? 'locatie' : locale === 'fr' ? 'localisation' : 'location',
  };

  const selectedService = searchParams.get(paramKeys.service) || '';
  const selectedCity = searchParams.get(paramKeys.city) || '';

  const filteredCities = cities.filter((c) =>
    c.name.toLowerCase().includes(citySearch.toLowerCase())
  );

  const updateFilters = (type: 'service' | 'city', value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    const key = paramKeys[type];

    if (!value || value === current.get(key)) {
      current.delete(key);
    } else {
      current.set(key, value);
    }

    current.delete('page');

    const search = current.toString();
    const query = search ? `?${search}` : '';
    // @ts-expect-error next-intl dynamic route query params
    router.push(`${pathname}${query}`);
  };

  const clearAllFilters = () => {
    setCitySearch('');
    // @ts-expect-error next-intl reset route
    router.push(pathname);
  };

  const hasActiveFilters = Boolean(selectedService || selectedCity);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col gap-6 sticky top-28">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-900 text-base">{t('filtersTitle')}</h3>
          <p className="text-xs text-slate-500 font-medium">
            {t('projectsCount', { count: totalResults })}
          </p>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-xs font-semibold text-slate-500 hover:text-[#C82024] underline transition cursor-pointer"
          >
            {t('reset')}
          </button>
        )}
      </div>

      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          {t('serviceLabel')}
        </h4>
        <div className="flex flex-col gap-2">
          {services.map((s) => {
            const isChecked = selectedService === s.slug;
            return (
              <label
                key={s.id}
                className="flex items-center gap-3 text-sm text-slate-700 hover:text-slate-900 cursor-pointer select-none py-0.5"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => updateFilters('service', s.slug)}
                  className="w-4 h-4 rounded border-slate-300 accent-[#C82024] text-[#1A669A] focus:ring-[#1A669A] cursor-pointer"
                />
                <span className={isChecked ? 'font-semibold text-slate-950' : 'font-normal'}>
                  {s.name}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {cities.length > 0 && (
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            {t('cityLabel')}
          </h4>

         {cities.length > 7 && (
  <input
    type="text"
    value={citySearch}
    onChange={(e) => setCitySearch(e.target.value)}
    placeholder={t('searchCityPlaceholder')}
    className="w-full mb-3 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1A669A] text-slate-800 placeholder-slate-400"
  />
)}

          <div className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-1">
            {filteredCities.length === 0 ? (
              <span className="text-xs text-slate-400 py-1">
                {t('noCitiesFound')}
              </span>
            ) : (
              filteredCities.map((c) => {
                const isChecked = selectedCity === c.slug;
                return (
                  <label
                    key={c.id}
                    className="flex items-center gap-3 text-sm text-slate-700 hover:text-slate-900 cursor-pointer select-none py-0.5"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => updateFilters('city', c.slug)}
                      className="w-4 h-4 rounded border-slate-300 accent-[#C82024] text-[#1A669A] focus:ring-[#1A669A] cursor-pointer"
                    />
                    <span className={isChecked ? 'font-semibold text-slate-950' : 'font-normal'}>
                      {c.name}
                    </span>
                  </label>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}