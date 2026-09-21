import { API_URL } from '../config/api';

export type UserProgress = {
  childUserId: string;
  coinBalance: number;
  totalXp: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  lastCompletedChoreDate: string | null;
  completedChoreCount: number;
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

export async function getMyProgress(
  token: string
): Promise<UserProgress> {
  const response = await fetch(
    `${API_URL}/api/progress/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      'Could not load your progress.'
    );

    throw new Error(message);
  }

  return response.json();
}