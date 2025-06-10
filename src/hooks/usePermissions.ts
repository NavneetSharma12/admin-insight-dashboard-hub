
import { useState, useEffect } from 'react';
import { Permission, Role, User } from '../types/permissions';
import { DEFAULT_ROLE_PERMISSIONS } from '../config/permissions';

// Mock users for demo - replace with your backend API
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Super Admin',
    email: 'super@admin.com',
    role: 'super_admin',
    permissions: DEFAULT_ROLE_PERMISSIONS.super_admin
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@admin.com',
    role: 'admin',
    permissions: DEFAULT_ROLE_PERMISSIONS.admin,
    societyId: '1',
    societyName: 'Green Valley Apartments'
  }
];

let currentUser: User | null = null;

export const usePermissions = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('admin_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      currentUser = parsedUser;
    }
  }, []);

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    if (!user) return false;
    return permissions.some(permission => user.permissions.includes(permission));
  };

  const isRole = (role: Role): boolean => {
    if (!user) return false;
    return user.role === role;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('Login attempt:', { email, password });
    setLoading(true);
    setError(null);
    
    try {
      // Mock authentication - replace with your backend API
      console.log('Available users:', mockUsers);
      const foundUser = mockUsers.find(u => u.email === email);
      console.log('Found user:', foundUser);
      console.log('Password check:', password, '===', 'admin123', password === 'admin123');
      
      if (foundUser && password === 'admin123') {
        console.log('Login successful for user:', foundUser);
        setUser(foundUser);
        currentUser = foundUser;
        localStorage.setItem('admin_user', JSON.stringify(foundUser));
        setLoading(false);
        return true;
      }
      console.log('Login failed - invalid credentials');
      setError('Invalid email or password');
      setLoading(false);
      return false;
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    currentUser = null;
    setError(null);
    localStorage.removeItem('admin_user');
  };

  const updateUserPermissions = (userId: string, permissions: Permission[]) => {
    if (user && user.id === userId) {
      const updatedUser = { ...user, permissions };
      setUser(updatedUser);
      currentUser = updatedUser;
      localStorage.setItem('admin_user', JSON.stringify(updatedUser));
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    user,
    loading,
    error,
    hasPermission,
    hasAnyPermission,
    isRole,
    login,
    logout,
    updateUserPermissions,
    clearError,
  };
};

// Export current user for components that need it without hooks
export const getCurrentUser = (): User | null => {
  const savedUser = localStorage.getItem('admin_user');
  if (savedUser) {
    return JSON.parse(savedUser);
  }
  return currentUser;
};
