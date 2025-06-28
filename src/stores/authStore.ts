import { create } from 'zustand';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  updateUserProfile: (updates) => {
    const currentUser = get().user;
    if (currentUser) {
      set({ user: { ...currentUser, ...updates } });
    }
  },
  signOut: async () => {
    try {
      // Clear user state immediately for better UX
      set({ user: null, loading: false });
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        // Even if there's an error, we've already cleared the local state
        // This ensures the user appears logged out in the UI
      }
      
      // Clear any local storage or session data if needed
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
      
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
      // Still clear the user state even if there's an error
      set({ user: null, loading: false });
    }
  },
}));