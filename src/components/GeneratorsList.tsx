
import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { formatNumber } from '../utils/formatters';
import { Generator } from '../types/game';

const GeneratorsList: React.FC = () => {
  const { generators, resources, buyGenerator, calculateGeneratorCost, calculateGeneratorOutput } = useGameStore();
  const [totalPerSecond, setTotalPerSecond] = useState(0);
  
  // Calculate total output per second
  useEffect(() => {
    let total = 0;
    generators.forEach(generator => {
      if (generator.quantity > 0) {
        total += calculateGeneratorOutput(generator);
      }
    });
    setTotalPerSecond(total);
  }, [generators, calculateGeneratorOutput]);
  
  const handleBuy = (generatorId: string) => {
    buyGenerator(generatorId);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-game-text">Servers</h2>
        <span className="text-sm text-game-accent">
          {formatNumber(totalPerSecond)}/sec
        </span>
      </div>
      
      <div className="space-y-2 max-h-[calc(100vh-350px)] overflow-y-auto pr-1">
        {generators
          .filter(generator => generator.unlocked)
          .map(generator => (
            <GeneratorItem 
              key={generator.id} 
              generator={generator} 
              onBuy={() => handleBuy(generator.id)}
              canAfford={resources >= calculateGeneratorCost(generator)}
              cost={calculateGeneratorCost(generator)}
              output={calculateGeneratorOutput(generator)}
            />
          ))}
      </div>
    </div>
  );
};

interface GeneratorItemProps {
  generator: Generator;
  onBuy: () => void;
  canAfford: boolean;
  cost: number;
  output: number;
}

const GeneratorItem: React.FC<GeneratorItemProps> = ({ generator, onBuy, canAfford, cost, output }) => {
  return (
    <div 
      className={`relative flex items-center border rounded-lg p-2 
        ${canAfford 
          ? 'bg-game-primary bg-opacity-10 border-game-primary cursor-pointer hover:bg-opacity-20' 
          : 'bg-gray-700 bg-opacity-10 border-gray-700 cursor-not-allowed'}`}
      onClick={canAfford ? onBuy : undefined}
    >
      <div className="flex-1">
        <div className="flex justify-between">
          <span className="font-medium text-sm text-game-text">
            {generator.name} 
            <span className="ml-1 text-xs text-game-accent">({generator.quantity})</span>
          </span>
          <span className="text-xs text-game-accent">{formatNumber(output)}/s</span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-game-text/70">{generator.description}</span>
          <span className={`text-xs ${canAfford ? 'text-game-accent' : 'text-gray-500'}`}>
            {formatNumber(cost)}
          </span>
        </div>
        {generator.quantity > 0 && (
          <div className="absolute top-0 right-0 -mt-1 -mr-1 bg-game-accent rounded-full w-2 h-2 animate-pulse"></div>
        )}
      </div>
    </div>
  );
};

export default GeneratorsList;
