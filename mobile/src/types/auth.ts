export type UserRole = 'PARENT' | 'CHILD';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  userType: UserRole;
};

export type AuthSession = {
  user: AuthUser;
  token: string;
};