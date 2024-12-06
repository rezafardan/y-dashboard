"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { UserRole } from "@/schema/dataSchema";

interface AuthContextType {
  role: UserRole | null;
  setRole: (role: UserRole | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  username: string;
  profileImage: string | null;
  loginUser: (userData: {
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
  const [role, setRole] = useState<UserRole | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Fungsi untuk memperbarui status autentikasi setelah login
  const loginUser = (userData: {
    username: string;
    role: UserRole;
    profileImage: string;
  }) => {
    setUsername(userData.username);
    setRole(userData.role);
    setProfileImage(userData.profileImage);
    setIsAuthenticated(true);
  };

  useEffect(() => {
    const savedUser = sessionStorage.getItem("userData");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);

      // Update state di AuthContext
      loginUser(parsedUser);
    }
  }, []);

  // Untuk logout, reset semua data
  const logoutUser = () => {
    sessionStorage.removeItem("userData");
    setUsername("");
    setRole(null);
    setProfileImage(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,
        isAuthenticated,
        setIsAuthenticated,
        username,
        profileImage,
        loginUser, // Menambahkan loginUser ke dalam context
        logoutUser, // Menambahkan logoutUser ke dalam context
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
