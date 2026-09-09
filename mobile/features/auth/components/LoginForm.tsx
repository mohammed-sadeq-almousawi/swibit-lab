import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Animated, Platform } from 'react-native';
import { router } from 'expo-router';
import { useLogin, extractLoginError } from '../hooks/useAuth';

export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const loginMutation = useLogin();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(25)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleLogin = () => {
    loginMutation.mutate(
      { username, password },
      {
        onSuccess: () => {
          setErrorMessage('');
        },
        onError: (error: any) => {
          setErrorMessage(extractLoginError(error));
        },
      }
    );
  };

  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <Text className="text-3xl font-extrabold tracking-tight text-slate-800 text-center">
          Welcome Back
        </Text>
        <Text className="text-sm font-medium text-slate-400 mt-1 mb-8 text-center">
          Sign in to continue
        </Text>

        <TextInput
          className="border border-slate-200 bg-slate-50 p-4 rounded-xl mb-4 text-base text-slate-800"
          placeholder="Username"
          placeholderTextColor="#94A3B8"
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            setErrorMessage('');
          }}
          autoCapitalize="none"
        />

        <TextInput
          className="border border-slate-200 bg-slate-50 p-4 rounded-xl mb-4 text-base text-slate-800"
          placeholder="Password"
          placeholderTextColor="#94A3B8"
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
          onPress={handleLogin}
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
      </Animated.View>
    </View>
  );
};
