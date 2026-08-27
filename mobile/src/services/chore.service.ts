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

  estimatedMinutes: number;

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

export type ChoreAssignmentStatus =
  | 'ASSIGNED'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'OVERDUE'
  | 'CANCELLED';

export type ChildChoreAssignment = {
  assignmentId: string;
  templateId: string;
  title: string;
  description: string | null;
  dueAt: string | null;

  status: ChoreAssignmentStatus;

  participationStatus: string;

  coinReward: number;
  xpReward: number;
  moneyRewardPence: number | null;

  checklist: unknown[];

  latestSubmissionStatus: string | null;

  parentFeedback: string | null;

  completedAt: string | null;
};

export async function getMyAssignments(
  token: string,
  status?: ChoreAssignmentStatus
): Promise<ChildChoreAssignment[]> {
  const query = status
    ? `?status=${status}`
    : '';

  const response = await fetch(
    `${API_URL}/api/chore-templates/my-assignments${query}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      'Could not load your chores.'
    );

    throw new Error(message);
  }

  return response.json();
}

export type ParentChoreAssignment = {
  assignmentId: string;
  templateId: string;

  title: string;
  description: string | null;

  createdByUserId: string;
  createdByName: string;

  dueAt: string | null;

  status: ChoreAssignmentStatus;

  coinReward: number;
  xpReward: number;
  moneyRewardPence: number | null;

  participants: unknown[];

  completedAt: string | null;
  createdAt: string;
};

export async function getFamilyAssignments(
  token: string,
  status?: ChoreAssignmentStatus
): Promise<ParentChoreAssignment[]> {
  const query = status
    ? `?status=${status}`
    : '';

  const response = await fetch(
    `${API_URL}/api/chore-templates/family-assignments${query}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const message = await getErrorMessage(
      response,
      'Could not load family chores.'
    );

    throw new Error(message);
  }

  return response.json();
}

export type AssignChoreRequest = {
  templateId: string;
  childUserIds: string[];
  dueAt?: string;
};

export async function assignChore(
  request: AssignChoreRequest,
  token: string
): Promise<void> {
  const response = await fetch(
    `${API_URL}/api/chore-templates/assign`,
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
      'Could not assign chore.'
    );

    throw new Error(message);
  }
}