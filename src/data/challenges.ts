
import { CoopChallenge } from '../types/multiplayer';

const currentDate = new Date();
const weekFromNow = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);

export const initialChallenges: CoopChallenge[] = [
  {
    id: 'weekly_data_rush',
    name: 'Weekly Data Rush',
    description: 'Work together to generate 1 million data points',
    startDate: currentDate.toISOString(),
    endDate: weekFromNow.toISOString(),
    targetValue: 1000000,
    reward: {
      type: 'multiplier',
      value: 1.5
    },
    participants: [],
    totalProgress: 0
  }
];
