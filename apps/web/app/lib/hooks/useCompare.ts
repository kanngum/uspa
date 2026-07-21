"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/app/lib/api";

export function useCompare() {
  return useMutation({
    mutationFn: (programmeIds: string[]) => api.compareProgrammes(programmeIds),
  });
}

