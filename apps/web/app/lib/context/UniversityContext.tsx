"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useUniversities } from "@/app/lib/hooks/useUniversities";

interface University {
  id: string;
  name: string;
  abbreviation: string;
  website?: string;
  description?: string;
}

interface UniversityContextType {
  selectedUniversity: University | null;
  setSelectedUniversity: (uni: University) => void;
  universities: University[];
  isLoading: boolean;
  showSelector: boolean;
  setShowSelector: (show: boolean) => void;
}

const UniversityContext = createContext<UniversityContextType | undefined>(undefined);

const STORAGE_KEY = "uspa_selected_university";

export function UniversityProvider({ children }: { children: ReactNode }) {
  const { data: universities, isLoading } = useUniversities();
  const [selectedUniversity, setSelectedUniversityState] = useState<University | null>(null);
  const [showSelector, setShowSelector] = useState(false);

  // Load stored selection on mount
  useEffect(() => {
    if (universities && universities.length > 0) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const found = universities.find((u) => u.id === parsed.id);
          if (found) {
            setSelectedUniversityState(found);
            return;
          }
        } catch (e) {
          // ignore parse error
        }
      }
      // If no stored selection, show selector
      setShowSelector(true);
    }
  }, [universities]);

  const setSelectedUniversity = useCallback((uni: University) => {
    setSelectedUniversityState(uni);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: uni.id, name: uni.name, abbreviation: uni.abbreviation }));
    setShowSelector(false);
  }, []);

  return (
    <UniversityContext.Provider
      value={{
        selectedUniversity,
        setSelectedUniversity,
        universities: universities || [],
        isLoading,
        showSelector,
        setShowSelector,
      }}
    >
      {children}
    </UniversityContext.Provider>
  );
}

export function useUniversity() {
  const ctx = useContext(UniversityContext);
  if (!ctx) {
    throw new Error("useUniversity must be used within a UniversityProvider");
  }
  return ctx;
}

