
import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { formatNumber } from '../utils/formatters';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Research } from '../types/game';

const ResearchPanel: React.FC = () => {
  const { research, premiumCurrency, buyResearch } = useGameStore();
  const [activeTab, setActiveTab] = useState("efficiency");

  const handleBuyResearch = (researchId: string) => {
    buyResearch(researchId);
  };
  
  const efficiencyResearch = research.filter(r => r.category === 'efficiency' && r.unlocked);
  const incomeResearch = research.filter(r => r.category === 'income' && r.unlocked);
  const prestigeResearch = research.filter(r => r.category === 'prestige' && r.unlocked);

  return (
    <div className="w-full mb-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-game-text">Research</h2>
        <span className="text-sm text-game-highlight">{formatNumber(premiumCurrency)} QB</span>
      </div>
      
      <Tabs defaultValue="efficiency" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-2 bg-game-dark">
          <TabsTrigger value="efficiency" className="text-xs data-[state=active]:bg-game-primary">Efficiency</TabsTrigger>
          <TabsTrigger value="income" className="text-xs data-[state=active]:bg-game-primary">Income</TabsTrigger>
          <TabsTrigger value="prestige" className="text-xs data-[state=active]:bg-game-primary">Prestige</TabsTrigger>
        </TabsList>
        
        <TabsContent value="efficiency" className="mt-0">
          <div className="space-y-2">
            {efficiencyResearch.map(research => (
              <ResearchItem
                key={research.id}
                research={research}
                onBuy={() => handleBuyResearch(research.id)}
                canAfford={premiumCurrency >= research.cost}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="income" className="mt-0">
          <div className="space-y-2">
            {incomeResearch.map(research => (
              <ResearchItem
                key={research.id}
                research={research}
                onBuy={() => handleBuyResearch(research.id)}
                canAfford={premiumCurrency >= research.cost}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="prestige" className="mt-0">
          <div className="space-y-2">
            {prestigeResearch.map(research => (
              <ResearchItem
                key={research.id}
                research={research}
                onBuy={() => handleBuyResearch(research.id)}
                canAfford={premiumCurrency >= research.cost}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ResearchItemProps {
  research: Research;
  onBuy: () => void;
  canAfford: boolean;
}

const ResearchItem: React.FC<ResearchItemProps> = ({ research, onBuy, canAfford }) => {
  const maxedOut = research.level >= research.maxLevel;
  
  let progressPercent = (research.level / research.maxLevel) * 100;
  
  return (
    <div className="border border-game-primary/30 rounded-lg p-2 bg-game-dark">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-game-text">{research.name}</span>
        <div className="flex items-center gap-1">
          <span className="text-xs text-game-text/70">Lv {research.level}/{research.maxLevel}</span>
          {!maxedOut && (
            <button
              className={`px-2 py-0.5 rounded text-xs ${canAfford && !maxedOut ? 
                'bg-game-highlight text-white cursor-pointer' : 
                'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
              onClick={canAfford && !maxedOut ? onBuy : undefined}
              disabled={!canAfford || maxedOut}
            >
              {formatNumber(research.cost)} QB
            </button>
          )}
        </div>
      </div>
      
      <div className="text-xs text-game-text/80 mt-1">
        {research.effectDescription}
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-700 rounded-full mt-2">
        <div 
          className="h-full bg-gradient-to-r from-game-accent to-game-highlight rounded-full"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ResearchPanel;
