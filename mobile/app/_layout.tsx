import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { QueryProvider } from '../core/api/QueryProvider';
import { useAuthStore } from '../core/store/useAuthStore';
import { LoadingScreen } from '../shared/components/LoadingScreen';
import '../global.css';

export default function RootLayout() {
  const { token, checkAuth } = useAuthStore();
  const [isReady, setIsReady] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    checkAuth().then(() => setIsReady(true));
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === 'auth';
    if (!token && !inAuthGroup) {
      router.replace('/auth/login');
    } else if (token && inAuthGroup) {
      router.replace('/(main)/tasks');
    }
  }, [token, segments, isReady]);

  if (!isReady) {
    return <LoadingScreen />;
  }

  return (
    <QueryProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" />
        <Stack.Screen name="(main)" />
      </Stack>
    </QueryProvider>
  );
}
