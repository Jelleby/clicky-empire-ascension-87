
import { Research } from "../types/game";

export const initialResearch: Research[] = [
  {
    id: "efficiency1",
    name: "Energy Efficiency",
    description: "Optimize power consumption in your server farm.",
    cost: 10,
    level: 0,
    maxLevel: 10,
    baseEffect: 0.1, // +10% per level
    unlocked: true,
    category: "efficiency",
    effectDescription: "+10% generator output per level"
  },
  {
    id: "efficiency2",
    name: "Cooling Systems",
    description: "Advanced cooling allows servers to run at peak performance.",
    cost: 25,
    level: 0,
    maxLevel: 8,
    baseEffect: 0.2, // +20% per level
    unlocked: true,
    category: "efficiency",
    effectDescription: "+20% generator output per level"
  },
  {
    id: "income1",
    name: "Data Compression",
    description: "Compress data to get more value from each byte.",
    cost: 15,
    level: 0,
    maxLevel: 10,
    baseEffect: 0.15, // +15% per level
    unlocked: true,
    category: "income",
    effectDescription: "+15% click value per level"
  },
  {
    id: "income2",
    name: "Algorithmic Trading",
    description: "Use AI to optimize data market transactions.",
    cost: 30,
    level: 0,
    maxLevel: 8,
    baseEffect: 0.25, // +25% per level
    unlocked: true,
    category: "income",
    effectDescription: "+25% click value per level"
  },
  {
    id: "prestige1",
    name: "Replication Technology",
    description: "Better technology for restarting your server empire.",
    cost: 50,
    level: 0,
    maxLevel: 5,
    baseEffect: 0.2, // +20% prestige points per level
    unlocked: true,
    category: "prestige",
    effectDescription: "+20% prestige points per level"
  },
  {
    id: "prestige2",
    name: "Knowledge Retention",
    description: "Retain more knowledge when resetting your server empire.",
    cost: 75,
    level: 0,
    maxLevel: 5,
    baseEffect: 0.3, // +30% prestige multiplier per level
    unlocked: true,
    category: "prestige",
    effectDescription: "+30% prestige multiplier effectiveness per level"
  },
];
