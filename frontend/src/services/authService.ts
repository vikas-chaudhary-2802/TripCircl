import api, { setTokens, clearTokens } from './api';

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'moderator' | 'admin';
  avatar?: string | null;
  isEmailVerified: boolean;
  lastLogin?: string | null;
  createdAt: string;
}

export interface LoginResult {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface Session {
  _id: string;
  deviceInfo: string;
  ipAddress: string | null;
  expiresAt: string;
  createdAt: string;
}

const authService = {
  /**
   * Register a new user with the custom backend.
   * Note: this is separate from Supabase auth — use for custom API features.
   */
  register: async (name: string, email: string, password: string): Promise<AuthUser> => {
    const { data } = await api.post('/auth/register', { name, email, password });
    return data.data.user;
  },

  /**
   * Login and store tokens automatically.
   */
  login: async (email: string, password: string): Promise<LoginResult> => {
    const { data } = await api.post('/auth/login', { email, password });
    const result: LoginResult = data.data;
    setTokens(result.accessToken, result.refreshToken);
    return result;
  },

  /**
   * Force a token refresh (normally automatic via interceptor).
   */
  refreshTokens: async (): Promise<{ accessToken: string; refreshToken: string }> => {
    const refreshToken = localStorage.getItem('refreshToken');
    const { data } = await api.post('/auth/refresh', { refreshToken });
    setTokens(data.data.accessToken, data.data.refreshToken);
    return data.data;
  },

  /**
   * Update the current user's profile.
   */
  updateProfile: async (profileData: any): Promise<AuthUser> => {
    const { data } = await api.patch("/auth/me", profileData);
    return data.data.user;
  },

  /**
   * Logout from the current device.
   */
  logout: async (): Promise<void> => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      await api.post('/auth/logout', { refreshToken });
    } finally {
      clearTokens();
    }
  },

  /**
   * Logout from ALL devices — terminates every session.
   */
  logoutAll: async (): Promise<void> => {
    try {
      await api.post('/auth/logout-all');
    } finally {
      clearTokens();
    }
  },

  /**
   * Get the currently authenticated user's profile.
   */
  getMe: async (): Promise<AuthUser> => {
    const { data } = await api.get('/auth/me');
    return data.data.user;
  },

  /**
   * Get all active sessions for the current user.
   */
  getSessions: async (): Promise<Session[]> => {
    const { data } = await api.get('/auth/sessions');
    return data.data.sessions;
  },
};

export default authService;
