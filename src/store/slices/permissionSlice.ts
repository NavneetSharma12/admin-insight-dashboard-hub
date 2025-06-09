
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, Permission, Role } from '../../types/permissions';
import { DEFAULT_ROLE_PERMISSIONS } from '../../config/permissions';

interface PermissionState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: PermissionState = {
  user: null,
  loading: false,
  error: null,
};

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
    permissions: DEFAULT_ROLE_PERMISSIONS.admin
  }
];

export const loginUser = createAsyncThunk(
  'permission/loginUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Mock authentication - replace with your backend API
      const foundUser = mockUsers.find(u => u.email === email);
      if (foundUser && password === 'admin123') {
        localStorage.setItem('admin_user', JSON.stringify(foundUser));
        return foundUser;
      }
      return rejectWithValue('Invalid email or password');
    } catch (error) {
      return rejectWithValue('Login failed. Please try again.');
    }
  }
);

export const loadUserFromStorage = createAsyncThunk(
  'permission/loadUserFromStorage',
  async () => {
    const savedUser = localStorage.getItem('admin_user');
    if (savedUser) {
      return JSON.parse(savedUser) as User;
    }
    return null;
  }
);

const permissionSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem('admin_user');
    },
    updateUserPermissions: (state, action: PayloadAction<{ userId: string; permissions: Permission[] }>) => {
      if (state.user && state.user.id === action.payload.userId) {
        state.user.permissions = action.payload.permissions;
        localStorage.setItem('admin_user', JSON.stringify(state.user));
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout, updateUserPermissions, clearError } = permissionSlice.actions;
export default permissionSlice.reducer;
