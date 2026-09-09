import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '../core/store/useAuthStore';
import { LoadingScreen } from '../shared/components/LoadingScreen';

export default function Index() {
  const { token, checkAuth } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await checkAuth();
      setIsReady(true);
    };
    init();
  }, []);

  if (!isReady) {
    return <LoadingScreen />;
  }

  return token ? <Redirect href="/(main)/tasks" /> : <Redirect href="/auth/login" />;
}
