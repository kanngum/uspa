"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/lib/api";

interface SearchParams {
  query?: string;
  universityId?: string;
  facultyId?: string;
  departmentId?: string;
  degreeType?: string;
  level?: string;
  minFee?: number;
  maxFee?: number;
  page?: number;
  limit?: number;
}

export function useSearchProgrammes(params: SearchParams) {
  return useQuery({
    queryKey: ["programmes", "search", params],
    queryFn: () => api.searchProgrammes(params),
    placeholderData: (prev) => prev,
  });
}

export function useProgramme(idOrCode: string) {
  return useQuery({
    queryKey: ["programme", idOrCode],
    queryFn: async () => {
      // Try by code first (programme code like BSC-CSC), fallback to ID
      try {
        return await api.getProgrammeByCode(idOrCode);
      } catch {
        return api.getProgramme(idOrCode);
      }
    },
    enabled: !!idOrCode,
  });
}

export function useAutoComplete(query: string) {
  return useQuery({
    queryKey: ["programmes", "autocomplete", query],
    queryFn: () => api.getAutoComplete(query),
    enabled: query.length >= 2,
  });
}

export function useFeaturedProgrammes(universityId?: string) {
  return useQuery({
    queryKey: ["programmes", "featured", universityId],
    queryFn: () => api.getFeaturedProgrammes(universityId),
  });
}

