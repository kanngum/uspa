"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/lib/api";
import { useCallback } from "react";

interface LoginInput {
  email: string;
  password: string;
}

export function useAuth() {
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["auth", "profile"],
    queryFn: () => api.getProfile(),
    retry: false,
    staleTime: 5 * 60 * 1000,
    enabled: !!api.getToken(),
  });

  const isAuthenticated = !!profile && !isError;

  const loginMutation = useMutation({
    mutationFn: (input: LoginInput) => api.login(input),
    onSuccess: (data: any) => {
      if (data?.data?.token) {
        api.setToken(data.data.token);
      }
      queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
    },
  });

  const logout = useCallback(() => {
    api.setToken(null);
    queryClient.setQueryData(["auth", "profile"], null);
    queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
  }, [queryClient]);

  return {
    profile: profile?.data,
    isAuthenticated,
    isLoading,
    login: loginMutation,
    logout,
  };
}

