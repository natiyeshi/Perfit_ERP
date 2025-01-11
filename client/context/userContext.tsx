// context/UserContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the user data
interface User {
  fullName: string;
  email: string;
  role: string;
}

interface UserContextProps {
  user: User;
  setUser: (user: User) => void;
}

// Create the context
const UserContext = createContext<UserContextProps | undefined>(undefined);

// Create a provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({ fullName: '', email: '', role: '' });

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
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
