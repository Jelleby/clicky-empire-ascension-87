import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import ClickArea from './ClickArea';
import ResourceDisplay from './ResourceDisplay';
import GameTabs from './GameTabs';
import PrestigePanel from './PrestigePanel';
import TutorialOverlay from './TutorialOverlay';
import AuthModal from './AuthModal';
import LeaderboardModal from './LeaderboardModal';
import { Button } from '@/components/ui/button';
import { 
  getCurrentUser, 
  saveGameData, 
  loadGameData, 
  updateLeaderboard, 
  signOut 
} from '../services/supabaseService';
import { useToast } from '@/components/ui/use-toast';
import { Database } from 'lucide-react';

const GameContainer: React.FC = () => {
  const { 
    initGame, 
    tick, 
    resources, 
    premiumCurrency, 
    generators, 
    upgrades, 
    research, 
    prestige, 
    totalResourcesEarned,
    loadGameState 
  } = useGameStore();
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [clickPower, setClickPower] = useState(1);
  const [offlineProductionEnabled, setOfflineProductionEnabled] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      setIsLoggedIn(!!user);
      if (user?.email) {
        setUsername(user.email.split('@')[0]);
      }
    };
    
    checkAuth();
  }, []);
  
  useEffect(() => {
    const initializeGame = async () => {
      initGame();
      
      const user = await getCurrentUser();
      if (user) {
        const savedData = await loadGameData();
        
        if (savedData) {
          try {
            const gameState = {
              resources: savedData.resources,
              premiumCurrency: savedData.premium_currency,
              generators: JSON.parse(savedData.generators),
              upgrades: JSON.parse(savedData.upgrades),
              research: JSON.parse(savedData.research),
              prestige: JSON.parse(savedData.prestige),
              totalResourcesEarned: savedData.total_resources_earned,
              lastTickTimestamp: Date.now(),
              clickPower: savedData.click_power || 1,
              offlineProductionEnabled: savedData.offline_production_enabled !== undefined 
                ? savedData.offline_production_enabled 
                : true
            };
            
            loadGameState(gameState);
            
            toast({
              title: "Game loaded from cloud",
              description: "Your progress has been restored",
            });
            
            setLastSaved(new Date(savedData.last_save));
          } catch (error) {
            console.error("Error parsing saved game data:", error);
            toast({
              title: "Error loading game",
              description: "There was an error loading your saved game",
              variant: "destructive",
            });
          }
        }
      }
    };
    
    initializeGame();
  }, [initGame, loadGameState, toast]);
  
  useEffect(() => {
    const tickInterval = setInterval(() => {
      tick(Date.now());
    }, 100);
    
    return () => clearInterval(tickInterval);
  }, [tick]);
  
  useEffect(() => {
    if (!isLoggedIn) return;
    
    const saveInterval = setInterval(async () => {
      const user = await getCurrentUser();
      
      if (user) {
        const gameData = {
          user_id: user.id,
          resources: resources,
          premium_currency: premiumCurrency,
          generators: JSON.stringify(generators),
          upgrades: JSON.stringify(upgrades),
          research: JSON.stringify(research),
          prestige: JSON.stringify(prestige),
          total_resources_earned: totalResourcesEarned,
          last_save: new Date().toISOString(),
          click_power: clickPower,
          offline_production_enabled: offlineProductionEnabled
        };
        
        const saved = await saveGameData(gameData);
        if (saved) {
          setLastSaved(new Date());
        }
        
        await updateLeaderboard(totalResourcesEarned, prestige.level);
      }
    }, 30000);
    
    return () => clearInterval(saveInterval);
  }, [
    isLoggedIn, resources, premiumCurrency, generators, 
    upgrades, research, prestige, totalResourcesEarned,
    clickPower, offlineProductionEnabled
  ]);
  
  const handleManualSave = async () => {
    const user = await getCurrentUser();
    
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    
    const gameData = {
      user_id: user.id,
      resources: resources,
      premium_currency: premiumCurrency,
      generators: JSON.stringify(generators),
      upgrades: JSON.stringify(upgrades),
      research: JSON.stringify(research),
      prestige: JSON.stringify(prestige),
      total_resources_earned: totalResourcesEarned,
      last_save: new Date().toISOString(),
      click_power: clickPower,
      offline_production_enabled: offlineProductionEnabled
    };
    
    const saved = await saveGameData(gameData);
    if (saved) {
      toast({
        title: "Game saved!",
        description: "Your progress has been saved to the cloud",
      });
      setLastSaved(new Date());
      
      await updateLeaderboard(totalResourcesEarned, prestige.level);
    }
  };
  
  const handleLogout = async () => {
    await handleManualSave();
    
    const success = await signOut();
    if (success) {
      setIsLoggedIn(false);
      setUsername(null);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <TutorialOverlay />
      
      <div className="flex justify-between items-center mb-4 bg-game-dark p-2 rounded-lg">
        <div className="text-sm text-game-text">
          {isLoggedIn ? (
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4 text-game-accent" />
              <span>
                Hi, {username}!
                {lastSaved && (
                  <span className="text-xs text-game-text/70 ml-2">
                    Saved: {lastSaved.toLocaleTimeString()}
                  </span>
                )}
              </span>
            </div>
          ) : (
            <span className="text-game-text/70">Playing offline</span>
          )}
        </div>
        
        <div className="flex space-x-2">
          {isLoggedIn ? (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs bg-transparent border-game-text/20 text-game-text hover:bg-game-text/10"
                onClick={handleManualSave}
              >
                Save
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs bg-transparent border-game-text/20 text-game-text hover:bg-game-text/10"
                onClick={() => setIsLeaderboardOpen(true)}
              >
                Leaderboard
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs bg-transparent border-game-text/20 text-game-text hover:bg-game-text/10"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs bg-game-highlight hover:bg-game-highlight/90 text-game-text"
              onClick={() => setIsAuthModalOpen(true)}
            >
              Login/Register
            </Button>
          )}
        </div>
      </div>
      
      <ResourceDisplay />
      <ClickArea />
      <PrestigePanel />
      <GameTabs />
      
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <LeaderboardModal isOpen={isLeaderboardOpen} onClose={() => setIsLeaderboardOpen(false)} />
    </div>
  );
};

export default GameContainer;
