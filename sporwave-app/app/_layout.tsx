import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/lib/auth/AuthProvider';
import { useAuth } from '@/lib/auth/useAuth';

function NavigationGuard() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuth = segments[0] === '(auth)';
    const inOnboarding = segments[0] === '(onboarding)';

    if (!user) {
      if (!inAuth) router.replace('/(auth)/login');
    } else if (!user.onboardingCompleted) {
      if (!inOnboarding) router.replace('/(onboarding)');
    } else {
      if (inAuth || inOnboarding) router.replace('/(app)/matches');
    }
  }, [user, isLoading, segments]);

  return null;
}

function RootLayout() {
  return (
    <AuthProvider>
      <NavigationGuard />
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}

export default RootLayout;
