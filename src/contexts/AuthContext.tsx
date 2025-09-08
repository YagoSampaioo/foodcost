import { createContext, ReactNode, useCallback, useEffect, useState } from "react";
import { AuthUser } from "../types";
import { authService } from "../services/authService";
import { Loader } from "lucide-react";

interface AuthContextType {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
      setLoading(true);
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("No active session", error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUserSession();
  }, []);
  const login = useCallback(async (email: string, password: string) => {
    const user = await authService.login({ email, password });
    setCurrentUser(user);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setCurrentUser(null);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-orange-500 animate-spin" />
          <p className="mt-4 text-gray-600">Verificando sessão...</p>
        </div>
      </div>
    );
  }
  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated: !!currentUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
