"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/lib/api";

interface University {
  id: string;
  name: string;
  abbreviation: string;
  website?: string;
  description?: string;
}

export function useUniversities() {
  return useQuery({
    queryKey: ["universities"],
    queryFn: async () => {
      const res = await api.getUniversities();
      return res.data as University[];
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

