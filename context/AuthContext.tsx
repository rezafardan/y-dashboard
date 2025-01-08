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

interface AuthContextType {
  id: string | null;
  role: UserRole | null;
  setRole: (role: UserRole | null) => void;
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

  return (
    <AuthContext.Provider
      value={{
        id,
        role,
        setRole,
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
