
import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { formatNumber } from '../utils/formatters';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const PrestigePanel: React.FC = () => {
  const { prestige, prestigeReset, getPendingPrestigePoints, getPrestigeMultiplier } = useGameStore();
  const [isOpen, setIsOpen] = useState(false);
  
  const pendingPoints = getPendingPrestigePoints();
  const newTotal = prestige.points + pendingPoints;
  const newMultiplier = getPrestigeMultiplier(newTotal);
  
  const canPrestige = pendingPoints > 0;
  
  const handlePrestige = () => {
    if (canPrestige) {
      prestigeReset();
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div 
          className={`
            w-full p-3 rounded-lg mb-4 border-2 
            ${canPrestige 
              ? 'bg-gradient-to-r from-purple-900 to-purple-700 border-purple-500 cursor-pointer hover:brightness-110'
              : 'bg-gray-800 border-gray-700 cursor-not-allowed'
            }
          `}
        >
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-game-text">Prestige</span>
            <span className={`text-xs px-2 py-0.5 rounded ${canPrestige ? 'bg-purple-500' : 'bg-gray-700'}`}>
              +{formatNumber(pendingPoints)}
            </span>
          </div>
          
          <div className="text-xs text-game-text/80 mt-1">
            Reset your progress for permanent bonuses
          </div>
          
          <div className="flex justify-between items-center mt-1 text-xs">
            <span className="text-game-text/70">Current multiplier: x{prestige.multiplier.toFixed(1)}</span>
            {canPrestige && (
              <span className="text-green-400">Next: x{newMultiplier.toFixed(1)}</span>
            )}
          </div>
        </div>
      </DialogTrigger>
      
      <DialogContent className="bg-game-background border-game-primary">
        <DialogHeader>
          <DialogTitle className="text-game-text">Prestige Confirmation</DialogTitle>
          <DialogDescription className="text-game-text/80">
            Are you sure you want to reset your progress?
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col">
              <span className="text-game-text/70">Current points:</span>
              <span className="text-game-text font-bold">{formatNumber(prestige.points)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-game-text/70">Points to gain:</span>
              <span className="text-purple-400 font-bold">+{formatNumber(pendingPoints)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-game-text/70">Current multiplier:</span>
              <span className="text-game-text font-bold">x{prestige.multiplier.toFixed(1)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-game-text/70">New multiplier:</span>
              <span className="text-purple-400 font-bold">x{newMultiplier.toFixed(1)}</span>
            </div>
          </div>
          
          <div className="bg-gray-800 p-3 rounded-md text-xs text-game-text/80">
            <p>Prestige will reset your resources and generators, but you'll keep:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>All your research levels</li>
              <li>Premium currency</li>
              <li>Prestige points and multipliers</li>
            </ul>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            className="bg-transparent border-game-text/20 text-game-text hover:bg-game-text/10"
          >
            Cancel
          </Button>
          <Button 
            onClick={handlePrestige}
            disabled={!canPrestige}
            className={`${canPrestige ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-700'}`}
          >
            Prestige Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrestigePanel;
