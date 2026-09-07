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
      <Stack.Protected guard={isAuthenticated}>
  <Stack.Screen name="join-family" />
</Stack.Protected>
      {/* Parent-only screens */}
      <Stack.Protected
        guard={
          isAuthenticated &&
          user?.userType === 'PARENT'
        }
      >
        <Stack.Screen name="parent-dashboard" />
        <Stack.Screen name="create-family" />
        <Stack.Screen name="create-chore" />
        <Stack.Screen name="family" />
        <Stack.Screen name="chores" />
      </Stack.Protected>

      {/* Child-only screens */}
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