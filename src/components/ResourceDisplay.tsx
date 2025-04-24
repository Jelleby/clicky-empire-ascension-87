
import React from 'react';
import { useGameStore } from '../store/gameStore';
import { formatNumber } from '../utils/formatters';

const ResourceDisplay: React.FC = () => {
  const { resources, premiumCurrency, prestige, clickPower, getUpgradeMultiplier, getResearchMultiplier } = useGameStore();
  
  // Calculate effective click power with all multipliers
  const effectiveClickPower = clickPower 
    * getUpgradeMultiplier('click') 
    * prestige.multiplier
    * getResearchMultiplier('income');

  return (
    <div className="w-full flex flex-col gap-2 mb-4">
      {/* Main resource */}
      <div className="bg-gradient-to-r from-game-secondary to-game-primary p-3 rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <span className="text-sm text-game-text/70">Data Points</span>
          <div className="flex items-center">
            <span className="bg-black/20 px-2 py-1 rounded-md text-game-text font-medium">
              +{formatNumber(effectiveClickPower)}/click
            </span>
          </div>
        </div>
        <div className="text-2xl font-bold text-game-text num-format glow-text">
          {formatNumber(resources)}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {/* Premium currency */}
        <div className="bg-gradient-to-r from-game-highlight to-game-accent p-3 rounded-lg shadow-md">
          <span className="text-sm text-game-text/70">Quantum Bits</span>
          <div className="text-xl font-bold text-game-text num-format">
            {formatNumber(premiumCurrency)}
          </div>
        </div>
        
        {/* Prestige points */}
        <div className="bg-gradient-to-br from-purple-900 to-purple-600 p-3 rounded-lg shadow-md">
          <span className="text-sm text-game-text/70">Prestige Level</span>
          <div className="text-xl font-bold text-game-text flex items-center gap-1 num-format">
            {prestige.level} 
            <span className="text-xs font-normal">
              ({formatNumber(prestige.points)} pts)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDisplay;
