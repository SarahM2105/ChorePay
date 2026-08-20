import { API_URL } from '../config/api';

export type ChoreDifficulty =
  | 'EASY'
  | 'MEDIUM'
  | 'HARD';

export type ChoreTemplate = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  difficulty: ChoreDifficulty;
  estimatedMinutes: number | null;
  coinReward: number;
  xpReward: number;
  moneyRewardPence: number | null;
  latePenaltyPercent: number | null;
  resubmissionPenaltyPercent: number | null;
  photoRequired: boolean;
  commentRequired: boolean;
  active: boolean;
};

export type CreateChoreTemplateRequest = {
  title: string;
  description?: string;
  category?: string;
  difficulty: ChoreDifficulty;
  estimatedMinutes?: number;
  coinReward: number;
  moneyRewardPence?: number;
  latePenaltyPercent?: number;
  resubmissionPenaltyPercent?: number;
  photoRequired: boolean;
  commentRequired: boolean;
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

export async function createChoreTemplate(
  request: CreateChoreTemplateRequest,
  token: string
): Promise<ChoreTemplate> {
  const response = await fetch(
    `${API_URL}/api/chore-templates`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      'Could not create chore.'
    );

    throw new Error(message);
  }

  return response.json();
}