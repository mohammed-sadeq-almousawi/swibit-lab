import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../login';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), replace: jest.fn() }
}));

const queryClient = new QueryClient();
const Wrapper = ({ children }: any) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('LoginScreen Component Tests', () => {
  it('renders the login screen correctly', async () => {
    await render(<LoginScreen />, { wrapper: Wrapper });

    expect(screen.getByText('Welcome Back')).toBeTruthy();
    expect(screen.getByPlaceholderText('Username')).toBeTruthy();
    expect(screen.getByPlaceholderText('Password')).toBeTruthy();
  });

  it('updates input values when the user types', async () => {
    await render(<LoginScreen />, { wrapper: Wrapper });

    const usernameInput = screen.getByPlaceholderText('Username');
    fireEvent.changeText(usernameInput, 'admin_user');


    await waitFor(() => {
      expect(screen.getByPlaceholderText('Username').props.value).toBe('admin_user');
    });
  });
});
