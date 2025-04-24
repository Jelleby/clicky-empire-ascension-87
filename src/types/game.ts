
export interface Generator {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  baseOutput: number;
  quantity: number;
  unlocked: boolean;
  unlockCost?: number;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  purchased: boolean;
  unlocked: boolean;
  multiplier: number;
  target: string; // 'click', 'all', or specific generator id
  requiredGenerators?: { [generatorId: string]: number };
}

export interface Research {
  id: string;
  name: string;
  description: string;
  cost: number; // in premium currency
  level: number;
  maxLevel: number;
  baseEffect: number;
  unlocked: boolean;
  category: 'efficiency' | 'income' | 'prestige';
  effectDescription: string;
}

export interface Prestige {
  level: number;
  pendingPoints: number;
  points: number;
  multiplier: number;
}

export interface GameState {
  resources: number;
  premiumCurrency: number;
  clickPower: number;
  generators: Generator[];
  upgrades: Upgrade[];
  research: Research[];
  prestige: Prestige;
  totalResourcesEarned: number;
  lastTickTimestamp: number;
  offlineProductionEnabled: boolean;
}

export interface NumberPopup {
  id: string;
  value: number;
  x: number;
  y: number;
  timestamp: number;
}
