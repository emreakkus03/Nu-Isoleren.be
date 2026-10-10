'use client';
import { useEffect } from 'react';
import { useAlternateLinks } from '@/context/AlternateLinksContext';
export default function VacancyAlternateLinks({ slugs }: { slugs: Record<string, string> }) {
  const { setAlternateSlugs } = useAlternateLinks();
  useEffect(() => { setAlternateSlugs(slugs); return () => setAlternateSlugs(null); }, [slugs, setAlternateSlugs]);
  return null;
}
