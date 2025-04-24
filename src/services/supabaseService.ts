
import { createClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

// Get Supabase URL and anon key from environment variables
// Provide fallbacks for development to prevent errors
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface GameSaveData {
  id?: string;
  user_id: string;
  resources: number;
  premium_currency: number;
  generators: string; // JSON stringified
  upgrades: string; // JSON stringified
  research: string; // JSON stringified
  prestige: string; // JSON stringified
  total_resources_earned: number;
  last_save: string;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  total_resources_earned: number;
  prestige_level: number;
  last_active: string;
}

// User authentication functions
export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    
    toast({
      title: "Account created",
      description: "Please check your email to verify your account",
    });
    
    return data;
  } catch (error: any) {
    toast({
      title: "Error signing up",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    toast({
      title: "Welcome back!",
      description: "You've successfully signed in",
    });
    
    return data;
  } catch (error: any) {
    toast({
      title: "Error signing in",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    toast({
      title: "Signed out",
      description: "You've been successfully signed out",
    });
    
    return true;
  } catch (error: any) {
    toast({
      title: "Error signing out",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};

// Game data functions
export const saveGameData = async (gameData: Omit<GameSaveData, 'id'>) => {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    // Check if we already have a save for this user
    const { data: existingSave } = await supabase
      .from('game_saves')
      .select('id')
      .eq('user_id', user.id)
      .single();

    let result;
    
    if (existingSave) {
      // Update existing save
      result = await supabase
        .from('game_saves')
        .update(gameData)
        .eq('id', existingSave.id)
        .select()
        .single();
    } else {
      // Create new save
      result = await supabase
        .from('game_saves')
        .insert(gameData)
        .select()
        .single();
    }

    if (result.error) throw result.error;
    
    return result.data;
  } catch (error: any) {
    console.error("Error saving game data:", error);
    toast({
      title: "Error saving game",
      description: "Your game progress couldn't be saved to the cloud",
      variant: "destructive",
    });
    return null;
  }
};

export const loadGameData = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('game_saves')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      // If the error is that no rows were returned, that's fine
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    
    return data as GameSaveData;
  } catch (error: any) {
    console.error("Error loading game data:", error);
    toast({
      title: "Error loading game",
      description: "Your game progress couldn't be loaded from the cloud",
      variant: "destructive",
    });
    return null;
  }
};

export const updateLeaderboard = async (totalResourcesEarned: number, prestigeLevel: number) => {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    // Get user profile for username
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single();

    const username = profile?.username || user.email?.split('@')[0] || 'Anonymous';

    // Update leaderboard entry
    const { data, error } = await supabase
      .from('leaderboard')
      .upsert({
        user_id: user.id,
        username,
        total_resources_earned: totalResourcesEarned,
        prestige_level: prestigeLevel,
        last_active: new Date().toISOString(),
      }, { onConflict: 'user_id' })
      .select();

    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error("Error updating leaderboard:", error);
    return null;
  }
};

export const getLeaderboard = async () => {
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('total_resources_earned', { ascending: false })
      .limit(100);

    if (error) throw error;
    
    return data as LeaderboardEntry[];
  } catch (error: any) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
};

export default supabase;
