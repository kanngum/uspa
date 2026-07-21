"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/app/lib/api";

export function useAskAi() {
  return useMutation({
    mutationFn: (input: { query: string; subjects?: string[] }) =>
      api.askAi(input),
  });
}

