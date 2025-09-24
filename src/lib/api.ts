// API Configuration
const API_BASE_URL = 'http://unops-api-dudw4t-af60f1-31-97-222-225.traefik.me';

// Token management - uses localStorage for persistence
const TOKEN_STORAGE_KEY = 'auth_token';
const NAME_STORAGE_KEY = 'auth_name';
const EMAIL_STORAGE_KEY = 'auth_email';
const ROLE_STORAGE_KEY = 'auth_role';

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null; // SSR safety
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

export const getAuthName = (): string | null => {
  if (typeof window === 'undefined') return null; // SSR safety
  return localStorage.getItem(NAME_STORAGE_KEY);
};

export const getAuthEmail = (): string | null => {
  if (typeof window === 'undefined') return null; // SSR safety
  return localStorage.getItem(EMAIL_STORAGE_KEY);
};

export const getAuthRole = (): string | null => {
  if (typeof window === 'undefined') return null; // SSR safety
  return localStorage.getItem(ROLE_STORAGE_KEY);
};

export const setAuthToken = ({
  token,
  name,
  role,
  email,
}: {
  token: string;
  name: string;
  role: string;
  email: string;
}): void => {
  if (typeof window === 'undefined') return; // SSR safety
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  localStorage.setItem(NAME_STORAGE_KEY, name);
  localStorage.setItem(EMAIL_STORAGE_KEY, email);
  localStorage.setItem(ROLE_STORAGE_KEY, role);
  // Dispatch custom event for auth state changes
  window.dispatchEvent(new CustomEvent('auth-login'));
};

export const removeAuthToken = (): void => {
  if (typeof window === 'undefined') return; // SSR safety
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(NAME_STORAGE_KEY);
  localStorage.removeItem(ROLE_STORAGE_KEY);
  localStorage.removeItem(EMAIL_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('auth-logout'));
};

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
        // Remove invalid token and redirect to login
        // removeAuthToken();
        // if (typeof window !== 'undefined') {
        // window.location.href = '/login';
        // }
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

// Login credentials interface
interface LoginCredentials {
  email: string;
  password: string;
}

// Login response interface
interface LoginResponse {
  status: boolean;
  message: string;
  data: {
    authorization: string;
    role: string;
    name: string;
  };
}

// UserResponse interface removed - not needed for simplified auth

// Login function
export const login = async (email: string, password: string): Promise<void> => {
  const credentials: LoginCredentials = { email, password };

  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Login failed');
    }

    const data: LoginResponse = await response.json();

    if (!data.status || !data.data.authorization) {
      throw new Error(data.message || 'Login failed - no token received');
    }

    // Store token and trigger auth event

    const cleanToken = data.data.authorization.split(' ')[1];
    setAuthToken({
      token: cleanToken,
      name: data.data.name,
      role: data.data.role,
      email: email,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error occurred during login');
  }
};

// Logout function
export const logout = (): void => {
  removeAuthToken();
};

// Auth API is no longer needed - we handle 401s globally in the apiClient

// getAuthToken is already exported above
