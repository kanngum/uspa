"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/lib/api";

export function useFavourites() {
  const hasToken = !!api.getToken();
  return useQuery({
    queryKey: ["favourites"],
    queryFn: () => api.getFavourites(),
    enabled: hasToken,
  });
}

export function useAddFavourite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (programmeId: string) => api.addFavourite(programmeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favourites"] });
    },
  });
}

export function useRemoveFavourite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (programmeId: string) => api.removeFavourite(programmeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favourites"] });
    },
  });
}

