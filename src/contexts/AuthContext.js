import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const USER_ROLES = {
  ADMIN: 'admin',
  BOARD: 'board',
  MEMBER: 'member'
};

const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@crestvieweighty.com',
    password: 'admin123',
    role: USER_ROLES.ADMIN,
    name: 'HOA Administrator',
    address: '123 Crestview Dr'
  },
  {
    id: '2',
    email: 'board@crestvieweighty.com',
    password: 'board123',
    role: USER_ROLES.BOARD,
    name: 'John Smith',
    address: '456 Mountain View Ln'
  },
  {
    id: '3',
    email: 'member@crestvieweighty.com',
    password: 'member123',
    role: USER_ROLES.MEMBER,
    name: 'Jane Doe',
    address: '789 Lake Vista Ct'
  },
  // Simple credentials for quick testing
  {
    id: '4',
    email: 'admin',
    password: 'admin',
    role: USER_ROLES.ADMIN,
    name: 'Admin User',
    address: 'Admin Office'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('authUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = MOCK_USERS.find(
          u => u.email === email && u.password === password
        );
        
        if (foundUser) {
          const { password: _, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          setIsAuthenticated(true);
          localStorage.setItem('authUser', JSON.stringify(userWithoutPassword));
          setIsLoading(false);
          resolve(userWithoutPassword);
        } else {
          setIsLoading(false);
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authUser');
  };

  const hasRole = (requiredRole) => {
    if (!user) return false;
    
    const roleHierarchy = {
      [USER_ROLES.ADMIN]: 3,
      [USER_ROLES.BOARD]: 2,
      [USER_ROLES.MEMBER]: 1
    };
    
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};