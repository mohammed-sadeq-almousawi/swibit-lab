import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { RegisterForm } from '../components/RegisterForm';
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

describe('RegisterForm Component Tests', () => {
  it('renders the register form correctly', async () => {
    await render(<RegisterForm />, { wrapper: Wrapper });

    expect(screen.getByText('Create Account')).toBeTruthy();
    expect(screen.getByPlaceholderText('Username')).toBeTruthy();
    expect(screen.getByPlaceholderText('Email')).toBeTruthy();
    expect(screen.getByPlaceholderText('Password')).toBeTruthy();
  });

  it('updates input values when the user types', async () => {
    await render(<RegisterForm />, { wrapper: Wrapper });

    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.changeText(emailInput, 'test@example.com');

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Email').props.value).toBe('test@example.com');
    });
  });
});
