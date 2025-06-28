import { supabase } from '../lib/supabase';
import { SubscriptionService } from './subscriptionService';
import { SUBSCRIPTION_PLANS, getPlanById } from '../config/subscriptionPlans';

// Mock RevenueCat service for development
export class RevenueCatService {
  private static apiKey = import.meta.env.VITE_REVENUECAT_API_KEY;
  private static isInitialized = false;
  private static mockCustomerId: string | null = null;
  private static mockEntitlements: Record<string, boolean> = {};
  private static mockPurchaseHistory: any[] = [];

  /**
   * Initialize RevenueCat SDK (mock implementation)
   */
  static async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    console.log('🐱 Initializing RevenueCat SDK (mock)');
    
    try {
      // In a real implementation, this would initialize the actual SDK
      // For now, we'll just set a flag
      this.isInitialized = true;
      
      // Generate a mock customer ID if we don't have one
      if (!this.mockCustomerId) {
        this.mockCustomerId = `mock_customer_${Math.random().toString(36).substring(2, 15)}`;
      }
      
      console.log('✅ RevenueCat initialized with mock customer ID:', this.mockCustomerId);
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize RevenueCat:', error);
      return false;
    }
  }

  /**
   * Get current user entitlements (mock implementation)
   */
  static async getEntitlements(userId: string): Promise<any> {
    await this.initialize();
    
    try {
      // In a real implementation, this would call the RevenueCat SDK
      // For now, we'll get the user's subscription from our database
      const subscription = await SubscriptionService.getUserSubscription(userId);
      
      if (!subscription) {
        return {
          active: false,
          entitlements: {},
          customerInfo: {
            originalAppUserId: userId,
            latestExpirationDate: null
          }
        };
      }
      
      // Map subscription to entitlements
      const plan = getPlanById(subscription.plan_id);
      const entitlementKey = plan?.name || 'free';
      
      this.mockEntitlements[entitlementKey] = true;
      
      return {
        active: subscription.status === 'active',
        entitlements: {
          [entitlementKey]: {
            isActive: subscription.status === 'active',
            willRenew: !subscription.cancel_at_period_end,
            periodType: subscription.plan_id.includes('annual') ? 'annual' : 'monthly',
            latestPurchaseDate: subscription.current_period_start,
            expirationDate: subscription.current_period_end,
            productIdentifier: subscription.plan_id
          }
        },
        customerInfo: {
          originalAppUserId: userId,
          latestExpirationDate: subscription.current_period_end
        }
      };
    } catch (error) {
      console.error('❌ Failed to get entitlements:', error);
      return {
        active: false,
        entitlements: {},
        error: 'Failed to get entitlements'
      };
    }
  }

  /**
   * Get available packages (mock implementation)
   */
  static async getOfferings(): Promise<any> {
    await this.initialize();
    
    try {
      // Convert our subscription plans to RevenueCat offerings format
      const offerings = {
        current: {
          identifier: 'default',
          availablePackages: Object.values(SUBSCRIPTION_PLANS).map(plan => {
            if (plan.name === 'free') return null;
            
            return {
              identifier: plan.name,
              packageType: 'MONTHLY',
              product: {
                identifier: plan.revenueCatIds.monthly,
                title: plan.displayName,
                description: `${plan.displayName} Monthly Subscription`,
                price: plan.price.monthly,
                priceString: `$${plan.price.monthly.toFixed(2)}`,
                currencyCode: 'USD'
              },
              offering: 'default'
            };
          }).filter(Boolean)
        }
      };
      
      // Add annual packages
      offerings.current.availablePackages.push(
        ...Object.values(SUBSCRIPTION_PLANS)
          .filter(plan => plan.name !== 'free')
          .map(plan => ({
            identifier: `${plan.name}_annual`,
            packageType: 'ANNUAL',
            product: {
              identifier: plan.revenueCatIds.annual,
              title: `${plan.displayName} (Annual)`,
              description: `${plan.displayName} Annual Subscription`,
              price: plan.price.annual,
              priceString: `$${plan.price.annual.toFixed(2)}`,
              currencyCode: 'USD'
            },
            offering: 'default'
          }))
      );
      
      return offerings;
    } catch (error) {
      console.error('❌ Failed to get offerings:', error);
      return {
        current: {
          identifier: 'default',
          availablePackages: []
        }
      };
    }
  }

  /**
   * Purchase a package (mock implementation)
   */
  static async purchasePackage(userId: string, packageIdentifier: string, isAnnual: boolean = false): Promise<any> {
    await this.initialize();
    
    try {
      console.log(`🛒 Purchasing package: ${packageIdentifier} (${isAnnual ? 'annual' : 'monthly'})`);
      
      // Find the plan that matches this package
      const planKey = packageIdentifier.replace('_annual', '');
      const plan = Object.values(SUBSCRIPTION_PLANS).find(p => p.name === planKey);
      
      if (!plan) {
        throw new Error(`Plan not found for package: ${packageIdentifier}`);
      }
      
      // Create a mock purchase
      const now = new Date();
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + (isAnnual ? 365 : 30));
      
      const purchase = {
        packageIdentifier,
        productIdentifier: isAnnual ? plan.revenueCatIds.annual : plan.revenueCatIds.monthly,
        purchaseDate: now.toISOString(),
        expirationDate: expirationDate.toISOString(),
        isActive: true,
        willRenew: true,
        periodType: isAnnual ? 'annual' : 'monthly',
        price: isAnnual ? plan.price.annual : plan.price.monthly,
        currencyCode: 'USD'
      };
      
      // Add to mock purchase history
      this.mockPurchaseHistory.push(purchase);
      
      // Update the user's subscription in the database
      const success = await SubscriptionService.updateSubscription(
        userId, 
        plan.id, 
        this.mockCustomerId
      );
      
      if (!success) {
        throw new Error('Failed to update subscription in database');
      }
      
      // Set the entitlement
      this.mockEntitlements[plan.name] = true;
      
      return {
        success: true,
        purchase,
        customerInfo: {
          originalAppUserId: userId,
          latestExpirationDate: expirationDate.toISOString()
        }
      };
    } catch (error) {
      console.error('❌ Failed to purchase package:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to purchase package'
      };
    }
  }

  /**
   * Restore purchases (mock implementation)
   */
  static async restorePurchases(userId: string): Promise<any> {
    await this.initialize();
    
    try {
      console.log('🔄 Restoring purchases for user:', userId);
      
      // In a real implementation, this would call the RevenueCat SDK
      // For now, we'll just return the mock purchase history
      return {
        success: true,
        purchases: this.mockPurchaseHistory,
        customerInfo: {
          originalAppUserId: userId,
          latestExpirationDate: this.mockPurchaseHistory.length > 0 
            ? this.mockPurchaseHistory[this.mockPurchaseHistory.length - 1].expirationDate 
            : null
        }
      };
    } catch (error) {
      console.error('❌ Failed to restore purchases:', error);
      return {
        success: false,
        error: 'Failed to restore purchases'
      };
    }
  }

  /**
   * Get purchase history (mock implementation)
   */
  static async getPurchaseHistory(userId: string): Promise<any[]> {
    await this.initialize();
    
    try {
      // In a real implementation, this would call the RevenueCat API
      // For now, we'll generate some mock purchase history based on the user's subscription
      const subscription = await SubscriptionService.getUserSubscription(userId);
      
      if (!subscription || subscription.plan_id === 'awaknow_free') {
        return [];
      }
      
      // If we don't have any mock purchase history, generate some
      if (this.mockPurchaseHistory.length === 0) {
        const plan = getPlanById(subscription.plan_id);
        if (!plan) return [];
        
        const isAnnual = subscription.plan_id.includes('annual');
        const periodMonths = isAnnual ? 12 : 1;
        
        // Generate purchase history for the last 3 periods
        const history = [];
        for (let i = 0; i < 3; i++) {
          const purchaseDate = new Date(subscription.current_period_start);
          purchaseDate.setMonth(purchaseDate.getMonth() - (i * periodMonths));
          
          const expirationDate = new Date(purchaseDate);
          expirationDate.setMonth(expirationDate.getMonth() + periodMonths);
          
          history.push({
            packageIdentifier: plan.name + (isAnnual ? '_annual' : ''),
            productIdentifier: isAnnual ? plan.revenueCatIds.annual : plan.revenueCatIds.monthly,
            purchaseDate: purchaseDate.toISOString(),
            expirationDate: expirationDate.toISOString(),
            isActive: i === 0,
            willRenew: i === 0 && !subscription.cancel_at_period_end,
            periodType: isAnnual ? 'annual' : 'monthly',
            price: isAnnual ? plan.price.annual : plan.price.monthly,
            currencyCode: 'USD'
          });
        }
        
        this.mockPurchaseHistory = history;
      }
      
      return this.mockPurchaseHistory;
    } catch (error) {
      console.error('❌ Failed to get purchase history:', error);
      return [];
    }
  }

  /**
   * Cancel subscription (mock implementation)
   */
  static async cancelSubscription(userId: string): Promise<boolean> {
    try {
      console.log('🛑 Cancelling subscription for user:', userId);
      
      // Update the subscription in the database
      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          cancel_at_period_end: true,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
      
      if (error) {
        console.error('❌ Failed to cancel subscription in database:', error);
        return false;
      }
      
      // Update the mock purchase history
      if (this.mockPurchaseHistory.length > 0) {
        this.mockPurchaseHistory[0].willRenew = false;
      }
      
      return true;
    } catch (error) {
      console.error('❌ Failed to cancel subscription:', error);
      return false;
    }
  }

  /**
   * Reactivate subscription (mock implementation)
   */
  static async reactivateSubscription(userId: string): Promise<boolean> {
    try {
      console.log('🔄 Reactivating subscription for user:', userId);
      
      // Update the subscription in the database
      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          cancel_at_period_end: false,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
      
      if (error) {
        console.error('❌ Failed to reactivate subscription in database:', error);
        return false;
      }
      
      // Update the mock purchase history
      if (this.mockPurchaseHistory.length > 0) {
        this.mockPurchaseHistory[0].willRenew = true;
      }
      
      return true;
    } catch (error) {
      console.error('❌ Failed to reactivate subscription:', error);
      return false;
    }
  }
}