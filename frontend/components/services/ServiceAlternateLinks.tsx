'use client';

import { useEffect } from 'react';
import { useAlternateLinks } from '@/context/AlternateLinksContext';

interface ServiceAlternateLinksProps {
  alternateSlugs: Record<string, string>;
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