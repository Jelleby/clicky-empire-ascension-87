
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GeneratorsList from './GeneratorsList';
import UpgradesList from './UpgradesList';
import ResearchPanel from './ResearchPanel';
import AchievementsList from './AchievementsList';
import ChallengesList from './ChallengesList';

const GameTabs: React.FC = () => {
  return (
    <Tabs defaultValue="generators" className="w-full">
      <TabsList className="grid w-full grid-cols-6 mb-4">
        <TabsTrigger value="generators">Generators</TabsTrigger>
        <TabsTrigger value="upgrades">Upgrades</TabsTrigger>
        <TabsTrigger value="research">Research</TabsTrigger>
        <TabsTrigger value="achievements">Achievements</TabsTrigger>
        <TabsTrigger value="challenges">Challenges</TabsTrigger>
        <TabsTrigger value="stats">Stats</TabsTrigger>
      </TabsList>
      
      <TabsContent value="generators">
        <GeneratorsList />
      </TabsContent>
      
      <TabsContent value="upgrades">
        <UpgradesList />
      </TabsContent>
      
      <TabsContent value="research">
        <ResearchPanel />
      </TabsContent>
      
      <TabsContent value="achievements">
        <AchievementsList />
      </TabsContent>
      
      <TabsContent value="challenges">
        <ChallengesList />
      </TabsContent>
      
      <TabsContent value="stats">
        {/* Stats content */}
      </TabsContent>
    </Tabs>
  );
};

export default GameTabs;
