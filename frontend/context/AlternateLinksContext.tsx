'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type AlternateSlugs = Record<string, string>;

interface AlternateLinksContextType {
  alternateSlugs: AlternateSlugs | null;
  setAlternateSlugs: (slugs: AlternateSlugs | null) => void;
}

const AlternateLinksContext = createContext<AlternateLinksContextType>({
  alternateSlugs: null,
  setAlternateSlugs: () => {},
});

export function AlternateLinksProvider({ children }: { children: ReactNode }) {
  const [alternateSlugs, setAlternateSlugs] = useState<AlternateSlugs | null>(null);

  return (
    <AlternateLinksContext.Provider value={{ alternateSlugs, setAlternateSlugs }}>
      {children}
    </AlternateLinksContext.Provider>
  );
}

export function useAlternateLinks() {
  return useContext(AlternateLinksContext);
}