// API Configuration
const API_BASE_URL = 'http://unops-api-dudw4t-af60f1-31-97-222-225.traefik.me';

// Static Bearer Token - Replace this with your actual token
const STATIC_BEARER_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGM2ODc4ZWUxMzExNDExZmU2NDk2YjgiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzU4MzA1MjY0LCJleHAiOjE3NTgzOTE2NjR9.g0xtb1aaLxZqlGpAx60-a-pOrDVhwWkMdtn9gpUTgwY';
// Simplified token management - always returns the static token
const getAuthToken = (): string => {
  return STATIC_BEARER_TOKEN;
};

// HTTP Client optimized for TanStack Query
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = getAuthToken();
    const url = `${this.baseURL}${endpoint}`;

    // Handle FormData vs JSON content
    const isFormData = options.body instanceof FormData;
    const headers: Record<string, string> = {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers as Record<string, string>),
    };

    // Only add Content-Type for non-FormData requests
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const config: RequestInit = {
      headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Handle authentication errors
      if (response.status === 401) {
        throw new Error('Authentication failed. Please check your token.');
      }

      if (response.status === 403) {
        throw new Error(
          'Access forbidden. You do not have the required permissions.'
        );
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      // Handle empty responses (like 204 No Content)
      if (response.status === 204) {
        return {} as T;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? body : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? body : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Utility method to build query string
  buildQueryString(params: Record<string, string | number | boolean>): string {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });
    return searchParams.toString();
  }
}

export const apiClient = new ApiClient();

// Static user data - since we're using static auth
export const STATIC_USER = {
  _id: '68c6878ee1311411fe6496b8',
  name: 'Admin User',
  email: 'admin@example.com',
  role: {
    _id: 'admin-role-id',
    name: 'Admin',
    permissions: ['read', 'write', 'delete', 'admin'],
  },
};

// Simplified Auth API - returns static data
export const authApi = {
  // Get current user function for query
  getCurrentUser: async () => {
    return {
      status: true,
      message: 'User retrieved successfully',
      data: STATIC_USER,
    };
  },
};

export { getAuthToken };
