
import { Achievement } from '../types/achievements';
import { award, gamepad, star, trophy } from 'lucide-react';

export const initialAchievements: Achievement[] = [
  {
    id: 'first_thousand',
    name: 'Digital Pioneer',
    description: 'Generate 1,000 data points',
    icon: 'gamepad',
    requirement: {
      type: 'resources',
      value: 1000
    },
    reward: {
      type: 'multiplier',
      value: 1.1
    },
    unlocked: false,
    progress: 0
  },
  {
    id: 'first_generator',
    name: 'System Builder',
    description: 'Purchase your first generator',
    icon: 'star',
    requirement: {
      type: 'generators',
      value: 1
    },
    reward: {
      type: 'premium',
      value: 10
    },
    unlocked: false,
    progress: 0
  },
  {
    id: 'first_prestige',
    name: 'Quantum Leap',
    description: 'Perform your first prestige',
    icon: 'trophy',
    requirement: {
      type: 'prestige',
      value: 1
    },
    reward: {
      type: 'multiplier',
      value: 1.5
    },
    unlocked: false,
    progress: 0
  }
];
