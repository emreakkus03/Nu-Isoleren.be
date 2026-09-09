'use client';

import { useEffect } from 'react';
import { useAlternateLinks } from '@/context/AlternateLinksContext';

export default function ProjectSlugSync({ slugs }: { slugs?: Record<string, string> }) {
  const { setAlternateSlugs } = useAlternateLinks();

  useEffect(() => {
    if (slugs) {
      setAlternateSlugs(slugs);
    }
    return () => {
      setAlternateSlugs(null);
    };
  }, [slugs, setAlternateSlugs]);

  return null;
}