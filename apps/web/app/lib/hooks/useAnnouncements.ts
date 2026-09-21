import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/lib/api";

export function useAnnouncements() {
  return useQuery({
    queryKey: ["announcements"],
    queryFn: () => api.getAnnouncements(),
  });
}