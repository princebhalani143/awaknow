import { create } from 'zustand';
import { UserSubscription } from '../types/subscription';
import { SubscriptionService } from '../services/subscriptionService';
import { SUBSCRIPTION_PLANS } from '../config/subscriptionPlans';

interface SubscriptionState {
  subscription: UserSubscription | null;
  loading: boolean;
  limits: {
    tavusMinutes: number;
    soloSessionsToday: number | 'unlimited';
    insightsThisWeek: number | 'unlimited';
    canCreateGroupSessions: boolean;
  } | null;
  
  // Actions
  loadSubscription: (userId: string) => Promise<void>;
  updateSubscription: (userId: string, planId: string, revenueCatCustomerId?: string) => Promise<boolean>;
  refreshLimits: (userId: string) => Promise<void>;
  getCurrentPlan: () => typeof SUBSCRIPTION_PLANS[keyof typeof SUBSCRIPTION_PLANS] | null;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  subscription: null,
  loading: false,
  limits: null,

  loadSubscription: async (userId: string) => {
    set({ loading: true });
    try {
      const subscription = await SubscriptionService.getUserSubscription(userId);
      const limits = await SubscriptionService.getRemainingLimits(userId);
      
      set({ 
        subscription, 
        limits,
        loading: false 
      });
    } catch (error) {
      console.error('Error loading subscription:', error);
      set({ loading: false });
    }
  },

  updateSubscription: async (userId: string, planId: string, revenueCatCustomerId?: string) => {
    try {
      const success = await SubscriptionService.updateSubscription(userId, planId, revenueCatCustomerId);
      
      if (success) {
        // Reload subscription data
        await get().loadSubscription(userId);
      }
      
      return success;
    } catch (error) {
      console.error('Error updating subscription:', error);
      return false;
    }
  },

  refreshLimits: async (userId: string) => {
    try {
      const limits = await SubscriptionService.getRemainingLimits(userId);
      set({ limits });
    } catch (error) {
      console.error('Error refreshing limits:', error);
    }
  },

  getCurrentPlan: () => {
    const { subscription } = get();
    if (!subscription) return null;
    
    return Object.values(SUBSCRIPTION_PLANS).find(
      plan => plan.id === subscription.plan_id
    ) || null;
  },
}));