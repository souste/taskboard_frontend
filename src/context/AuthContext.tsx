import { createContext, useContext, useEffect, useState } from "react";
import { getMe, login as loginRequest, signup as singupRequest } from "../services/api";
import type { SafeUser } from "../types/auth.types";

type AuthContextType = {
  user: SafeUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }
    const loadUser = async () => {
      const res = await getMe();

      if (!res.success) {
        logout();
      } else {
        setUser(res.data.user);
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const signup = async (username: string, email: string, password: string) => {
    const res = await singupRequest({ username, email, password });

    if (!res.success || !res.data || !res.data?.token) {
      return false;
    }
    localStorage.setItem("token", res.data.token);

    const me = await getMe();
    if (me.success && me.data?.user) {
      setUser(me.data.user);
      return true;
    }
    return false;
  };

  const login = async (email: string, password: string) => {
    const res = await loginRequest({ email, password });

    if (!res.success || !res.data?.token) {
      return false;
    }

    localStorage.setItem("token", res.data.token);

    const me = await getMe();
    if (me.success && me.data?.user) {
      setUser(me.data.user);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const refreshUser = async () => {
    const res = await getMe();

    if (!res.success) {
      logout();
      return false;
    }
    setUser(res.data.user);
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside Auth Provider");
  return ctx;
}
