import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Role = "admin" | "farmer" | "owner" | "manager" | "worker";

export interface AuthUser {
  uid: string;
  email: string;
  displayName?: string;
  fullName?: string;
  district?: string;
  role?: Role;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function loadCurrentUser() {
  const token = window.localStorage.getItem("auth_token");
  if (!token) return null;
  const response = await fetch("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    window.localStorage.removeItem("auth_token");
    return null;
  }
  const data = await response.json();
  return data.user as AuthUser;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const refresh = async () => {
      const currentUser = await loadCurrentUser();
      if (!mounted) return;
      setUser(currentUser);
      setLoading(false);
    };

    refresh();

    const handleAuthChange = () => {
      void refresh();
    };

    window.addEventListener("authchange", handleAuthChange);

    return () => {
      mounted = false;
      window.removeEventListener("authchange", handleAuthChange);
    };
  }, []);

  async function signOut() {
    window.localStorage.removeItem("auth_token");
    setUser(null);
    window.dispatchEvent(new Event("authchange"));
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: user?.role === "admin",
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
