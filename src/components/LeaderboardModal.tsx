
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getLeaderboard, LeaderboardEntry } from '../services/supabaseService';
import { formatNumber } from '../utils/formatters';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (isOpen) {
        setIsLoading(true);
        const data = await getLeaderboard();
        setLeaderboard(data);
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-game-background border-game-primary sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-game-text text-center text-xl">
            Global Leaderboard
          </DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="w-full py-8 text-center">
            <p className="text-game-text">Loading leaderboard data...</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="w-full py-8 text-center">
            <p className="text-game-text">No leaderboard entries yet!</p>
            <p className="text-game-text/70 mt-2">Be the first to join!</p>
          </div>
        ) : (
          <div className="w-full">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-game-accent border-b border-game-primary/30">
                  <th className="py-2 text-left pl-2">Rank</th>
                  <th className="py-2 text-left">Player</th>
                  <th className="py-2 text-right">Data Generated</th>
                  <th className="py-2 text-right pr-2">Prestige</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr 
                    key={entry.id} 
                    className={`text-game-text border-b border-game-primary/10 
                      ${index % 2 === 0 ? 'bg-game-primary/5' : ''}`}
                  >
                    <td className="py-2 pl-2">{index + 1}</td>
                    <td className="py-2">{entry.username}</td>
                    <td className="py-2 text-right">{formatNumber(entry.total_resources_earned)}</td>
                    <td className="py-2 text-right pr-2">{entry.prestige_level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LeaderboardModal;
