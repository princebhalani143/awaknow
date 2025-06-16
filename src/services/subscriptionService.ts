import { supabase } from '../lib/supabase';
import { UserSubscription } from '../types/subscription';
import { SUBSCRIPTION_PLANS, getPlanById } from '../config/subscriptionPlans';

export class SubscriptionService {
  static async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      // Get the most recent subscription for the user to handle multiple records
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching subscription:', error);
        return null;
      }

      // If no subscription found, create a default free subscription
      if (!data || data.length === 0) {
        return await this.createDefaultSubscription(userId);
      }

      return data[0];
    } catch (error) {
      console.error('Error in getUserSubscription:', error);
      return null;
    }
  }

  private static async createDefaultSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      const freePlan = getPlanById('awaknow_free');
      if (!freePlan) {
        console.error('Free plan not found');
        return null;
      }

      const defaultSubscription = {
        user_id: userId,
        plan_id: 'awaknow_free',
        plan_name: freePlan.displayName,
        status: 'active',
        tavus_minutes_limit: freePlan.features.tavusMinutes,
        tavus_minutes_used: 0,
        solo_sessions_today: 0,
        insights_this_week: 0,
      };

      // First try with regular client (for authenticated users)
      let { data, error } = await supabase
        .from('user_subscriptions')
        .insert(defaultSubscription)
        .select()
        .single();

      // If that fails due to RLS, try to check if user is authenticated
      if (error && error.code === '42501') {
        // Check if we have a valid session
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.error('Cannot create subscription: User not authenticated');
          return null;
        }

        // Try again - sometimes there's a timing issue with auth state
        const result = await supabase
          .from('user_subscriptions')
          .insert(defaultSubscription)
          .select()
          .single();

        data = result.data;
        error = result.error;
      }

      if (error) {
        console.error('Error creating default subscription:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in createDefaultSubscription:', error);
      return null;
    }
  }

  static async updateSubscription(
    userId: string, 
    planId: string, 
    revenueCatCustomerId?: string
  ): Promise<boolean> {
    try {
      const plan = getPlanById(planId);
      if (!plan) {
        throw new Error('Invalid plan ID');
      }

      const updates: Partial<UserSubscription> = {
        plan_id: planId,
        plan_name: plan.displayName,
        tavus_minutes_limit: plan.features.tavusMinutes,
        updated_at: new Date().toISOString(),
      };

      if (revenueCatCustomerId) {
        updates.revenuecat_customer_id = revenueCatCustomerId;
      }

      const { error } = await supabase
        .from('user_subscriptions')
        .update(updates)
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating subscription:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateSubscription:', error);
      return false;
    }
  }

  static async canCreateSoloSession(userId: string): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId);
      if (!subscription) return false;

      const plan = getPlanById(subscription.plan_id);
      if (!plan) return false;

      // Check if unlimited sessions
      if (plan.features.soloSessionsPerDay === 'unlimited') {
        return true;
      }

      // Check daily limit
      const today = new Date().toISOString().split('T')[0];
      const lastSessionDate = subscription.last_solo_session_date;
      
      if (lastSessionDate !== today) {
        return true; // New day, reset counter
      }

      return subscription.solo_sessions_today < (plan.features.soloSessionsPerDay as number);
    } catch (error) {
      console.error('Error checking solo session limit:', error);
      return false;
    }
  }

  static async canCreateGroupSession(userId: string): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId);
      if (!subscription) return false;

      const plan = getPlanById(subscription.plan_id);
      if (!plan) return false;

      return plan.features.groupSessions;
    } catch (error) {
      console.error('Error checking group session access:', error);
      return false;
    }
  }

  static async canUseTavusMinutes(userId: string, minutesNeeded: number): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId);
      if (!subscription) return false;

      const remainingMinutes = subscription.tavus_minutes_limit - subscription.tavus_minutes_used;
      return remainingMinutes >= minutesNeeded;
    } catch (error) {
      console.error('Error checking Tavus minutes:', error);
      return false;
    }
  }

  static async incrementSoloSessionCount(userId: string): Promise<boolean> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          last_solo_session_date: today,
          solo_sessions_today: supabase.sql`CASE 
            WHEN last_solo_session_date = ${today} THEN solo_sessions_today + 1 
            ELSE 1 
          END`,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error incrementing solo session count:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in incrementSoloSessionCount:', error);
      return false;
    }
  }

  static async incrementTavusUsage(userId: string, minutesUsed: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          tavus_minutes_used: supabase.sql`tavus_minutes_used + ${minutesUsed}`,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error incrementing Tavus usage:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in incrementTavusUsage:', error);
      return false;
    }
  }

  static async getRemainingLimits(userId: string) {
    try {
      const subscription = await this.getUserSubscription(userId);
      if (!subscription) return null;

      const plan = getPlanById(subscription.plan_id);
      if (!plan) return null;

      const today = new Date().toISOString().split('T')[0];
      const isToday = subscription.last_solo_session_date === today;

      return {
        tavusMinutes: subscription.tavus_minutes_limit - subscription.tavus_minutes_used,
        soloSessionsToday: plan.features.soloSessionsPerDay === 'unlimited' 
          ? 'unlimited' 
          : (plan.features.soloSessionsPerDay as number) - (isToday ? subscription.solo_sessions_today : 0),
        insightsThisWeek: plan.features.insightsPerWeek === 'unlimited'
          ? 'unlimited'
          : (plan.features.insightsPerWeek as number) - subscription.insights_this_week,
        canCreateGroupSessions: plan.features.groupSessions,
      };
    } catch (error) {
      console.error('Error getting remaining limits:', error);
      return null;
    }
  }
}