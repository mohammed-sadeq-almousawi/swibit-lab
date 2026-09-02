import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const TOKEN_KEY = 'jwt_token';

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,

  login: async (newToken: string) => {
    if (Platform.OS !== 'web') {
      await SecureStore.setItemAsync(TOKEN_KEY, newToken);
    } else {
      localStorage.setItem(TOKEN_KEY, newToken);
    }
    set({ token: newToken, isAuthenticated: true });
  },

  logout: async () => {
    if (Platform.OS !== 'web') {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    set({ token: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    let token = null;
    if (Platform.OS !== 'web') {
      token = await SecureStore.getItemAsync(TOKEN_KEY);
    } else {
      token = localStorage.getItem(TOKEN_KEY);
    }

    if (token) {
      set({ token, isAuthenticated: true });
    } else {
      set({ token: null, isAuthenticated: false });
    }
  },
}));
