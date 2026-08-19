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
      <Stack.Protected
        guard={
          isAuthenticated &&
          user?.userType === 'PARENT'
        }
      >
        <Stack.Screen name="parent-dashboard" />
      </Stack.Protected>

      <Stack.Protected
        guard={
          isAuthenticated &&
          user?.userType === 'CHILD'
        }
      >
        <Stack.Screen name="child-dashboard" />
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