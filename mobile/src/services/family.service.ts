import { API_URL } from '../config/api';

export type Family = {
  id: string;
  name: string;
  joinCode: string;
};

export type JoinRequest = {
  requestId: string;
  userId: string;
  name: string;
  requestedRole: 'PARENT' | 'CHILD';
  status:
    | 'PENDING'
    | 'APPROVED'
    | 'REJECTED'
    | 'CANCELLED';
  requestedAt: string;
};

async function getErrorMessage(
  response: Response,
  fallbackMessage: string
) {
  try {
    const data = await response.json();

    return (
      data.message ??
      data.error ??
      fallbackMessage
    );
  } catch {
    return fallbackMessage;
  }
}

export async function createFamily(
  name: string,
  token: string
): Promise<Family> {
  const response = await fetch(
    `${API_URL}/api/families`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        name,
      }),
    }
  );

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      'Could not create family.'
    );

    throw new Error(message);
  }

  return response.json();
}

export async function getMyFamily(
  token: string
): Promise<Family | null> {
  const response = await fetch(
    `${API_URL}/api/families/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      'Could not load your family.'
    );

    throw new Error(message);
  }

  return response.json();
}

export async function requestToJoinFamily(
  joinCode: string,
  token: string
): Promise<void> {
  const response = await fetch(
    `${API_URL}/api/families/join`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        joinCode,
      }),
    }
  );

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      'Could not send join request.'
    );

    throw new Error(message);
  }
}

export async function getJoinRequests(
  token: string
): Promise<JoinRequest[]> {
  const response = await fetch(
    `${API_URL}/api/families/join-requests`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      'Could not load join requests.'
    );

    throw new Error(message);
  }

  return response.json();
}

export async function approveJoinRequest(
  requestId: string,
  token: string
): Promise<void> {
  const response = await fetch(
    `${API_URL}/api/families/join-requests/${requestId}/approve`,
    {
      method: 'POST',

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      'Could not approve join request.'
    );

    throw new Error(message);
  }
}

export async function rejectJoinRequest(
  requestId: string,
  token: string
): Promise<void> {
  const response = await fetch(
    `${API_URL}/api/families/join-requests/${requestId}/reject`,
    {
      method: 'POST',

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      'Could not reject join request.'
    );

    throw new Error(message);
  }
}

export type FamilyMember = {
  userId: string;
  name: string;
  role: 'OWNER' | 'PARENT' | 'CHILD';
  joinedAt: string;
};

export async function getFamilyMembers(
  token: string
): Promise<FamilyMember[]> {
  const response = await fetch(
    `${API_URL}/api/families/members`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      'Could not load family members.'
    );

    throw new Error(message);
  }

  return response.json();
}