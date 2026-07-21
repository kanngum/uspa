"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/app/lib/api";

export function useSimilarProgrammes(programmeId: string) {
  return useQuery({
    queryKey: ["recommendations", "similar", programmeId],
    queryFn: () => api.getSimilarProgrammes(programmeId),
    enabled: !!programmeId,
  });
}

export function useAlternatives() {
  return useMutation({
    mutationFn: (input: { subjects: string[]; programmeId?: string }) =>
      api.getAlternatives(input),
  });
}

