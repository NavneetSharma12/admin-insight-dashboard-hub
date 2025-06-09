
import { configureStore } from '@reduxjs/toolkit';
import permissionReducer from './slices/permissionSlice';

export const store = configureStore({
  reducer: {
    permission: permissionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
