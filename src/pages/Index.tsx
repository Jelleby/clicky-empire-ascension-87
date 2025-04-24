
import React from 'react';
import GameContainer from '../components/GameContainer';
import { useToast } from '@/components/ui/use-toast';
import { useEffect } from 'react';

const Index = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    // Welcome toast
    toast({
      title: "Welcome to Server Empire",
      description: "Build your server empire by clicking and upgrading!",
      duration: 5000,
    });
  }, [toast]);

  return (
    <div className="min-h-screen bg-game-background text-game-text">
      <header className="pt-6 pb-2 px-4 text-center">
        <h1 className="text-2xl font-bold text-game-accent glow-text">Server Empire</h1>
        <p className="text-sm text-game-text/70">Build your digital empire</p>
      </header>
      
      <main>
        <GameContainer />
      </main>
      
      <footer className="py-4 text-center text-xs text-game-text/50">
        <p>Tap the server to generate data!</p>
      </footer>
    </div>
  );
};

export default Index;
