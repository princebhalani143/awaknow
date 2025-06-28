import { supabase } from '../lib/supabase';

export interface NewsletterSubscription {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  subscription_type: 'wellness_insights' | 'product_updates' | 'all';
  source: string;
  subscribed_at: string;
  email_verified: boolean;
}

export interface SubscriptionResponse {
  success: boolean;
  message?: string;
  error?: string;
  subscription_id?: string;
  already_subscribed?: boolean;
}

export class NewsletterService {
  /**
   * Subscribe an email to the newsletter
   */
  static async subscribe(
    email: string, 
    subscriptionType: 'wellness_insights' | 'product_updates' | 'all' = 'wellness_insights',
    source: string = 'website_footer'
  ): Promise<SubscriptionResponse> {
    try {
      // Validate email format on client side
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!emailRegex.test(email)) {
        return {
          success: false,
          error: 'Please enter a valid email address'
        };
      }

      // Call the database function
      const { data, error } = await supabase.rpc('subscribe_to_newsletter', {
        subscriber_email: email.toLowerCase().trim(),
        subscription_type: subscriptionType,
        source_location: source
      });

      if (error) {
        console.error('Newsletter subscription error:', error);
        return {
          success: false,
          error: 'Failed to subscribe. Please try again.'
        };
      }

      return data as SubscriptionResponse;
    } catch (error) {
      console.error('Newsletter service error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      };
    }
  }

  /**
   * Unsubscribe an email from the newsletter
   */
  static async unsubscribe(email: string, token?: string): Promise<SubscriptionResponse> {
    try {
      const { data, error } = await supabase.rpc('unsubscribe_from_newsletter', {
        subscriber_email: email.toLowerCase().trim(),
        token: token || null
      });

      if (error) {
        console.error('Newsletter unsubscribe error:', error);
        return {
          success: false,
          error: 'Failed to unsubscribe. Please try again.'
        };
      }

      return data as SubscriptionResponse;
    } catch (error) {
      console.error('Newsletter unsubscribe error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      };
    }
  }

  /**
   * Get subscription status for an email
   */
  static async getSubscriptionStatus(email: string): Promise<NewsletterSubscription | null> {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (error || !data) {
        return null;
      }

      return data as NewsletterSubscription;
    } catch (error) {
      console.error('Error getting subscription status:', error);
      return null;
    }
  }

  /**
   * Get newsletter analytics (admin only)
   */
  static async getAnalytics(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('newsletter_analytics')
        .select('*')
        .order('subscription_date', { ascending: false })
        .limit(30);

      if (error) {
        console.error('Error getting newsletter analytics:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Newsletter analytics error:', error);
      return [];
    }
  }
}