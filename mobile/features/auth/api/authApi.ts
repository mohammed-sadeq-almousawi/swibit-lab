import { apiClient } from '../../../core/api/client';


interface AuthResponse {
  access_token: string;
  token_type: string;
}

export const loginApi = async (username: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);


  const response = await apiClient.post<AuthResponse>('/auth/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data;
};

export const registerApi = async (username: string, email: string, password: string) => {

  const response = await apiClient.post<AuthResponse>('/auth/register', {
    username,
    email,
    password,
  });

  return response.data;
};
