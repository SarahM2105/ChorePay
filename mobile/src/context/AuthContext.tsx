import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  getSession,
  removeSession,
  saveSession,
} from '../storage/session.storage';

import {
  AuthSession,
  AuthUser,
} from '../types/auth';

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  signIn: (
    session: AuthSession
  ) => Promise<void>;

  signOut: () => Promise<void>;
};

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [session, setSession] =
    useState<AuthSession | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedSession =
          await getSession();

        setSession(storedSession);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const signIn = async (
    newSession: AuthSession
  ) => {
    await saveSession(newSession);

    setSession(newSession);
  };

  const signOut = async () => {
    await removeSession();

    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        token: session?.token ?? null,

        isAuthenticated:
          session !== null,

        isLoading,

        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider.'
    );
  }

  return context;
}