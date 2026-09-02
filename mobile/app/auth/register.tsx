import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { registerApi } from '../../features/auth/api/authApi';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const registerMutation = useMutation({
    mutationFn: () => registerApi(username, email, password),
    onSuccess: () => {
      setErrorMessage('');
      router.replace('/auth/login');
    },
    onError: (error: any) => {

      let msg = 'An unexpected error occurred.';

      if (error.response) {
        msg = error.response.data?.detail || 'Server error occurred.';
        if (Array.isArray(msg)) {
          msg = msg[0]?.msg || 'Invalid input data.';
        }
      } else {
        msg = 'Network error or Username/Email already exists!';
      }

      setErrorMessage(msg);
    },
  });

  return (
    <View className="flex-1 justify-center p-5 bg-white">
      <Text className="text-3xl font-bold mb-10 text-center text-gray-800">Create Account</Text>

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
        placeholder="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setErrorMessage('');
        }}
        autoCapitalize="none"
        keyboardType="email-address"
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
        className="bg-green-600 p-4 rounded-xl items-center mt-2"
        onPress={() => registerMutation.mutate()}
        disabled={!username || !email || !password || registerMutation.isPending}
      >
        {registerMutation.isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-lg font-bold">Sign Up</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        className="mt-5 items-center"
        onPress={() => router.push('/auth/login')}
      >
        <Text className="text-blue-500 text-base">Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}
