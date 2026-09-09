import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Animated, Platform } from 'react-native';
import { router } from 'expo-router';
import { useRegister, extractRegisterError } from '../hooks/useAuth';

export const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const registerMutation = useRegister();

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

  const handleRegister = () => {
    registerMutation.mutate(
      { username, email, password },
      {
        onSuccess: () => {
          setErrorMessage('');
        },
        onError: (error: any) => {
          setErrorMessage(extractRegisterError(error));
        },
      }
    );
  };

  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <Text className="text-3xl font-extrabold tracking-tight text-slate-800 text-center">
          Create Account
        </Text>
        <Text className="text-sm font-medium text-slate-400 mt-1 mb-8 text-center">
          Join us to get started
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
          placeholder="Email"
          placeholderTextColor="#94A3B8"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrorMessage('');
          }}
          autoCapitalize="none"
          keyboardType="email-address"
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
          className="bg-green-600 p-4 rounded-xl items-center mt-2"
          onPress={handleRegister}
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
      </Animated.View>
    </View>
  );
};
