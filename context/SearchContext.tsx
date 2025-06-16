'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextType {
  search: string;
  setSearch: (value: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [search, setSearch] = useState('');

  return (
    <SearchContext.Provider value={{ search, setSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) throw new Error('useSearch must be used within a SearchProvider');
  return context;
};