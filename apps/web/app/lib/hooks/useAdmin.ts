"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/lib/api";

// ==================== DASHBOARD STATS ====================

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => api.getAdminStats(),
  });
}

export function useProgrammesByFaculty() {
  return useQuery({
    queryKey: ["admin", "programmes-by-faculty"],
    queryFn: () => api.getProgrammesByFaculty(),
  });
}

export function usePopularSearches(limit = 10) {
  return useQuery({
    queryKey: ["admin", "popular-searches", limit],
    queryFn: () => api.getPopularSearches(limit),
  });
}

export function useRecentSearches(limit = 20) {
  return useQuery({
    queryKey: ["admin", "recent-searches", limit],
    queryFn: () => api.getRecentSearches(limit),
  });
}

export function useUserStats() {
  return useQuery({
    queryKey: ["admin", "user-stats"],
    queryFn: () => api.getUserStats(),
  });
}

// ==================== PROGRAMMES ====================

export function useAdminProgrammes(page = 1, limit = 20, search?: string, facultyId?: string) {
  return useQuery({
    queryKey: ["admin", "programmes", page, limit, search, facultyId],
    queryFn: () => api.getAdminProgrammes(page, limit, search, facultyId),
    placeholderData: (prev) => prev,
  });
}

export function useCreateProgramme() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: any) => api.createAdminProgramme(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "programmes"] }),
  });
}

export function useUpdateProgramme() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: any }) => api.updateAdminProgramme(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "programmes"] }),
  });
}

export function useDeleteProgramme() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteAdminProgramme(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "programmes"] }),
  });
}

export function useCatalogueReview(page = 1, limit = 20) {
  return useQuery({ queryKey: ["admin", "catalogue-review", page, limit], queryFn: () => api.getCatalogueReview(page, limit) });
}

export function useResolveCatalogueReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: any }) => api.resolveCatalogueReview(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "catalogue-review"] }),
  });
}

// ==================== SUBJECTS ====================

export function useAdminSubjects(page = 1, limit = 50, search?: string, level?: string) {
  return useQuery({
    queryKey: ["admin", "subjects", page, limit, search, level],
    queryFn: () => api.getAdminSubjects(page, limit, search, level),
    placeholderData: (prev) => prev,
  });
}

export function useAdminDepartments(page = 1, limit = 200, search?: string) {
  return useQuery({
    queryKey: ["admin", "departments", page, limit, search],
    queryFn: () => api.getAdminDepartments(page, limit, search),
    placeholderData: (prev) => prev,
  });
}

export function useCreateSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { name: string; code?: string; level: string }) => api.createAdminSubject(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "subjects"] }),
  });
}

export function useUpdateSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: any }) => api.updateAdminSubject(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "subjects"] }),
  });
}

export function useDeleteSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteAdminSubject(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "subjects"] }),
  });
}

// ==================== USERS ====================

export function useAdminUsers(page = 1, limit = 20, search?: string) {
  return useQuery({
    queryKey: ["admin", "users", page, limit, search],
    queryFn: () => api.getAdminUsers(page, limit, search),
    placeholderData: (prev) => prev,
  });
}

export function useUpdateUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => api.updateUserRole(id, role),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
}

export function useToggleUserActive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.toggleUserActive(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
}

// ==================== TUITION ====================

export function useAdminTuition(page = 1, limit = 50, programmeId?: string) {
  return useQuery({
    queryKey: ["admin", "tuition", page, limit, programmeId],
    queryFn: () => api.getAdminTuition(page, limit, programmeId),
    placeholderData: (prev) => prev,
  });
}

export function useCreateTuition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { programmeId: string; academicYear: string; amount: number; currency?: string }) =>
      api.createAdminTuition(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "tuition"] }),
  });
}

export function useUpdateTuition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: any }) => api.updateAdminTuition(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "tuition"] }),
  });
}

export function useDeleteTuition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteAdminTuition(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "tuition"] }),
  });
}

// ==================== CAREERS ====================

export function useAdminCareers(page = 1, limit = 50, search?: string) {
  return useQuery({
    queryKey: ["admin", "careers", page, limit, search],
    queryFn: () => api.getAdminCareers(page, limit, search),
    placeholderData: (prev) => prev,
  });
}

export function useCreateCareer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { name: string; description?: string }) => api.createAdminCareer(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "careers"] }),
  });
}

export function useUpdateCareer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: any }) => api.updateAdminCareer(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "careers"] }),
  });
}

export function useDeleteCareer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteAdminCareer(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "careers"] }),
  });
}

// ==================== KEYWORDS ====================

export function useAdminKeywords(page = 1, limit = 50, search?: string) {
  return useQuery({
    queryKey: ["admin", "keywords", page, limit, search],
    queryFn: () => api.getAdminKeywords(page, limit, search),
    placeholderData: (prev) => prev,
  });
}

export function useCreateKeyword() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { word: string }) => api.createAdminKeyword(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "keywords"] }),
  });
}

export function useUpdateKeyword() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: any }) => api.updateAdminKeyword(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "keywords"] }),
  });
}

export function useDeleteKeyword() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteAdminKeyword(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "keywords"] }),
  });
}

// ==================== ADMISSION RULES ====================

export function useAdminAdmissionRules(page = 1, limit = 50) {
  return useQuery({
    queryKey: ["admin", "admission-rules", page, limit],
    queryFn: () => api.getAdminAdmissionRules(page, limit),
    placeholderData: (prev) => prev,
  });
}

export function useCreateAdmissionRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { title: string; description: string; isActive?: boolean }) =>
      api.createAdminAdmissionRule(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "admission-rules"] }),
  });
}

export function useUpdateAdmissionRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: any }) => api.updateAdminAdmissionRule(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "admission-rules"] }),
  });
}

export function useDeleteAdmissionRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteAdminAdmissionRule(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "admission-rules"] }),
  });
}

// ==================== ANNOUNCEMENTS ====================

export function useAdminAnnouncements(published?: boolean) {
  return useQuery({
    queryKey: ["admin", "announcements", published],
    queryFn: () => api.getAdminAnnouncements(published),
  });
}

export function useCreateAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { title: string; content: string }) => api.createAdminAnnouncement(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "announcements"] }),
  });
}

export function useToggleAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.toggleAdminAnnouncement(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "announcements"] }),
  });
}

export function useDeleteAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteAdminAnnouncement(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "announcements"] }),
  });
}

// ==================== DUPLICATES ====================

export function useDuplicateFaculties() {
  return useQuery({
    queryKey: ["admin", "duplicates", "faculties"],
    queryFn: () => api.getDuplicateFaculties(),
  });
}

export function useDuplicateProgrammes() {
  return useQuery({
    queryKey: ["admin", "duplicates", "programmes"],
    queryFn: () => api.getDuplicateProgrammes(),
  });
}

export function useDuplicateSubjects() {
  return useQuery({
    queryKey: ["admin", "duplicates", "subjects"],
    queryFn: () => api.getDuplicateSubjects(),
  });
}

// ==================== PROGRAMME REQUIREMENTS ====================

export function useProgrammeRequirements(programmeId: string | null) {
  return useQuery({
    queryKey: ["admin", "requirements", programmeId],
    queryFn: () => api.getProgrammeRequirements(programmeId!),
    enabled: !!programmeId,
  });
}

export function useCreateProgrammeRequirement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ programmeId, input }: { programmeId: string; input: { subjectId: string; requirementType?: string; minimumGrade?: string } }) =>
      api.createProgrammeRequirement(programmeId, input),
    onSuccess: (_, variables) => qc.invalidateQueries({ queryKey: ["admin", "requirements", variables.programmeId] }),
  });
}

export function useUpdateProgrammeRequirement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: { requirementType?: string; minimumGrade?: string } }) =>
      api.updateRequirement(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "requirements"] }),
  });
}

export function useDeleteProgrammeRequirement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteRequirement(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "requirements"] }),
  });
}

// ==================== IMPORT ====================

export function useImportValidate() {
  return useMutation({
    mutationFn: ({ type, data }: { type: string; data: any[] }) => api.importValidate(type, data),
  });
}

export function useImportPreview() {
  return useMutation({
    mutationFn: ({ type, data }: { type: string; data: any[] }) => api.importPreview(type, data),
  });
}

export function useImportConfirm() {
  return useMutation({
    mutationFn: ({ type, data }: { type: string; data: any[] }) => api.importConfirm(type, data),
  });
}

