
import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { formatNumber } from '../utils/formatters';
import { NumberPopup } from '../types/game';

const ClickArea: React.FC = () => {
  const { clickServer, numberPopups } = useGameStore();
  const [isPressed, setIsPressed] = useState(false);
  
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Get click position for the popup
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Trigger the click action with coordinates
    clickServer(x, y);
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 100);
  };

  return (
    <div 
      className="relative w-full aspect-square max-w-[300px] mx-auto rounded-xl bg-gradient-to-br from-game-dark to-game-background border-2 border-game-primary/30 cursor-pointer overflow-hidden grid-pattern"
      onClick={handleClick}
    >
      <div 
        className={`absolute w-full h-full flex items-center justify-center transition-all duration-100 ${isPressed ? 'scale-95' : 'scale-100'}`}
      >
        <div className="relative w-16 h-16 animate-pulse-glow">
          <div className="absolute inset-0 bg-game-primary opacity-20 rounded-lg animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-game-accent" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 21H3V17H7V21Z" className="text-game-primary" fill="currentColor" />
              <path d="M14 21H10V17H14V21Z" className="text-game-primary" fill="currentColor" />
              <path d="M21 21H17V17H21V21Z" className="text-game-primary" fill="currentColor" />
              <path d="M7 14H3V10H7V14Z" className="text-game-accent" fill="currentColor" />
              <path d="M14 14H10V10H14V14Z" className="text-game-accent" fill="currentColor" />
              <path d="M21 14H17V10H21V14Z" className="text-game-accent" fill="currentColor" />
              <path d="M7 7H3V3H7V7Z" className="text-game-highlight" fill="currentColor" />
              <path d="M14 7H10V3H14V7Z" className="text-game-highlight" fill="currentColor" />
              <path d="M21 7H17V3H21V7Z" className="text-game-highlight" fill="currentColor" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Number popups */}
      {numberPopups.map((popup) => (
        <div
          key={popup.id}
          className="absolute animate-number-pop text-game-accent font-bold text-outline text-lg"
          style={{
            left: `${popup.x}px`,
            top: `${popup.y - 20}px`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          +{formatNumber(popup.value)}
        </div>
      ))}
    </div>
  );
};

export default ClickArea;
