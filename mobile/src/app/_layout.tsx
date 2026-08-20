import { Stack } from 'expo-router';

import {
  AuthProvider,
  useAuth,
} from '../context/AuthContext';

function RootNavigator() {
  const {
    user,
    isAuthenticated,
    isLoading,
  } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Parent-only screens */}
      <Stack.Protected
        guard={
          isAuthenticated &&
          user?.userType === 'PARENT'
        }
      >
        <Stack.Screen name="parent-dashboard" />
        <Stack.Screen name="create-family" />
      </Stack.Protected>

      {/* Child-only screens */}
      <Stack.Protected
        guard={
          isAuthenticated &&
          user?.userType === 'CHILD'
        }
      >
        <Stack.Screen name="child-dashboard" />
        <Stack.Screen name="join-family" />
        <Stack.Screen name="create-chore" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}