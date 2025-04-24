
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { useAuth } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser, joinChallenge } from '@/services/supabaseService';

const ChallengesList = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleJoinChallenge = async (challengeId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to join challenges",
        variant: "destructive",
      });
      return;
    }

    const currentUser = await getCurrentUser();
    if (currentUser) {
      await joinChallenge(challengeId);
      toast({
        title: "Challenge Joined!",
        description: "You've joined the cooperative challenge",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-game-accent mb-4">Weekly Challenges</h2>
      
      <Card className="bg-game-dark border-game-accent/20">
        <CardHeader>
          <CardTitle>Weekly Data Rush</CardTitle>
          <CardDescription>Work together to generate 1 million data points</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-game-text/70">Progress</span>
              <span className="text-sm font-medium">0%</span>
            </div>
            <Progress value={0} className="h-2" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-game-accent" />
                <span className="text-sm text-game-text/70">0 Participants</span>
              </div>
              <Button 
                size="sm" 
                onClick={() => handleJoinChallenge('weekly_data_rush')}
                className="bg-game-highlight hover:bg-game-highlight/90"
              >
                Join Challenge
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChallengesList;
