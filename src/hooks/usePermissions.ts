
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { loginUser, logout, updateUserPermissions, loadUserFromStorage, clearError } from '../store/slices/permissionSlice';
import { Permission, Role } from '../types/permissions';

export const usePermissions = () => {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.permission);

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

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
    const result = await dispatch(loginUser({ email, password }));
    return result.type === loginUser.fulfilled.type;
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  const updatePermissions = (userId: string, permissions: Permission[]) => {
    dispatch(updateUserPermissions({ userId, permissions }));
  };

  const clearLoginError = () => {
    dispatch(clearError());
  };

  return {
    user,
    loading,
    error,
    hasPermission,
    hasAnyPermission,
    isRole,
    login,
    logout: logoutUser,
    updateUserPermissions: updatePermissions,
    clearError: clearLoginError,
  };
};
