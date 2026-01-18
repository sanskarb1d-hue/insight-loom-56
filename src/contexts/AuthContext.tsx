import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type UserRole = 'super_admin' | 'customer_admin' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId?: string;
  tenantName?: string;
  avatar?: string;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isSuperAdmin: boolean;
  isCustomerAdmin: boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: Record<string, User> = {
  'admin@logwatch.io': {
    id: 'sa-001',
    email: 'admin@logwatch.io',
    name: 'Super Admin',
    role: 'super_admin',
    avatar: undefined,
    permissions: ['*'],
  },
  'admin@acmecorp.com': {
    id: 'ca-001',
    email: 'admin@acmecorp.com',
    name: 'ACME Admin',
    role: 'customer_admin',
    tenantId: 'tenant-acme',
    tenantName: 'ACME Corporation',
    avatar: undefined,
    permissions: ['identity.manage', 'security.manage', 'data.manage', 'dashboards.manage', 'usage.view'],
  },
  'user@acmecorp.com': {
    id: 'u-001',
    email: 'user@acmecorp.com',
    name: 'John Doe',
    role: 'user',
    tenantId: 'tenant-acme',
    tenantName: 'ACME Corporation',
    avatar: undefined,
    permissions: ['dashboards.view', 'reports.view', 'search.use'],
  },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('logwatch_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers[email.toLowerCase()];
    if (foundUser && password.length >= 4) {
      setUser(foundUser);
      localStorage.setItem('logwatch_user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('logwatch_user');
  }, []);

  const hasPermission = useCallback((permission: string): boolean => {
    if (!user) return false;
    if (user.permissions.includes('*')) return true;
    return user.permissions.includes(permission);
  }, [user]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    isSuperAdmin: user?.role === 'super_admin',
    isCustomerAdmin: user?.role === 'customer_admin',
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
