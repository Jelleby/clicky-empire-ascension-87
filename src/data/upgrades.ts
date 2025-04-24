import { Upgrade } from "../types/game";

export const initialUpgrades: Upgrade[] = [
  // Click Upgrades
  {
    id: "click1",
    name: "Faster Clicks",
    description: "Double the power of your clicks.",
    cost: 50,
    purchased: false,
    unlocked: true,
    multiplier: 2,
    target: "click"
  },
  {
    id: "click2",
    name: "Optimized Clicking",
    description: "Triple the power of your clicks.",
    cost: 500,
    purchased: false,
    unlocked: false,
    multiplier: 3,
    target: "click",
    requiredGenerators: { server2: 5 }
  },
  {
    id: "click3",
    name: "Power Clicking",
    description: "Quadruple the power of your clicks.",
    cost: 5000,
    purchased: false,
    unlocked: false,
    multiplier: 4,
    target: "click",
    requiredGenerators: { server3: 5 }
  },
  {
    id: "click4",
    name: "Hyper Clicking",
    description: "5x the power of your clicks.",
    cost: 50000,
    purchased: false,
    unlocked: false,
    multiplier: 5,
    target: "click",
    requiredGenerators: { server4: 5 }
  },
  {
    id: "click5",
    name: "Quantum Clicking",
    description: "10x the power of your clicks.",
    cost: 5000000,
    purchased: false,
    unlocked: false,
    multiplier: 10,
    target: "click",
    requiredGenerators: { server6: 5 }
  },

  // Generator Specific Upgrades
  {
    id: "server1_upgrade1",
    name: "Server Cooling",
    description: "Basic Servers produce 2x more data.",
    cost: 200,
    purchased: false,
    unlocked: false,
    multiplier: 2,
    target: "server1",
    requiredGenerators: { server1: 10 }
  },
  {
    id: "server1_upgrade2",
    name: "Overclocking",
    description: "Basic Servers produce 3x more data.",
    cost: 2000,
    purchased: false,
    unlocked: false,
    multiplier: 3,
    target: "server1",
    requiredGenerators: { server1: 25 }
  },
  {
    id: "server2_upgrade1",
    name: "Caching System",
    description: "Web Servers produce 2x more data.",
    cost: 1000,
    purchased: false,
    unlocked: false,
    multiplier: 2,
    target: "server2",
    requiredGenerators: { server2: 10 }
  },
  {
    id: "server2_upgrade2",
    name: "Load Optimization",
    description: "Web Servers produce 3x more data.",
    cost: 10000,
    purchased: false,
    unlocked: false,
    multiplier: 3,
    target: "server2",
    requiredGenerators: { server2: 25 }
  },
  {
    id: "server3_upgrade1",
    name: "Indexing",
    description: "Database Servers produce 2x more data.",
    cost: 10000,
    purchased: false,
    unlocked: false,
    multiplier: 2,
    target: "server3",
    requiredGenerators: { server3: 10 }
  },
  {
    id: "server3_upgrade2",
    name: "Enhanced Databases",
    description: "Database Servers produce 3x more data.",
    cost: 100000,
    purchased: false,
    unlocked: false,
    multiplier: 3,
    target: "server3",
    requiredGenerators: { server3: 25 }
  },
  {
    id: "server4_upgrade1",
    name: "Parallelization",
    description: "Application Servers produce 2x more data.",
    cost: 100000,
    purchased: false,
    unlocked: false,
    multiplier: 2,
    target: "server4",
    requiredGenerators: { server4: 10 }
  },
  {
    id: "server4_upgrade2",
    name: "Multi-Threading",
    description: "Application Servers produce 3x more data.",
    cost: 1000000,
    purchased: false,
    unlocked: false,
    multiplier: 3,
    target: "server4",
    requiredGenerators: { server4: 25 }
  },
  {
    id: "server5_upgrade1",
    name: "Smart Routing",
    description: "Load Balancers produce 2x more data.",
    cost: 1000000,
    purchased: false,
    unlocked: false,
    multiplier: 2,
    target: "server5",
    requiredGenerators: { server5: 10 }
  },
  {
    id: "server5_upgrade2",
    name: "Advanced Balancing",
    description: "Load Balancers produce 3x more data.",
    cost: 10000000,
    purchased: false,
    unlocked: false,
    multiplier: 3,
    target: "server5",
    requiredGenerators: { server5: 25 }
  },
  {
    id: "server6_upgrade1",
    name: "GPU Acceleration",
    description: "GPU Servers produce 2x more data.",
    cost: 10000000,
    purchased: false,
    unlocked: false,
    multiplier: 2,
    target: "server6",
    requiredGenerators: { server6: 10 }
  },
  {
    id: "server6_upgrade2",
    name: "CUDA Optimization",
    description: "GPU Servers produce 3x more data.",
    cost: 100000000,
    purchased: false,
    unlocked: false,
    multiplier: 3,
    target: "server6",
    requiredGenerators: { server6: 25 }
  },

  // Global Upgrades
  {
    id: "global1",
    name: "Network Optimization",
    description: "All Servers produce 1.5x more data.",
    cost: 5000,
    purchased: false,
    unlocked: false,
    multiplier: 1.5,
    target: "all",
    requiredGenerators: { server3: 1 }
  },
  {
    id: "global2",
    name: "Fiber Optic Connections",
    description: "All Servers produce 2x more data.",
    cost: 50000,
    purchased: false,
    unlocked: false,
    multiplier: 2,
    target: "all",
    requiredGenerators: { server4: 1 }
  },
  {
    id: "global3",
    name: "AI-powered Optimization",
    description: "All Servers produce 3x more data.",
    cost: 5000000,
    purchased: false,
    unlocked: false,
    multiplier: 3,
    target: "all",
    requiredGenerators: { server6: 1 }
  },
  {
    id: "global4",
    name: "Quantum Networking",
    description: "All Servers produce 5x more data.",
    cost: 500000000,
    purchased: false,
    unlocked: false,
    multiplier: 5,
    target: "all",
    requiredGenerators: { server8: 1 }
  },
  {
    id: "global5",
    name: "Cloud Integration",
    description: "All Servers produce 8x more data.",
    cost: 5000000000,
    purchased: false,
    unlocked: false,
    multiplier: 8,
    target: "all",
    requiredGenerators: { server8: 5 }
  },
  {
    id: "global6",
    name: "Edge Computing",
    description: "All Servers produce 10x more data.",
    cost: 50000000000,
    purchased: false,
    unlocked: false,
    multiplier: 10,
    target: "all",
    requiredGenerators: { server9: 1 }
  }
];
