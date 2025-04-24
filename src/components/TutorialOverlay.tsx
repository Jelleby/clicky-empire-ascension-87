
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const TutorialOverlay: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [step, setStep] = useState(0);

  const tutorialSteps = [
    {
      title: "Welcome to Server Empire!",
      content: "Build your digital empire by managing servers and generating data. Let's get started!"
    },
    {
      title: "Click to Generate",
      content: "Start by clicking the server to generate data points. Each click generates resources!"
    },
    {
      title: "Buy Servers",
      content: "Use your data points to purchase servers. They'll generate data automatically even when you're away!"
    },
    {
      title: "Research & Upgrades",
      content: "Spend your resources on upgrades to increase production. Research using Quantum Bits (QB) persists through prestige!"
    },
    {
      title: "Prestige System",
      content: "Once you've generated enough data, prestige to reset with powerful bonuses. Your research progress is kept!"
    }
  ];

  const handleNext = () => {
    if (step < tutorialSteps.length - 1) {
      setStep(step + 1);
    } else {
      setIsOpen(false);
    }
  };

  const handleSkip = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-game-background border-game-primary">
        <DialogHeader>
          <DialogTitle className="text-game-text">{tutorialSteps[step].title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-game-text/80">{tutorialSteps[step].content}</p>
        </div>
        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={handleSkip} 
            className="bg-transparent border-game-text/20 text-game-text hover:bg-game-text/10">
            Skip Tutorial
          </Button>
          <Button onClick={handleNext} 
            className="bg-game-highlight hover:bg-game-highlight/90">
            {step === tutorialSteps.length - 1 ? "Get Started!" : "Next"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TutorialOverlay;
