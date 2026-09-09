import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

interface AuthState {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const TOKEN_KEY = 'jwt_token';

const decodeUsername = (token: string): string | null => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.sub || null;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  username: null,
  isAuthenticated: false,

  login: async (newToken: string) => {
    if (Platform.OS !== 'web') {
      await SecureStore.setItemAsync(TOKEN_KEY, newToken);
    } else {
      localStorage.setItem(TOKEN_KEY, newToken);
    }
    set({ token: newToken, username: decodeUsername(newToken), isAuthenticated: true });
  },

  logout: async () => {
    if (Platform.OS !== 'web') {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    set({ token: null, username: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    let token = null;
    if (Platform.OS !== 'web') {
      token = await SecureStore.getItemAsync(TOKEN_KEY);
    } else {
      token = localStorage.getItem(TOKEN_KEY);
    }

    if (token) {
      set({ token, username: decodeUsername(token), isAuthenticated: true });
    } else {
      set({ token: null, username: null, isAuthenticated: false });
    }
  },
}));
