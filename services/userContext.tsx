import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);

  useEffect(() => {
    // Load user from AsyncStorage on app start
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('currentUser');
        if (userData) {
          setCurrentUserState(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
      }
    };

    loadUser();
  }, []);

  const setCurrentUser = async (user: User | null) => {
    try {
      if (user) {
        await AsyncStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        await AsyncStorage.removeItem('currentUser');
      }
      setCurrentUserState(user);
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  };

  const logout = async () => {
    await setCurrentUser(null);
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}; 