import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import authService, { AuthUser } from "@/services/authService";
import { getAccessToken, clearTokens } from "@/services/api";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const userData = await authService.getMe();
      setUser(userData);
    } catch (error) {
      console.error("Auth initialization failed:", error);
      setUser(null);
      clearTokens();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();

    // Listen for session-expired events from the API interceptor
    const handleSessionExpired = () => {
      setUser(null);
      clearTokens();
    };

    window.addEventListener("auth:session-expired", handleSessionExpired);
    return () => window.removeEventListener("auth:session-expired", handleSessionExpired);
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password);
    setUser(result.user);
  };

  const register = async (name: string, email: string, password: string) => {
    await authService.register(name, email, password);
    // After registration, usually we login automatically or redirect to login.
    // authService.register returns the user object, but we need tokens to be logged in.
    // For simplicity, we'll let the Login page handle the redirection or auto-login.
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      clearTokens();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
