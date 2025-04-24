
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: {
    type: 'resources' | 'generators' | 'upgrades' | 'prestige';
    value: number;
  };
  reward: {
    type: 'multiplier' | 'premium';
    value: number;
  };
  unlocked: boolean;
  progress: number;
}
