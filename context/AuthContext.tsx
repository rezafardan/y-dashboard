"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

// MODELS
import { UserRole } from "@/models/dataSchema";
import { authCheck } from "@/services/authServices";
import GlobalSkeleton from "@/components/global-skeleton";
import { usePathname } from "next/navigation";

interface AuthContextType {
  id: string | null;
  role: UserRole | null;
  setRole: (role: UserRole | null) => void;
  isLoading: boolean;
  username: string;
  profileImage: string | null;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  loginUser: (userData: {
    id: string;
    username: string;
    role: UserRole;
    profileImage: string;
  }) => void;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [id, setId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const pathname = usePathname();

  const loginUser = (userData: {
    id: string;
    username: string;
    role: UserRole;
    profileImage: string;
  }) => {
    console.log("Login");
    setId(userData.id);
    setUsername(userData.username);
    setRole(userData.role);
    setProfileImage(userData.profileImage);
    setIsAuthenticated(true);

    sessionStorage.setItem("userData", JSON.stringify(userData));
  };

  const logoutUser = () => {
    sessionStorage.removeItem("userData");
    setId(null);
    setUsername("");
    setRole(null);
    setProfileImage(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);

        const savedUser = sessionStorage.getItem("userData");
        if (!savedUser) {
          // Pastikan hanya mengecek autentikasi di halaman selain login
          if (pathname !== "/login") {
            const response = await authCheck();

            if (response?.user) {
              loginUser(response.user);
            } else {
              logoutUser();
            }
          }
        } else {
          const parsedUser = JSON.parse(savedUser);
          loginUser(parsedUser);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        logoutUser();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname]);

  // Optional: Refresh auth check periodically
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(async () => {
      try {
        const response = await authCheck();

        if (!response?.user) {
          logoutUser();
        }
      } catch (error) {
        console.error("Auth refresh error:", error);
        logoutUser();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  if (isLoading) {
    return <GlobalSkeleton />; // Or your custom loading component
  }

  return (
    <AuthContext.Provider
      value={{
        id,
        role,
        setRole,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        username,
        profileImage,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
