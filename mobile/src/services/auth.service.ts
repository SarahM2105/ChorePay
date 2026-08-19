import { API_URL } from '../config/api';

export type UserRole = 'PARENT' | 'CHILD';

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  userType: UserRole;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  id: string;
  name: string;
  email: string;
  userType: UserRole;
  token: string;
};

async function getErrorMessage(
  response: Response,
  fallbackMessage: string
) {
  try {
    const data = await response.json();

    console.log('Backend error:', data);

    return (
      data.message ??
      data.error ??
      fallbackMessage
    );
  } catch {
    return fallbackMessage;
  }
}

export async function registerUser(
  request: RegisterRequest
) {
  const response = await fetch(
    `${API_URL}/api/auth/register`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      'Registration failed.'
    );

    throw new Error(message);
  }

  return response.json();
}

export async function loginUser(
  request: LoginRequest
): Promise<LoginResponse> {
  const response = await fetch(
    `${API_URL}/api/auth/login`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      'Login failed.'
    );

    throw new Error(message);
  }

  return response.json();
}