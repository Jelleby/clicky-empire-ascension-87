
import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Award, Trophy, Star, Gamepad2 } from 'lucide-react';
import { Achievement } from '../types/achievements';
import { Progress } from '@/components/ui/progress';

const iconMap = {
  'award': Award,
  'trophy': Trophy,
  'star': Star,
  'gamepad': Gamepad2
};

const AchievementsList: React.FC = () => {
  const { achievements } = useGameStore();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-game-text">Achievements</h2>
      <div className="grid gap-4">
        {achievements.map((achievement) => {
          const Icon = iconMap[achievement.icon as keyof typeof iconMap];
          const progress = Math.min(100, (achievement.progress / achievement.requirement.value) * 100);
          
          return (
            <div 
              key={achievement.id}
              className={`p-4 rounded-lg border ${
                achievement.unlocked 
                  ? 'bg-game-highlight/20 border-game-highlight' 
                  : 'bg-game-dark border-game-border'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${
                  achievement.unlocked ? 'bg-game-highlight text-black' : 'bg-game-border/20'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-game-text">{achievement.name}</h3>
                  <p className="text-sm text-game-text/70">{achievement.description}</p>
                  
                  <div className="mt-2 space-y-1">
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-game-text/50">
                      Progress: {Math.floor(progress)}%
                    </p>
                  </div>
                  
                  {achievement.unlocked && (
                    <div className="mt-2 text-sm text-game-accent">
                      Reward: {achievement.reward.value}x {achievement.reward.type}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementsList;
