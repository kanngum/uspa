const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('uspa_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('uspa_token', token);
    } else {
      localStorage.removeItem('uspa_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Faculties
  async getFaculties() {
    return this.request<{ success: boolean; data: any[] }>('/faculties');
  }

  async getFaculty(idOrCode: string) {
    return this.request<{ success: boolean; data: any }>(`/faculties/${idOrCode}`);
  }

  async getFacultyByCode(code: string) {
    return this.request<{ success: boolean; data: any }>(`/faculties/code/${code}`);
  }

  // Departments
  async getDepartmentProgrammes(departmentId: string) {
    return this.request<{ success: boolean; data: any[] }>(
      `/departments/${departmentId}/programmes`,
    );
  }

  // Programmes
  async searchProgrammes(params: {
    query?: string;
    facultyId?: string;
    departmentId?: string;
    degreeType?: string;
    level?: string;
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.set(key, String(value));
      }
    });
    return this.request<{ success: boolean; data: any[]; total: number; page: number; limit: number; totalPages: number }>(
      `/programmes?${searchParams.toString()}`,
    );
  }

  async getProgramme(id: string) {
    return this.request<{ success: boolean; data: any }>(`/programmes/${id}`);
  }

  async getProgrammeByCode(code: string) {
    return this.request<{ success: boolean; data: any }>(`/programmes/code/${code}`);
  }

  async getFeaturedProgrammes() {
    return this.request<{ success: boolean; data: any[] }>('/programmes/featured');
  }

  // Auth - Register
  async register(input: { email: string; password: string; firstName: string; lastName: string }) {
    return this.request<{ success: boolean; data: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  // Autocomplete
  async getAutoComplete(query: string) {
    return this.request<{ success: boolean; data: any[] }>(
      `/programmes/autocomplete?q=${encodeURIComponent(query)}`,
    );
  }

  // Subjects
  async getSubjects(params?: { page?: number; limit?: number; search?: string; level?: string }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.set(key, String(value));
        }
      });
    }
    return this.request<{ success: boolean; data: any[]; total: number; page: number; limit: number; totalPages: number }>(
      `/subjects?${searchParams.toString()}`,
    );
  }

  async getSubjectsByLevel(level: string) {
    return this.request<{ success: boolean; data: any[] }>(`/subjects/by-level/${level}`);
  }

  // Eligibility
  async checkEligibility(input: {
    oLevelSubjects: Array<{ subjectId: string; grade: string }>;
    aLevelSubjects?: Array<{ subjectId: string; grade: string }>;
    programmeId?: string;
    programmeCode?: string;
  }) {
    return this.request<{ success: boolean; data: any }>('/eligibility/check', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  // Recommendations
  async getSimilarProgrammes(programmeId: string, limit?: number) {
    const params = limit ? `?limit=${limit}` : '';
    return this.request<{ success: boolean; data: any[] }>(
      `/recommendations/similar/${programmeId}${params}`,
    );
  }

  async getAlternatives(missingSubjectIds: string[], limit?: number) {
    const searchParams = new URLSearchParams();
    searchParams.set('missingSubjectIds', missingSubjectIds.join(','));
    if (limit) searchParams.set('limit', String(limit));
    return this.request<{ success: boolean; data: any[] }>(
      `/recommendations/alternatives?${searchParams.toString()}`,
    );
  }

  async getCareerRecommendations(careerName: string, limit?: number) {
    const searchParams = new URLSearchParams();
    searchParams.set('q', careerName);
    if (limit) searchParams.set('limit', String(limit));
    return this.request<{ success: boolean; data: any[] }>(
      `/recommendations/career?${searchParams.toString()}`,
    );
  }

  async getSubjectRecommendations(subjectIds: string[], limit?: number) {
    const searchParams = new URLSearchParams();
    searchParams.set('subjectIds', subjectIds.join(','));
    if (limit) searchParams.set('limit', String(limit));
    return this.request<{ success: boolean; data: any[] }>(
      `/recommendations/subjects?${searchParams.toString()}`,
    );
  }

  // AI Advisor
  async askAi(input: { query: string; subjects?: string[]; userId?: string }) {
    return this.request<{ success: boolean; data: any }>('/ai/ask', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  // Auth
  async login(input: { email: string; password: string }) {
    return this.request<{ success: boolean; data: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async getProfile() {
    return this.request<{ success: boolean; data: any }>('/auth/profile');
  }

  // Favourites
  async getFavourites() {
    return this.request<{ success: boolean; data: any[] }>('/favourites');
  }

  async addFavourite(programmeId: string) {
    return this.request<{ success: boolean; data: any }>(`/favourites/${programmeId}`, {
      method: 'POST',
    });
  }

  async removeFavourite(programmeId: string) {
    return this.request<{ success: boolean; data: any }>(`/favourites/${programmeId}`, {
      method: 'DELETE',
    });
  }

  async checkFavourite(programmeId: string) {
    return this.request<{ success: boolean; data: { isFavourite: boolean } }>(
      `/favourites/check/${programmeId}`,
    );
  }

  // Compare
  async compareProgrammes(programmeIds: string[]) {
    return this.request<{ success: boolean; data: any[] }>('/compare', {
      method: 'POST',
      body: JSON.stringify({ programmeIds }),
    });
  }

  async getComparisonTable(programmeIds: string[]) {
    return this.request<{ success: boolean; data: { headers: string[]; rows: any[] } }>('/compare/table', {
      method: 'POST',
      body: JSON.stringify({ programmeIds }),
    });
  }

  // Admin
  async getAdminStats() {
    return this.request<{ success: boolean; data: any }>('/admin/dashboard/stats');
  }

  async getAdminProgrammes(page = 1, limit = 20, search?: string, facultyId?: string) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set('search', search);
    if (facultyId) params.set('facultyId', facultyId);
    return this.request<{ success: boolean; data: any[]; total: number; page: number; limit: number; totalPages: number }>(
      `/admin/programmes?${params.toString()}`,
    );
  }

  async createAdminProgramme(input: any) {
    return this.request<{ success: boolean; data: any }>('/admin/programmes', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateAdminProgramme(id: string, input: any) {
    return this.request<{ success: boolean; data: any }>(`/admin/programmes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  }

  async deleteAdminProgramme(id: string) {
    return this.request<{ success: boolean; data: any }>(`/admin/programmes/${id}`, {
      method: 'DELETE',
    });
  }

  async getAdminUsers(page = 1, limit = 20, search?: string) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set('search', search);
    return this.request<{ success: boolean; data: any[]; total: number; page: number; limit: number; totalPages: number }>(
      `/admin/users?${params.toString()}`,
    );
  }

  async updateUserRole(id: string, role: string) {
    return this.request<{ success: boolean; data: any }>(`/admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }

  async toggleUserActive(id: string) {
    return this.request<{ success: boolean; data: any }>(`/admin/users/${id}/toggle-active`, {
      method: 'PATCH',
    });
  }

  // Admin - Subjects
  async getAdminSubjects(page = 1, limit = 50, search?: string, level?: string) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set('search', search);
    if (level) params.set('level', level);
    return this.request<{ success: boolean; data: any[]; total: number; page: number; limit: number; totalPages: number }>(
      `/admin/subjects?${params.toString()}`,
    );
  }

  async createAdminSubject(input: { name: string; code?: string; level: string }) {
    return this.request<{ success: boolean; data: any }>('/admin/subjects', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateAdminSubject(id: string, input: any) {
    return this.request<{ success: boolean; data: any }>(`/admin/subjects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  }

  async deleteAdminSubject(id: string) {
    return this.request<{ success: boolean; data: any }>(`/admin/subjects/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin - Faculties
  async createAdminFaculty(input: any) {
    return this.request<{ success: boolean; data: any }>('/admin/faculties', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateAdminFaculty(id: string, input: any) {
    return this.request<{ success: boolean; data: any }>(`/admin/faculties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  }

  async deleteAdminFaculty(id: string) {
    return this.request<{ success: boolean; data: any }>(`/admin/faculties/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin - Departments
  async createAdminDepartment(input: any) {
    return this.request<{ success: boolean; data: any }>('/admin/departments', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateAdminDepartment(id: string, input: any) {
    return this.request<{ success: boolean; data: any }>(`/admin/departments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  }

  async deleteAdminDepartment(id: string) {
    return this.request<{ success: boolean; data: any }>(`/admin/departments/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin - Tuition
  async getAdminTuition(page = 1, limit = 50, programmeId?: string) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (programmeId) params.set('programmeId', programmeId);
    return this.request<{ success: boolean; data: any[]; total: number; page: number; limit: number; totalPages: number }>(
      `/admin/tuition?${params.toString()}`,
    );
  }

  async createAdminTuition(input: { programmeId: string; academicYear: string; amount: number; currency?: string }) {
    return this.request<{ success: boolean; data: any }>('/admin/tuition', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateAdminTuition(id: string, input: any) {
    return this.request<{ success: boolean; data: any }>(`/admin/tuition/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  }

  async deleteAdminTuition(id: string) {
    return this.request<{ success: boolean; data: any }>(`/admin/tuition/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin - Careers
  async getAdminCareers(page = 1, limit = 50, search?: string) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set('search', search);
    return this.request<{ success: boolean; data: any[]; total: number; page: number; limit: number; totalPages: number }>(
      `/admin/careers?${params.toString()}`,
    );
  }

  async createAdminCareer(input: { name: string; description?: string }) {
    return this.request<{ success: boolean; data: any }>('/admin/careers', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateAdminCareer(id: string, input: any) {
    return this.request<{ success: boolean; data: any }>(`/admin/careers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  }

  async deleteAdminCareer(id: string) {
    return this.request<{ success: boolean; data: any }>(`/admin/careers/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin - Keywords
  async getAdminKeywords(page = 1, limit = 50, search?: string) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set('search', search);
    return this.request<{ success: boolean; data: any[]; total: number; page: number; limit: number; totalPages: number }>(
      `/admin/keywords?${params.toString()}`,
    );
  }

  async createAdminKeyword(input: { word: string }) {
    return this.request<{ success: boolean; data: any }>('/admin/keywords', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateAdminKeyword(id: string, input: any) {
    return this.request<{ success: boolean; data: any }>(`/admin/keywords/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  }

  async deleteAdminKeyword(id: string) {
    return this.request<{ success: boolean; data: any }>(`/admin/keywords/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin - Admission Rules
  async getAdminAdmissionRules(page = 1, limit = 50) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    return this.request<{ success: boolean; data: any[]; total: number; page: number; limit: number; totalPages: number }>(
      `/admin/admission-rules?${params.toString()}`,
    );
  }

  async createAdminAdmissionRule(input: { title: string; description: string; isActive?: boolean }) {
    return this.request<{ success: boolean; data: any }>('/admin/admission-rules', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateAdminAdmissionRule(id: string, input: any) {
    return this.request<{ success: boolean; data: any }>(`/admin/admission-rules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  }

  async deleteAdminAdmissionRule(id: string) {
    return this.request<{ success: boolean; data: any }>(`/admin/admission-rules/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin - Announcements
  async createAdminAnnouncement(input: { title: string; content: string }) {
    return this.request<{ success: boolean; data: any }>('/admin/announcements', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async getAdminAnnouncements(published?: boolean) {
    const params = published !== undefined ? `?published=${published}` : '';
    return this.request<{ success: boolean; data: any[] }>(`/admin/announcements${params}`);
  }

  async toggleAdminAnnouncement(id: string) {
    return this.request<{ success: boolean; data: any }>(`/admin/announcements/${id}/toggle`, {
      method: 'PATCH',
    });
  }

  async deleteAdminAnnouncement(id: string) {
    return this.request<{ success: boolean; data: any }>(`/admin/announcements/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin - Duplicates
  async getDuplicateFaculties() {
    return this.request<{ success: boolean; data: any[] }>('/admin/duplicates/faculties');
  }

  async getDuplicateProgrammes() {
    return this.request<{ success: boolean; data: any[] }>('/admin/duplicates/programmes');
  }

  async getDuplicateSubjects() {
    return this.request<{ success: boolean; data: any[] }>('/admin/duplicates/subjects');
  }

  // Admin - Import
  async importValidate(type: string, data: any[]) {
    return this.request<{ success: boolean; data: any }>('/import/validate', {
      method: 'POST',
      body: JSON.stringify({ type, data }),
    });
  }

  async importPreview(type: string, data: any[]) {
    return this.request<{ success: boolean; data: any }>('/import/preview', {
      method: 'POST',
      body: JSON.stringify({ type, data }),
    });
  }

  async importConfirm(type: string, data: any[]) {
    return this.request<{ success: boolean; data: any }>('/import/confirm', {
      method: 'POST',
      body: JSON.stringify({ type, data }),
    });
  }

  /** Upload JSON (flat array or nested structure like { academicUnits: [...] }) - auto-detects import type */
  async importUpload(data: any) {
    return this.request<{ success: boolean; data: any }>('/import/upload', {
      method: 'POST',
      body: JSON.stringify({ data }),
    });
  }

  /** Quick import: validate + confirm in one call, skips preview step */
  async importQuick(type: string, data: any) {
    const importData = Array.isArray(data) ? data : [data];
    return this.request<{ success: boolean; data: any }>('/import/quick', {
      method: 'POST',
      body: JSON.stringify({ type, data: importData }),
    });
  }

  // Admin - Programme Careers/Keywords associations
  async addProgrammeCareer(programmeId: string, careerId: string) {
    return this.request<{ success: boolean; data: any }>(`/admin/programmes/${programmeId}/careers`, {
      method: 'POST',
      body: JSON.stringify({ careerId }),
    });
  }

  async removeProgrammeCareer(programmeId: string, careerId: string) {
    return this.request<{ success: boolean; data: any }>(`/admin/programmes/${programmeId}/careers/${careerId}`, {
      method: 'DELETE',
    });
  }

  async addProgrammeKeyword(programmeId: string, keywordId: string) {
    return this.request<{ success: boolean; data: any }>(`/admin/programmes/${programmeId}/keywords`, {
      method: 'POST',
      body: JSON.stringify({ keywordId }),
    });
  }

  async removeProgrammeKeyword(programmeId: string, keywordId: string) {
    return this.request<{ success: boolean; data: any }>(`/admin/programmes/${programmeId}/keywords/${keywordId}`, {
      method: 'DELETE',
    });
  }

  // Admin - Programme Requirements
  async getProgrammeRequirements(programmeId: string) {
    return this.request<{ success: boolean; data: { programme: any; requirements: any[]; total: number } }>(
      `/programmes/${programmeId}/requirements`,
    );
  }

  async createProgrammeRequirement(programmeId: string, input: { subjectId: string; requirementType?: string; minimumGrade?: string }) {
    return this.request<{ success: boolean; data: any }>(`/programmes/${programmeId}/requirements`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateRequirement(id: string, input: { requirementType?: string; minimumGrade?: string }) {
    return this.request<{ success: boolean; data: any }>(`/requirements/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  }

  async deleteRequirement(id: string) {
    return this.request<{ success: boolean; data: any }>(`/requirements/${id}`, {
      method: 'DELETE',
    });
  }

  async bulkAddRequirements(programmeId: string, inputs: Array<{ subjectId: string; requirementType?: string; minimumGrade?: string }>) {
    return this.request<{ success: boolean; data: { created: any[]; errors: any[] } }>(`/programmes/${programmeId}/requirements/bulk`, {
      method: 'POST',
      body: JSON.stringify(inputs),
    });
  }

  // Admin - Dashboard
  async getProgrammesByFaculty() {
    return this.request<{ success: boolean; data: any[] }>('/admin/dashboard/programmes-by-faculty');
  }

  async getPopularSearches(limit = 10) {
    return this.request<{ success: boolean; data: any[] }>(`/admin/dashboard/popular-searches?limit=${limit}`);
  }

  async getRecentSearches(limit = 20) {
    return this.request<{ success: boolean; data: any[] }>(`/admin/dashboard/recent-searches?limit=${limit}`);
  }

  async getUserStats() {
    return this.request<{ success: boolean; data: any }>('/admin/dashboard/user-stats');
  }
}

export const api = new ApiClient(API_BASE);
