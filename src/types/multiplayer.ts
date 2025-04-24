
export interface CoopChallenge {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  targetValue: number;
  reward: {
    type: 'multiplier' | 'premium';
    value: number;
  };
  participants: {
    userId: string;
    username: string;
    contribution: number;
  }[];
  totalProgress: number;
}

export interface ChallengeParticipation {
  challengeId: string;
  userId: string;
  contribution: number;
  joinedAt: string;
}
