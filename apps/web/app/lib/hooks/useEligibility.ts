"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/app/lib/api";

interface SubjectGrade {
  subjectId: string;
  grade: string;
}

interface SubjectGradeByName {
  name: string;
  grade: string;
}

interface EligibilityInput {
  oLevelSubjects: SubjectGrade[];
  aLevelSubjects?: SubjectGrade[];
  programmeId?: string;
  programmeCode?: string;
  level?: string;
}

interface UgDegreeInfo {
  degreeName: string;
  institution: string;
  graduationYear: string;
  classification: string;
  degreeLabel?: string;
  previousProgrammeId?: string;
}

function transformResults(rawResults: any[]): {
  status: string;
  summary: string;
  eligible: any[];
  conditionallyEligible: any[];
  notEligible: any[];
} {
  const eligible: any[] = [];
  const conditionallyEligible: any[] = [];
  const notEligible: any[] = [];
  let status = 'NOT_ELIGIBLE';

  (rawResults || []).forEach((r: any) => {
    const item = {
      id: r.programmeId,
      name: r.programmeName,
      code: r.programmeCode,
      level: r.programmeLevel,
      matchScore: r.status === 'ELIGIBLE' ? 90 : r.status === 'CONDITIONALLY_ELIGIBLE' ? 60 : 30,
      missingRequirements: r.missingRequirements || [],
      satisfiedRequirements: r.satisfiedRequirements || [],
    };

    if (r.status === 'ELIGIBLE') {
      eligible.push(item);
      if (status === 'NOT_ELIGIBLE') status = 'ELIGIBLE';
    } else if (r.status === 'CONDITIONALLY_ELIGIBLE') {
      conditionallyEligible.push(item);
      if (status !== 'ELIGIBLE') status = 'CONDITIONALLY_ELIGIBLE';
    } else {
      notEligible.push(item);
    }
  });

  return {
    status,
    summary: `Found ${eligible.length} eligible, ${conditionallyEligible.length} conditionally eligible, and ${notEligible.length} not eligible programmes.`,
    eligible,
    conditionallyEligible,
    notEligible,
  };
}

export function useCheckEligibility() {
  return useMutation({
    mutationFn: async (input: { oLevelSubjects: SubjectGradeByName[]; aLevelSubjects?: SubjectGradeByName[]; programmeId?: string; programmeCode?: string; level?: string; ugDegree?: UgDegreeInfo }) => {
      // For postgraduate level checks, skip subject resolution and use degree info
      if (input.ugDegree) {
        const payload: EligibilityInput = {
          oLevelSubjects: [],
          aLevelSubjects: [],
          programmeId: input.programmeId,
          programmeCode: input.programmeCode,
          level: input.level,
        };

        const response: any = await api.checkEligibility(payload);
        const rawResults = response?.data || [];
        return transformResults(rawResults);
      }

      // Resolve subject names to IDs
      const allSubjects = [...input.oLevelSubjects, ...(input.aLevelSubjects || [])];
      const uniqueNames = [...new Set(allSubjects.map((s) => s.name.trim().toLowerCase()))];

      // Fetch subjects to map names to IDs
      const subjectsData = await api.getSubjects({ limit: 1000 });
      const subjects = subjectsData?.data || [];
      const nameToId = new Map(subjects.map((s: any) => [s.name.trim().toLowerCase(), s.id]));

      const mapSubject = (s: SubjectGradeByName): SubjectGrade => {
        const normalized = s.name.trim().toLowerCase();
        const subjectId = nameToId.get(normalized);
        if (!subjectId) {
          throw new Error(`Subject not found: ${s.name}`);
        }
        return { subjectId, grade: s.grade };
      };

      const payload: EligibilityInput = {
        oLevelSubjects: input.oLevelSubjects.map(mapSubject),
        aLevelSubjects: input.aLevelSubjects?.map(mapSubject),
        programmeId: input.programmeId,
        programmeCode: input.programmeCode,
        level: input.level,
      };

      const response: any = await api.checkEligibility(payload);
      const rawResults = response?.data || [];
      return transformResults(rawResults);
    },
  });
}

