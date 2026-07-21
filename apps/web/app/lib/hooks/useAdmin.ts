"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/lib/api";

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => api.getAdminStats(),
  });
}

export function useAdminProgrammes(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ["admin", "programmes", page, limit],
    queryFn: () => api.getAdminProgrammes(page, limit),
    placeholderData: (prev) => prev,
  });
}

