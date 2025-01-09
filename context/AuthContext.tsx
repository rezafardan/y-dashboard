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
  const [id, setId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loginUser = (userData: {
    id: string;
    username: string;
    role: UserRole;
    profileImage: string;
  }) => {
    setId(userData.id);
    setUsername(userData.username);
    setRole(userData.role);
    setProfileImage(userData.profileImage);
    setIsAuthenticated(true);
  };

  useEffect(() => {
    const savedUser = sessionStorage.getItem("userData");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);

      loginUser(parsedUser);
    }
  }, []);

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

        // First check sessionStorage
        const savedUser = sessionStorage.getItem("userData");
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);

          // Verify with backend that session is still valid
          const response = await authCheck();

          if (response.ok) {
            // Session is valid, restore user data
            loginUser(parsedUser);
          } else {
            // Session is invalid, clear stored data
            sessionStorage.removeItem("userData");
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        sessionStorage.removeItem("userData");
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Optional: Refresh auth check periodically
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(async () => {
      try {
        const response = await authCheck();

        if (!response.ok) {
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
    return <div>Loading...</div>; // Or your custom loading component
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
