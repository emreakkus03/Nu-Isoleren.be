'use client';

import { useEffect } from 'react';
import { useAlternateLinks } from '@/context/AlternateLinksContext';

interface KnowledgeArticleAlternateLinksProps {
  alternateSlugs: {
    nl: string;
    fr: string;
    en: string;
  };
}

export default function KnowledgeArticleAlternateLinks({
  alternateSlugs,
}: KnowledgeArticleAlternateLinksProps) {
  const { setAlternateSlugs } = useAlternateLinks();

  useEffect(() => {
    setAlternateSlugs(alternateSlugs);

    return () => {
      setAlternateSlugs(null);
    };
  }, [alternateSlugs, setAlternateSlugs]);

  return null;
}