import { SubscriptionPlan } from '../types/subscription';

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  free: {
    id: 'awaknow_free',
    name: 'free',
    displayName: 'Free',
    price: {
      monthly: 0,
      annual: 0,
    },
    features: {
      tavusMinutes: 25,
      soloSessionsPerDay: 1,
      insightsPerWeek: 1,
      groupSessions: false,
      historyDays: 7,
      prioritySupport: false,
    },
    revenueCatIds: {
      monthly: 'awaknow_free',
      annual: 'awaknow_free',
    },
  },
  reflect_plus: {
    id: 'awaknow_growth',
    name: 'reflect_plus',
    displayName: 'Reflect+',
    price: {
      monthly: 9.99,
      annual: 99.99,
    },
    features: {
      tavusMinutes: 100,
      soloSessionsPerDay: 'unlimited',
      insightsPerWeek: 'unlimited',
      groupSessions: false,
      historyDays: 30,
      prioritySupport: false,
    },
    revenueCatIds: {
      monthly: 'awaknow_growth_monthly',
      annual: 'awaknow_growth_annual',
    },
  },
  resolve_together: {
    id: 'awaknow_pro',
    name: 'resolve_together',
    displayName: 'Resolve Together',
    price: {
      monthly: 19.99,
      annual: 199.99,
    },
    features: {
      tavusMinutes: 'unlimited',
      soloSessionsPerDay: 'unlimited',
      insightsPerWeek: 'unlimited',
      groupSessions: true,
      historyDays: 90,
      prioritySupport: true,
    },
    revenueCatIds: {
      monthly: 'awaknow_pro_monthly',
      annual: 'awaknow_pro_annual',
    },
  },
};

export const getPlanByRevenueCatId = (revenueCatId: string): SubscriptionPlan | null => {
  for (const plan of Object.values(SUBSCRIPTION_PLANS)) {
    if (plan.revenueCatIds.monthly === revenueCatId || plan.revenueCatIds.annual === revenueCatId) {
      return plan;
    }
  }
  return null;
};

export const getPlanById = (planId: string): SubscriptionPlan | null => {
  return Object.values(SUBSCRIPTION_PLANS).find(plan => plan.id === planId) || null;
};

export const getPlanByName = (planName: string): SubscriptionPlan | null => {
  return SUBSCRIPTION_PLANS[planName] || null;
};