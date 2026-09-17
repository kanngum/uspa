"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/lib/api";

export function useFaculties(universityId?: string) {
  return useQuery({
    queryKey: ["faculties", universityId],
    queryFn: () => api.getFaculties(universityId),
  });
}

export function useFaculty(idOrCode: string) {
  return useQuery({
    queryKey: ["faculty", idOrCode],
    queryFn: async () => {
      // Try by code (abbreviation) first, fallback to direct ID lookup
      try {
        return await api.getFacultyByCode(idOrCode);
      } catch {
        return api.getFaculty(idOrCode);
      }
    },
    enabled: !!idOrCode,
  });
}

export function useDepartmentProgrammes(departmentId: string) {
  return useQuery({
    queryKey: ["department-programmes", departmentId],
    queryFn: () => api.getDepartmentProgrammes(departmentId),
    enabled: !!departmentId,
  });
}

