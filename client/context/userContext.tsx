"use client"
// context/UserContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the user data
export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

interface UserContextProps {
  user: User;
  setUser: (user: User) => void;
}
export interface roleInf {
  role: "admin" | "sales" | "aggregator";
}

export const roleOptions = new Set(["admin", "sales", "aggregator"]);

interface RoleSet {
  [key: string]: string;
}
export const roleMap: RoleSet = {
  DATA_AGGREGATOR: "feeder",
  SALES_PERSON: "sales",
  ADMIN: "admin",
};

// Create the context
const UserContext = createContext<UserContextProps | undefined>(undefined);

// Create a provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({
    id: "",
    fullName: "",
    email: "",
    role: "",
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
