import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { loginApi } from '../../features/auth/api/authApi';
import { useAuthStore } from '../../core/store/useAuthStore';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const loginAction = useAuthStore((state) => state.login);

  const loginMutation = useMutation({
    mutationFn: () => loginApi(username, password),
    onSuccess: (data) => {
      setErrorMessage('');
      loginAction(data.access_token);
      router.replace('/(main)/tasks');
    },
    onError: (error: any) => {
      let msg = 'Network error. Could not connect to the server.';

      if (error.response) {
        msg = error.response.data?.detail || 'Incorrect username or password.';

        if (Array.isArray(msg)) {
          msg = msg[0]?.msg || 'Invalid input data.';
        }
      }
      setErrorMessage(msg);
    },
  });

  return (
    <View className="flex-1 justify-center p-5 bg-white">
      <Text className="text-3xl font-bold mb-10 text-center text-gray-800">Welcome Back</Text>

      <TextInput
        className="border border-gray-300 p-4 rounded-xl mb-5 text-base"
        placeholder="Username"
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          setErrorMessage('');
        }}
        autoCapitalize="none"
      />

      <TextInput
        className="border border-gray-300 p-4 rounded-xl mb-5 text-base"
        placeholder="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setErrorMessage('');
        }}
        secureTextEntry
      />

      {errorMessage ? (
        <Text className="text-red-500 text-center mb-4 font-bold text-base">
          {errorMessage}
        </Text>
      ) : null}


      <TouchableOpacity
        className="bg-blue-500 p-4 rounded-xl items-center mt-2"
        onPress={() => loginMutation.mutate()}
        disabled={!username || !password || loginMutation.isPending}
      >
        {loginMutation.isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-lg font-bold">Login</Text>
        )}
      </TouchableOpacity>


      <TouchableOpacity
        className="mt-5 items-center"
        onPress={() => router.push('/auth/register')}
      >
        <Text className="text-blue-500 text-base">Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}
