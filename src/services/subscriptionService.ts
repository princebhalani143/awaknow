import { supabase } from '../lib/supabase';
import { UserSubscription } from '../types/subscription';
import { SUBSCRIPTION_PLANS, getPlanById } from '../config/subscriptionPlans';

export class SubscriptionService {
  static async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      // First try to get existing subscription
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching subscription:', error);
        
        // If it's an RLS error, try to create default subscription
        if (error.code === '42501') {
          return await this.createDefaultSubscription(userId);
        }
        return null;
      }

      // If no subscription found, create a default one
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
      // Verify user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || user.id !== userId) {
        console.error('Cannot create subscription: User not authenticated or ID mismatch');
        return null;
      }

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
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };

      // Try using the RPC function first (bypasses RLS)
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('get_or_create_user_subscription', { target_user_id: userId });

      if (!rpcError && rpcData) {
        return rpcData;
      }

      // Fallback to direct insert
      const { data, error } = await supabase
        .from('user_subscriptions')
        .insert(defaultSubscription)
        .select()
        .single();

      if (error) {
        console.error('Error creating default subscription:', error);
        
        // If still failing, try one more time with service role context
        if (error.code === '42501') {
          // This should work with the new RLS policies
          const { data: retryData, error: retryError } = await supabase
            .from('user_subscriptions')
            .insert(defaultSubscription)
            .select()
            .single();

          if (retryError) {
            console.error('Final attempt failed:', retryError);
            return null;
          }

          return retryData;
        }
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
		const { error } = await supabase.rpc('increment_solo_session_count', { uid: userId });
		if (error) {
		  console.error('Error incrementing solo session count via RPC:', error);
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
		const { error } = await supabase.rpc('increment_tavus_usage', { uid: userId, minutes: minutesUsed });
		if (error) {
		  console.error('Error incrementing Tavus usage via RPC:', error);
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