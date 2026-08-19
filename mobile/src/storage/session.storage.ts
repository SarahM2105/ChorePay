import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { AuthSession } from '../types/auth';

const SESSION_KEY = 'chorepay_session';

export async function saveSession(
  session: AuthSession
) {
  const value = JSON.stringify(session);

  if (Platform.OS === 'web') {
    localStorage.setItem(
      SESSION_KEY,
      value
    );

    return;
  }

  await SecureStore.setItemAsync(
    SESSION_KEY,
    value
  );
}

export async function getSession():
  Promise<AuthSession | null> {
  let value: string | null;

  if (Platform.OS === 'web') {
    value =
      localStorage.getItem(SESSION_KEY);
  } else {
    value =
      await SecureStore.getItemAsync(
        SESSION_KEY
      );
  }

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as AuthSession;
  } catch {
    await removeSession();

    return null;
  }
}

export async function removeSession() {
  if (Platform.OS === 'web') {
    localStorage.removeItem(SESSION_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(
    SESSION_KEY
  );
}