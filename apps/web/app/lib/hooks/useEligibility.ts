"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/app/lib/api";

interface EligibilityInput {
  oLevelSubjects: Array<{ name: string; grade: string }>;
  aLevelSubjects: Array<{ name: string; grade: string }>;
  programmeId?: string;
}

export function useCheckEligibility() {
  return useMutation({
    mutationFn: (input: EligibilityInput) => api.checkEligibility(input),
  });
}

