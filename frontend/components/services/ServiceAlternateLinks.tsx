'use client';

import { useEffect } from 'react';
import { useAlternateLinks } from '@/context/AlternateLinksContext';

interface ServiceAlternateLinksProps {
  alternateSlugs: {
    nl: string;
    fr: string;
    en: string;
  };
}

export default function ServiceAlternateLinks({
  alternateSlugs,
}: ServiceAlternateLinksProps) {
  const { setAlternateSlugs } = useAlternateLinks();

  useEffect(() => {
    setAlternateSlugs(alternateSlugs);

    return () => {
      setAlternateSlugs(null);
    };
  }, [alternateSlugs, setAlternateSlugs]);

  return null;
}