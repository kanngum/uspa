"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/app/lib/api";
import { formatEligibilitySummary } from "@/app/lib/eligibility";
import type {
  EligibilityCheckInput,
  EligibilityFormInput,
  EligibilityResults,
  EligibilityResultItem,
  EligibilityStatus,
} from "@/app/lib/types/eligibility";

type SubjectGrade = EligibilityCheckInput["oLevelSubjects"][number];

export function transformResults(rawResults: any[] | undefined): EligibilityResults {
  const eligible: EligibilityResultItem[] = [];
  const conditionallyEligible: EligibilityResultItem[] = [];
  const notEligible: EligibilityResultItem[] = [];

  (rawResults || []).forEach((result: any) => {
    const status = (result.status || "NOT_ELIGIBLE") as EligibilityStatus;
    const item: EligibilityResultItem = {
      id: result.programmeId,
      name: result.programmeName,
      code: result.programmeCode,
      level: result.programmeLevel,
      status,
      reasons: Array.isArray(result.reasons) ? result.reasons : [],
      missingRequirements: result.missingRequirements || [],
      satisfiedRequirements: result.satisfiedRequirements || [],
    };

    if (status === "ELIGIBLE") {
      eligible.push(item);
    } else if (status === "CONDITIONALLY_ELIGIBLE") {
      conditionallyEligible.push(item);
    } else {
      notEligible.push(item);
    }
  });

  const status: EligibilityStatus =
    eligible.length > 0
      ? "ELIGIBLE"
      : conditionallyEligible.length > 0
        ? "CONDITIONALLY_ELIGIBLE"
        : "NOT_ELIGIBLE";

  return {
    status,
    summary: rawResults?.length
      ? formatEligibilitySummary({
          eligible: eligible.length,
          conditional: conditionallyEligible.length,
          notEligible: notEligible.length,
        })
      : "No programme records matched the selected university and level.",
    eligible,
    conditionallyEligible,
    notEligible,
  };
}

export function useCheckEligibility() {
  return useMutation({
    mutationFn: async (input: EligibilityFormInput) => {
      if (input.ugDegree) {
        const payload: EligibilityCheckInput = {
          oLevelSubjects: [],
          aLevelSubjects: [],
          programmeId: input.programmeId,
          programmeCode: input.programmeCode,
          level: input.level,
          universityId: input.universityId,
          studentType: input.studentType || "DIRECT_ENTRY",
          ugDegree: input.ugDegree,
        };

        const response = await api.checkEligibility(payload);
        return transformResults(response?.data || []);
      }

      const allSubjects = [
        ...input.oLevelSubjects,
        ...(input.aLevelSubjects || []),
      ];
      const subjectsData = await api.getSubjects({ limit: 1000 });
      const subjects = subjectsData?.data || [];
      const nameToId = new Map(
        subjects.map((subject: any) => [subject.name.trim().toLowerCase(), subject.id]),
      );

      const mapSubject = (subject: { name: string; grade: string }): SubjectGrade => {
        const subjectId = nameToId.get(subject.name.trim().toLowerCase());
        if (!subjectId) {
          throw new Error(`Subject not found: ${subject.name}`);
        }
        return { subjectId, grade: subject.grade };
      };

      const payload: EligibilityCheckInput = {
        oLevelSubjects: input.oLevelSubjects.map(mapSubject),
        aLevelSubjects: input.aLevelSubjects?.map(mapSubject),
        programmeId: input.programmeId,
        programmeCode: input.programmeCode,
        level: input.level,
        universityId: input.universityId,
        studentType: input.studentType || "FRESHMAN",
      };

      const response = await api.checkEligibility(payload);
      return transformResults(response?.data || []);
    },
  });
}
