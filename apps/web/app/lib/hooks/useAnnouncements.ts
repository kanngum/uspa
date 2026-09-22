import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";

// ==================== PUBLIC NEWS ====================

export function useAnnouncements() {
  return useQuery({
    queryKey: ["announcements"],
    queryFn: () => api.getAnnouncements(),
  });
}

// ==================== ADMIN ANNOUNCEMENTS ====================

export type AnnouncementInput = {
  title: string;
  summary?: string;
  content: string;
  featuredImage?: string;
  slug?: string;
  categoryId?: string;
  programmeId?: string;
  applicationCycle?: string;
  applicationStatus?: string;
  applicationDeadline?: string;
  applicationUrl?: string;
  officialSourceUrl?: string;
  source?: string;
  sourceDocument?: string;
  lastVerified?: string;
  published?: boolean;
};

export function useAdminAnnouncements(published?: boolean) {
  return useQuery({
    queryKey: ["admin", "announcements", published],
    queryFn: () => api.getAdminAnnouncements(published),
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AnnouncementInput) =>
      api.createAdminAnnouncement(input),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "announcements"],
      });

      queryClient.invalidateQueries({
        queryKey: ["announcements"],
      });
    },
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: Partial<AnnouncementInput>;
    }) => api.updateAdminAnnouncement(id, input),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "announcements"],
      });

      queryClient.invalidateQueries({
        queryKey: ["announcements"],
      });
    },
  });
}

export function useToggleAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.toggleAdminAnnouncement(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "announcements"],
      });

      queryClient.invalidateQueries({
        queryKey: ["announcements"],
      });
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.deleteAdminAnnouncement(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "announcements"],
      });

      queryClient.invalidateQueries({
        queryKey: ["announcements"],
      });
    },
  });
}

// ==================== ANNOUNCEMENT CATEGORIES ====================

export type AnnouncementCategoryInput = {
  name: string;
  description?: string;
  slug?: string;
  displayOrder?: number;
  icon?: string;
};

export function useAnnouncementCategories() {
  return useQuery({
    queryKey: ["admin", "announcement-categories"],
    queryFn: () => api.getAnnouncementCategories(),
  });
}

export function useCreateAnnouncementCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AnnouncementCategoryInput) =>
      api.createAnnouncementCategory(input),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "announcement-categories"],
      });
    },
  });
}

export function useToggleAnnouncementCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.toggleAnnouncementCategory(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "announcement-categories"],
      });
    },
  });
}