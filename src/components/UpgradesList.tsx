
import React from 'react';
import { useGameStore } from '../store/gameStore';
import { formatNumber } from '../utils/formatters';
import { Upgrade } from '../types/game';

const UpgradesList: React.FC = () => {
  const { upgrades, resources, buyUpgrade } = useGameStore();
  
  const availableUpgrades = upgrades.filter(u => u.unlocked && !u.purchased);
  
  if (availableUpgrades.length === 0) {
    return null;
  }

  return (
    <div className="w-full mb-4">
      <h2 className="text-lg font-bold text-game-text mb-2">Upgrades</h2>
      <div className="grid grid-cols-2 gap-2">
        {availableUpgrades.map(upgrade => (
          <UpgradeItem 
            key={upgrade.id} 
            upgrade={upgrade} 
            onBuy={() => buyUpgrade(upgrade.id)}
            canAfford={resources >= upgrade.cost}
          />
        ))}
      </div>
    </div>
  );
};

interface UpgradeItemProps {
  upgrade: Upgrade;
  onBuy: () => void;
  canAfford: boolean;
}

const UpgradeItem: React.FC<UpgradeItemProps> = ({ upgrade, onBuy, canAfford }) => {
  // Determine the color based on the upgrade type
  let bgColorClass = '';
  let borderColorClass = '';
  
  if (upgrade.target === 'click') {
    bgColorClass = 'from-blue-900 to-blue-700';
    borderColorClass = 'border-blue-500';
  } else if (upgrade.target === 'all') {
    bgColorClass = 'from-purple-900 to-purple-700';
    borderColorClass = 'border-purple-500';
  } else {
    bgColorClass = 'from-green-900 to-green-700';
    borderColorClass = 'border-green-500';
  }

  return (
    <div 
      className={`flex flex-col justify-between border rounded-lg p-2 h-24
        bg-gradient-to-br ${bgColorClass}
        ${canAfford 
          ? `${borderColorClass} cursor-pointer hover:brightness-110` 
          : 'border-gray-700 opacity-70 cursor-not-allowed'}`}
      onClick={canAfford ? onBuy : undefined}
    >
      <div className="text-xs font-medium text-game-text">{upgrade.name}</div>
      <div className="text-xs text-game-text/80 line-clamp-2">{upgrade.description}</div>
      <div className="text-right text-xs text-game-accent/90">{formatNumber(upgrade.cost)}</div>
    </div>
  );
};

export default UpgradesList;
