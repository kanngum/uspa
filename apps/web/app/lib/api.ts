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

  async getFaculty(id: string) {
    return this.request<{ success: boolean; data: any }>(`/faculties/${id}`);
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

  async getAutoComplete(query: string) {
    return this.request<{ success: boolean; data: string[] }>(
      `/programmes/auto-complete?query=${encodeURIComponent(query)}`,
    );
  }

  // Eligibility
  async checkEligibility(input: {
    oLevelSubjects: Array<{ name: string; grade: string }>;
    aLevelSubjects: Array<{ name: string; grade: string }>;
    programmeId?: string;
  }) {
    return this.request<{ success: boolean; data: any }>('/eligibility/check', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  // Recommendations
  async getSimilarProgrammes(programmeId: string) {
    return this.request<{ success: boolean; data: any[] }>(
      `/recommendations/similar/${programmeId}`,
    );
  }

  async getAlternatives(input: { subjects: string[]; programmeId?: string }) {
    return this.request<{ success: boolean; data: any[] }>(
      '/recommendations/alternatives',
      { method: 'POST', body: JSON.stringify(input) },
    );
  }

  // AI Advisor
  async askAi(input: { query: string; subjects?: string[] }) {
    return this.request<{ success: boolean; data: any }>('/ai/ask', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  // Auth
  async register(input: { email: string; password: string; firstName: string; lastName: string }) {
    return this.request<{ success: boolean; data: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

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
    return this.request<{ success: boolean; data: any }>('/favourites', {
      method: 'POST',
      body: JSON.stringify({ programmeId }),
    });
  }

  async removeFavourite(id: string) {
    return this.request<{ success: boolean; data: any }>(`/favourites/${id}`, {
      method: 'DELETE',
    });
  }

  // Compare
  async compareProgrammes(programmeIds: string[]) {
    return this.request<{ success: boolean; data: any[] }>('/compare', {
      method: 'POST',
      body: JSON.stringify({ programmeIds }),
    });
  }

  // Admin
  async getAdminStats() {
    return this.request<{ success: boolean; data: any }>('/admin/dashboard/stats');
  }

  async getAdminProgrammes(page = 1, limit = 20) {
    return this.request<{ success: boolean; data: any[]; total: number; page: number; limit: number; totalPages: number }>(
      `/admin/programmes?page=${page}&limit=${limit}`,
    );
  }
}

export const api = new ApiClient(API_BASE);
