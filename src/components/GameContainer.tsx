
import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import ClickArea from './ClickArea';
import ResourceDisplay from './ResourceDisplay';
import GameTabs from './GameTabs';
import PrestigePanel from './PrestigePanel';
import TutorialOverlay from './TutorialOverlay';

const GameContainer: React.FC = () => {
  const { initGame, tick } = useGameStore();
  
  // Initialize game data
  useEffect(() => {
    initGame();
  }, [initGame]);
  
  // Game tick loop
  useEffect(() => {
    // Update the game state every 100ms
    const tickInterval = setInterval(() => {
      tick(Date.now());
    }, 100);
    
    return () => clearInterval(tickInterval);
  }, [tick]);

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <TutorialOverlay />
      <ResourceDisplay />
      <ClickArea />
      <PrestigePanel />
      <GameTabs />
    </div>
  );
};

export default GameContainer;
