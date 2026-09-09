import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { loginApi, registerApi } from '../api/authApi';
import { useAuthStore } from '../../../core/store/useAuthStore';

export const useLogin = () => {
  const loginAction = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      loginApi(username, password),
    onSuccess: (data) => {
      loginAction(data.access_token);
      router.replace('/(main)/tasks');
    },
  });
};

export const extractLoginError = (error: any): string => {
  let msg = 'Network error. Could not connect to the server.';

  if (error.response) {
    msg = error.response.data?.detail || 'Incorrect username or password.';

    if (Array.isArray(msg)) {
      msg = msg[0]?.msg || 'Invalid input data.';
    }
  }
  return msg;
};

export const useRegister = () => {
  return useMutation({
    mutationFn: ({ username, email, password }: { username: string; email: string; password: string }) =>
      registerApi(username, email, password),
    onSuccess: () => {
      router.replace('/auth/login');
    },
  });
};

export const extractRegisterError = (error: any): string => {
  let msg = 'An unexpected error occurred.';

  if (error.response) {
    msg = error.response.data?.detail || 'Server error occurred.';
    if (Array.isArray(msg)) {
      msg = msg[0]?.msg || 'Invalid input data.';
    }
  } else {
    msg = 'Network error or Username/Email already exists!';
  }

  return msg;
};
