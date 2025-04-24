
import React, { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import GeneratorsList from './GeneratorsList';
import UpgradesList from './UpgradesList';
import ResearchPanel from './ResearchPanel';
import { Badge } from '@/components/ui/badge';
import { useGameStore } from '../store/gameStore';

const GameTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState("generators");
  const { upgrades } = useGameStore();
  
  // Count available upgrades for badge
  const availableUpgrades = upgrades.filter(u => u.unlocked && !u.purchased).length;

  return (
    <Tabs defaultValue="generators" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 mb-2 bg-game-dark">
        <TabsTrigger value="generators" className="data-[state=active]:bg-game-primary">
          Servers
        </TabsTrigger>
        <TabsTrigger value="upgrades" className="relative data-[state=active]:bg-game-primary">
          Upgrades
          {availableUpgrades > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 min-w-4 p-0 flex items-center justify-center bg-game-highlight text-[10px]">
              {availableUpgrades}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="research" className="data-[state=active]:bg-game-primary">
          Research
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="generators" className="mt-0">
        <GeneratorsList />
      </TabsContent>
      
      <TabsContent value="upgrades" className="mt-0">
        <UpgradesList />
      </TabsContent>
      
      <TabsContent value="research" className="mt-0">
        <ResearchPanel />
      </TabsContent>
    </Tabs>
  );
};

export default GameTabs;
