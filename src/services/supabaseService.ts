
import { createClient } from '@supabase/supabase-js';
import { GameState } from '../types/game';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    console.error('Error signing in:', error.message);
    return null;
  }
  
  return data.user;
};

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });
  
  if (error) {
    console.error('Error signing up:', error.message);
    return null;
  }
  
  return data.user;
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return !error;
};

export const saveGameData = async (gameData: {
  user_id: string;
  resources: number;
  premium_currency: number;
  generators: string;
  upgrades: string;
  research: string;
  prestige: string;
  total_resources_earned: number;
  last_save: string;
  click_power: number;
  offline_production_enabled: boolean;
}) => {
  try {
    const { error } = await supabase
      .from('game_data')
      .upsert(gameData, { onConflict: 'user_id' });
      
    if (error) {
      console.error('Error saving game data:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error saving game data:', error);
    return false;
  }
};

export const loadGameData = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('game_data')
      .select('*')
      .eq('user_id', user.id)
      .single();
      
    if (error) {
      console.error('Error loading game data:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error loading game data:', error);
    return null;
  }
};

export const updateLeaderboard = async (totalResourcesEarned: number, prestigeLevel: number) => {
  try {
    const user = await getCurrentUser();
    if (!user) return;

    // Extract username from email
    const username = user.email ? user.email.split('@')[0] : 'Anonymous';
    
    const { error } = await supabase
      .from('leaderboard')
      .upsert({ 
        user_id: user.id, 
        username: username,
        total_resources_earned: totalResourcesEarned,
        prestige_level: prestigeLevel
      }, { onConflict: 'user_id' });
      
    if (error) {
      console.error('Error updating leaderboard:', error);
    }
  } catch (error) {
    console.error('Error updating leaderboard:', error);
  }
};

export interface LeaderboardEntry {
  id: string;
  username: string;
  total_resources_earned: number;
  prestige_level: number;
}

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('id, username, total_resources_earned, prestige_level')
      .order('total_resources_earned', { ascending: false })
      .limit(20);
      
    if (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};
