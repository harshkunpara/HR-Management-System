import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'employee' | 'admin' | 'hr';

export interface User {
  id: string;
  employeeId: string;
  email: string;
  name: string;
  role: UserRole;
  department: string;
  position: string;
  joinDate: string;
  profilePicture?: string;
}

interface StoredUser extends User {
  password: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  signup: (employeeId: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: StoredUser[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    email: 'john.doe@dayflow.com',
    name: 'John Doe',
    role: 'employee',
    department: 'Engineering',
    position: 'Software Engineer',
    joinDate: '2023-01-15',
    password: 'password',
  },
  {
    id: '2',
    employeeId: 'ADM001',
    email: 'admin@dayflow.com',
    name: 'Sarah Admin',
    role: 'admin',
    department: 'Administration',
    position: 'System Administrator',
    joinDate: '2022-06-01',
    password: 'password',
  },
  {
    id: '3',
    employeeId: 'HR001',
    email: 'hr@dayflow.com',
    name: 'Michael HR',
    role: 'hr',
    department: 'Human Resources',
    position: 'HR Manager',
    joinDate: '2022-03-10',
    password: 'password',
  },
];

// Storage keys
const USERS_STORAGE_KEY = 'dayflow_registered_users';
const CURRENT_USER_STORAGE_KEY = 'dayflow_current_user';

// Helper functions for localStorage
const getRegisteredUsers = (): StoredUser[] => {
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveRegisteredUsers = (users: StoredUser[]) => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Failed to save users:', error);
  }
};

const getCurrentUser = (): User | null => {
  try {
    const stored = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const saveCurrentUser = (user: User | null) => {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Failed to save current user:', error);
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize user from localStorage on mount
  useEffect(() => {
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsInitialized(true);
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      saveCurrentUser(user);
    }
  }, [user, isInitialized]);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Check mock users first
    const mockUser = mockUsers.find(u => u.email === email && u.role === role && u.password === password);
    if (mockUser) {
      const { password: _, ...userWithoutPassword } = mockUser;
      setUser(userWithoutPassword);
      return true;
    }

    // Check registered users
    const registeredUsers = getRegisteredUsers();
    const registeredUser = registeredUsers.find(u => u.email === email && u.role === role && u.password === password);
    if (registeredUser) {
      const { password: _, ...userWithoutPassword } = registeredUser;
      setUser(userWithoutPassword);
      return true;
    }

    return false;
  };

  const signup = async (employeeId: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    // Check if user already exists
    const registeredUsers = getRegisteredUsers();
    const allUsers = [...mockUsers, ...registeredUsers];
    const existingUser = allUsers.find(u => u.email === email || u.employeeId === employeeId);
    
    if (existingUser) {
      return false; // User already exists
    }

    // Create new user
    const newStoredUser: StoredUser = {
      id: Math.random().toString(36).substr(2, 9),
      employeeId,
      email,
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      role,
      department: 'General',
      position: 'New Employee',
      joinDate: new Date().toISOString().split('T')[0],
      password,
    };

    // Save to registered users
    const updatedUsers = [...registeredUsers, newStoredUser];
    saveRegisteredUsers(updatedUsers);

    // Set current user (without password)
    const { password: _, ...userWithoutPassword } = newStoredUser;
    setUser(userWithoutPassword);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}