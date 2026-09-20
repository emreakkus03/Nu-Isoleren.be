'use client';

import { useEffect } from 'react';

import { useAlternateLinks } from '@/context/AlternateLinksContext';

interface MaterialAlternateLinksProps {
  alternateSlugs: {
    nl: string;
    fr: string;
    en: string;
  };
}

export default function MaterialAlternateLinks({
  alternateSlugs,
}: MaterialAlternateLinksProps) {
  const { setAlternateSlugs } = useAlternateLinks();

  useEffect(() => {
    setAlternateSlugs(alternateSlugs);

    return () => {
      setAlternateSlugs(null);
    };
  }, [alternateSlugs, setAlternateSlugs]);

  return null;
}