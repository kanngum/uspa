"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/lib/api";

export function useSimilarProgrammes(programmeId: string) {
  return useQuery({
    queryKey: ["recommendations", "similar", programmeId],
    queryFn: () => api.getSimilarProgrammes(programmeId),
    enabled: !!programmeId,
  });
}

export function useAlternatives(missingSubjectIds: string[], limit?: number) {
  return useQuery({
    queryKey: ["recommendations", "alternatives", missingSubjectIds, limit],
    queryFn: () => api.getAlternatives(missingSubjectIds, limit),
    enabled: missingSubjectIds.length > 0,
  });
}

