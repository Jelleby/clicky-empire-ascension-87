import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { GameState, Generator, NumberPopup, Upgrade, Achievement } from '../types/game';
import { initialGenerators } from '../data/generators';
import { initialUpgrades } from '../data/upgrades';
import { initialResearch } from '../data/research';
import { initialAchievements } from '../data/achievements';
import { formatNumber } from '../utils/formatters';
import { toast } from '@/hooks/use-toast';

interface GameStore extends GameState {
  // Actions
  initGame: () => void;
  tick: (currentTime: number) => void;
  clickServer: (x?: number, y?: number) => void;
  buyGenerator: (generatorId: string) => boolean;
  buyUpgrade: (upgradeId: string) => boolean;
  buyResearch: (researchId: string) => boolean;
  prestigeReset: () => void;
  loadGameState: (state: GameState) => void;
  
  // UI State
  numberPopups: NumberPopup[];
  addNumberPopup: (value: number, x: number, y: number) => void;
  removeNumberPopup: (id: string) => void;
  
  // Calculators
  calculateGeneratorCost: (generator: Generator) => number;
  calculateGeneratorOutput: (generator: Generator) => number;
  calculateOfflineProduction: (elapsedTimeInSeconds: number) => number;
  getUpgradeMultiplier: (targetType: string) => number;
  getResearchMultiplier: (category: string) => number;
  getPendingPrestigePoints: () => number;
  getPrestigeMultiplier: (points: number) => number;
  
  achievements: Achievement[];
  checkAchievements: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      resources: 0,
      premiumCurrency: 0,
      clickPower: 1,
      generators: initialGenerators,
      upgrades: initialUpgrades,
      research: initialResearch,
      prestige: {
        level: 0,
        pendingPoints: 0,
        points: 0,
        multiplier: 1,
      },
      totalResourcesEarned: 0,
      lastTickTimestamp: Date.now(),
      offlineProductionEnabled: true,
      numberPopups: [],
      achievements: initialAchievements,
      
      initGame: () => {
        const currentTime = Date.now();
        const lastTickTime = get().lastTickTimestamp;
        
        // Handle offline production
        if (get().offlineProductionEnabled && lastTickTime > 0) {
          const elapsedSeconds = Math.floor((currentTime - lastTickTime) / 1000);
          if (elapsedSeconds > 5) { // Only calculate if more than 5 seconds passed
            const offlineProduction = get().calculateOfflineProduction(elapsedSeconds);
            
            if (offlineProduction > 0) {
              set(state => ({
                resources: state.resources + offlineProduction,
                totalResourcesEarned: state.totalResourcesEarned + offlineProduction
              }));
            }
          }
        }
        
        set({ lastTickTimestamp: currentTime });
      },
      
      loadGameState: (state: GameState) => {
        set({
          ...state,
          numberPopups: []
        });
      },
      
      tick: (currentTime: number) => {
        const state = get();
        const elapsedMs = currentTime - state.lastTickTimestamp;
        
        if (elapsedMs < 50) return; // Don't update if less than 50ms passed
        
        const elapsedSeconds = elapsedMs / 1000;
        let newResources = state.resources;
        let productionThisTick = 0;
        
        // Calculate production from all generators
        state.generators.forEach(generator => {
          if (generator.quantity > 0) {
            const output = state.calculateGeneratorOutput(generator) * elapsedSeconds;
            newResources += output;
            productionThisTick += output;
          }
        });
        
        // Update prestige points
        const pendingPoints = state.getPendingPrestigePoints();
        
        set({
          resources: newResources,
          totalResourcesEarned: state.totalResourcesEarned + productionThisTick,
          lastTickTimestamp: currentTime,
          prestige: {
            ...state.prestige,
            pendingPoints: pendingPoints
          }
        });
        
        // Check for newly unlocked upgrades and generators
        const updatedGenerators = [...state.generators].map(generator => {
          if (!generator.unlocked && generator.unlockCost && newResources >= generator.unlockCost) {
            return { ...generator, unlocked: true };
          }
          return generator;
        });
        
        const updatedUpgrades = [...state.upgrades].map(upgrade => {
          if (!upgrade.unlocked) {
            let shouldUnlock = newResources >= upgrade.cost * 0.5;
            
            // Check generator requirements if any
            if (shouldUnlock && upgrade.requiredGenerators) {
              shouldUnlock = Object.entries(upgrade.requiredGenerators).every(([genId, quantity]) => {
                const gen = state.generators.find(g => g.id === genId);
                return gen && gen.quantity >= quantity;
              });
            }
            
            if (shouldUnlock) {
              return { ...upgrade, unlocked: true };
            }
          }
          return upgrade;
        });
        
        if (JSON.stringify(updatedGenerators) !== JSON.stringify(state.generators) || 
            JSON.stringify(updatedUpgrades) !== JSON.stringify(state.upgrades)) {
          set({
            generators: updatedGenerators,
            upgrades: updatedUpgrades
          });
        }
        
        get().checkAchievements();
      },
      
      clickServer: (x, y) => {
        const state = get();
        const baseClick = state.clickPower;
        const clickMultiplier = state.getUpgradeMultiplier('click');
        const prestigeMultiplier = state.prestige.multiplier;
        const researchMultiplier = state.getResearchMultiplier('income');
        
        const clickValue = Math.floor(baseClick * clickMultiplier * prestigeMultiplier * researchMultiplier);
        
        // Add a number popup if coordinates provided
        if (typeof x === 'number' && typeof y === 'number') {
          state.addNumberPopup(clickValue, x, y);
        }
        
        set(state => ({
          resources: state.resources + clickValue,
          totalResourcesEarned: state.totalResourcesEarned + clickValue
        }));
        
        get().checkAchievements();
      },
      
      buyGenerator: (generatorId: string) => {
        const state = get();
        const generator = state.generators.find(g => g.id === generatorId);
        
        if (!generator || !generator.unlocked) return false;
        
        const cost = state.calculateGeneratorCost(generator);
        if (state.resources < cost) return false;
        
        const updatedGenerators = state.generators.map(g => {
          if (g.id === generatorId) {
            return { ...g, quantity: g.quantity + 1 };
          }
          return g;
        });
        
        set({
          resources: state.resources - cost,
          generators: updatedGenerators
        });
        
        return true;
      },
      
      buyUpgrade: (upgradeId: string) => {
        const state = get();
        const upgrade = state.upgrades.find(u => u.id === upgradeId);
        
        if (!upgrade || !upgrade.unlocked || upgrade.purchased || state.resources < upgrade.cost) {
          return false;
        }
        
        const updatedUpgrades = state.upgrades.map(u => {
          if (u.id === upgradeId) {
            return { ...u, purchased: true };
          }
          return u;
        });
        
        set({
          resources: state.resources - upgrade.cost,
          upgrades: updatedUpgrades
        });
        
        return true;
      },
      
      buyResearch: (researchId: string) => {
        const state = get();
        const research = state.research.find(r => r.id === researchId);
        
        if (!research || !research.unlocked || research.level >= research.maxLevel || 
            state.premiumCurrency < research.cost) {
          return false;
        }
        
        const updatedResearch = state.research.map(r => {
          if (r.id === researchId) {
            return { ...r, level: r.level + 1 };
          }
          return r;
        });
        
        set({
          premiumCurrency: state.premiumCurrency - research.cost,
          research: updatedResearch
        });
        
        return true;
      },
      
      prestigeReset: () => {
        const state = get();
        const currentPoints = state.prestige.points;
        const pendingPoints = state.prestige.pendingPoints;
        const newPoints = currentPoints + pendingPoints;
        const newMultiplier = state.getPrestigeMultiplier(newPoints);
        
        // Keep research as it persists across prestiges
        const currentResearch = state.research;
        
        // Reset generators but keep them unlocked if they were unlocked before
        const resetGenerators = initialGenerators.map(gen => {
          const previousGen = state.generators.find(g => g.id === gen.id);
          return {
            ...gen,
            unlocked: previousGen ? previousGen.unlocked : gen.unlocked
          };
        });
        
        // Reset upgrades
        const resetUpgrades = initialUpgrades.map(upgrade => ({
          ...upgrade,
          purchased: false,
          unlocked: false
        }));
        
        set({
          resources: 0,
          clickPower: 1,
          generators: resetGenerators,
          upgrades: resetUpgrades,
          research: currentResearch,
          prestige: {
            level: state.prestige.level + 1,
            points: newPoints,
            pendingPoints: 0,
            multiplier: newMultiplier
          },
          totalResourcesEarned: 0,
          lastTickTimestamp: Date.now()
        });
        
        return true;
      },
      
      addNumberPopup: (value, x, y) => {
        const popup: NumberPopup = {
          id: `popup-${Date.now()}-${Math.random()}`,
          value,
          x,
          y,
          timestamp: Date.now()
        };
        
        set(state => ({
          numberPopups: [...state.numberPopups, popup].slice(-20) // Limit to 20 popups
        }));
        
        // Auto-remove after animation completes
        setTimeout(() => {
          get().removeNumberPopup(popup.id);
        }, 800);
      },
      
      removeNumberPopup: (id) => {
        set(state => ({
          numberPopups: state.numberPopups.filter(popup => popup.id !== id)
        }));
      },
      
      calculateGeneratorCost: (generator) => {
        // Cost formula: baseCost * (1.15 ^ quantity)
        return Math.floor(generator.baseCost * Math.pow(1.15, generator.quantity));
      },
      
      calculateGeneratorOutput: (generator) => {
        const state = get();
        const baseOutput = generator.baseOutput * generator.quantity;
        const upgradeMultiplier = state.getUpgradeMultiplier(generator.id);
        const allGeneratorsMultiplier = state.getUpgradeMultiplier('all');
        const prestigeMultiplier = state.prestige.multiplier;
        const researchMultiplier = state.getResearchMultiplier('efficiency');
        
        return baseOutput * upgradeMultiplier * allGeneratorsMultiplier * prestigeMultiplier * researchMultiplier;
      },
      
      calculateOfflineProduction: (elapsedTimeInSeconds) => {
        const state = get();
        // Limit offline production to 8 hours max
        const maxOfflineSeconds = 8 * 60 * 60;
        const cappedElapsedTime = Math.min(elapsedTimeInSeconds, maxOfflineSeconds);
        
        let totalProduction = 0;
        
        // Calculate production from each generator
        state.generators.forEach(generator => {
          if (generator.quantity > 0) {
            // Apply 50% efficiency to offline production
            totalProduction += state.calculateGeneratorOutput(generator) * cappedElapsedTime * 0.5;
          }
        });
        
        return Math.floor(totalProduction);
      },
      
      getUpgradeMultiplier: (targetType) => {
        const state = get();
        let multiplier = 1;
        
        // Apply upgrade effects
        state.upgrades.forEach(upgrade => {
          if (upgrade.purchased && (upgrade.target === targetType || upgrade.target === 'all')) {
            multiplier *= upgrade.multiplier;
          }
        });
        
        return multiplier;
      },
      
      getResearchMultiplier: (category) => {
        const state = get();
        let multiplier = 1;
        
        // Apply research effects based on category
        state.research.forEach(research => {
          if (research.level > 0 && research.category === category) {
            // Research effect: baseEffect * level
            multiplier *= 1 + (research.baseEffect * research.level);
          }
        });
        
        return multiplier;
      },
      
      getPendingPrestigePoints: () => {
        const state = get();
        // Formula: sqrt(totalResourcesEarned / 1e12)
        const points = Math.floor(Math.sqrt(state.totalResourcesEarned / 1e12));
        return Math.max(0, points);
      },
      
      getPrestigeMultiplier: (points) => {
        // Formula: 1 + points * 0.1
        return 1 + points * 0.1;
      },
      
      checkAchievements: () => {
        const state = get();
        const updatedAchievements = state.achievements.map(achievement => {
          if (achievement.unlocked) return achievement;
          
          let progress = 0;
          switch (achievement.requirement.type) {
            case 'resources':
              progress = state.totalResourcesEarned;
              break;
            case 'generators':
              progress = state.generators.reduce((sum, gen) => sum + gen.quantity, 0);
              break;
            case 'prestige':
              progress = state.prestige.level;
              break;
            case 'upgrades':
              progress = state.upgrades.filter(u => u.purchased).length;
              break;
          }
          
          const shouldUnlock = progress >= achievement.requirement.value;
          
          if (shouldUnlock && !achievement.unlocked) {
            // Apply reward
            switch (achievement.reward.type) {
              case 'multiplier':
                // This will be applied in click and generator calculations
                break;
              case 'premium':
                set(state => ({
                  premiumCurrency: state.premiumCurrency + achievement.reward.value
                }));
                break;
            }
            
            // Show toast
            toast({
              title: "Achievement Unlocked!",
              description: achievement.name,
            });
          }
          
          return {
            ...achievement,
            progress,
            unlocked: shouldUnlock
          };
        });
        
        set({ achievements: updatedAchievements });
      }
    }),
    {
      name: 'server-empire-game',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
