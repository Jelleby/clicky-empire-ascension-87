
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp } from '../services/supabaseService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'register'>('login');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (authType === 'login') {
        const user = await signIn(email, password);
        if (user) onClose();
      } else {
        const user = await signUp(email, password);
        if (user) onClose();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-game-background border-game-primary sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-game-text text-center text-xl">
            {authType === 'login' ? 'Sign In' : 'Create Account'}
          </DialogTitle>
          <DialogDescription className="text-game-text/70 text-center">
            {authType === 'login' 
              ? 'Sign in to save your progress to the cloud!' 
              : 'Create an account to save your progress and join the leaderboard!'}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={authType} onValueChange={(v) => setAuthType(v as 'login' | 'register')} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4 bg-game-dark">
            <TabsTrigger value="login" className="data-[state=active]:bg-game-primary">
              Login
            </TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-game-primary">
              Register
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="mt-0">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-game-text">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    className="bg-game-dark text-game-text"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-game-text">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="bg-game-dark text-game-text"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="bg-game-accent hover:bg-game-accent/90 mt-2"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="register" className="mt-0">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="reg-email" className="text-game-text">Email</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    className="bg-game-dark text-game-text"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reg-password" className="text-game-text">Password</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="bg-game-dark text-game-text"
                  />
                  <p className="text-xs text-game-text/70">
                    Password must be at least 6 characters
                  </p>
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="bg-game-accent hover:bg-game-accent/90 mt-2"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
