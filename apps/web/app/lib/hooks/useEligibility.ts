"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/app/lib/api";

interface SubjectGrade {
  subjectId: string;
  grade: string;
}

interface EligibilityInput {
  oLevelSubjects: SubjectGrade[];
  aLevelSubjects?: SubjectGrade[];
  programmeId?: string;
  programmeCode?: string;
}

export function useCheckEligibility() {
  return useMutation({
    mutationFn: (input: EligibilityInput) => api.checkEligibility(input),
  });
}

