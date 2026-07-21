"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/lib/api";

export function useFaculties() {
  return useQuery({
    queryKey: ["faculties"],
    queryFn: () => api.getFaculties(),
  });
}

export function useFaculty(id: string) {
  return useQuery({
    queryKey: ["faculty", id],
    queryFn: () => api.getFaculty(id),
    enabled: !!id,
  });
}

export function useDepartmentProgrammes(departmentId: string) {
  return useQuery({
    queryKey: ["department-programmes", departmentId],
    queryFn: () => api.getDepartmentProgrammes(departmentId),
    enabled: !!departmentId,
  });
}

