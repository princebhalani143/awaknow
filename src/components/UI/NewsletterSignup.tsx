import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Check, AlertCircle, Loader } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { NewsletterService } from '../../services/newsletterService';

interface NewsletterSignupProps {
  className?: string;
  source?: string;
  subscriptionType?: 'wellness_insights' | 'product_updates' | 'all';
  variant?: 'card' | 'inline';
  title?: string;
  description?: string;
  placeholder?: string;
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  className = '',
  source = 'website_footer',
  subscriptionType = 'wellness_insights',
  variant = 'card',
  title = 'Stay Updated with Wellness Insights',
  description = 'Get the latest articles, research findings, and practical tips delivered to your inbox weekly.',
  placeholder = 'Enter your email'
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }

    setLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const result = await NewsletterService.subscribe(email, subscriptionType, source);
      
      if (result.success) {
        setStatus('success');
        setMessage(result.message || 'Thank you for subscribing!');
        setEmail(''); // Clear email on success
        
        // Track subscription event (for analytics)
        if (typeof window !== 'undefined' && 'gtag' in window) {
          (window as any).gtag?.('event', 'newsletter_subscribe', {
            event_category: 'engagement',
            event_label: source,
            value: 1
          });
        }
      } else {
        setStatus('error');
        setMessage(result.error || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An unexpected error occurred. Please try again.');
      console.error('Newsletter subscription error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetStatus = () => {
    if (status !== 'idle') {
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000); // Clear status after 5 seconds
    }
  };

  React.useEffect(() => {
    resetStatus();
  }, [status]);

  if (variant === 'inline') {
    return (
      <div className={`${className}`}>
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              disabled={loading || status === 'success'}
              className="w-full px-4 py-3 rounded-xl text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
            {status === 'success' && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Check className="w-5 h-5 text-success-500" />
              </div>
            )}
          </div>
          
          <Button
            type="submit"
            variant="primary"
            disabled={loading || status === 'success'}
            className="px-6 py-3"
            icon={loading ? Loader : Mail}
          >
            {loading ? 'Subscribing...' : status === 'success' ? 'Subscribed!' : 'Subscribe'}
          </Button>
        </form>

        {/* Status Messages */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: message ? 1 : 0, 
            height: message ? 'auto' : 0 
          }}
          transition={{ duration: 0.3 }}
          className="mt-4 overflow-hidden"
        >
          {message && (
            <div className={`flex items-center space-x-2 p-3 rounded-lg text-sm ${
              status === 'success' 
                ? 'bg-success-50 text-success-800 border border-success-200' 
                : 'bg-error-50 text-error-800 border border-error-200'
            }`}>
              {status === 'success' ? (
                <Check className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{message}</span>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <Card className={`bg-gradient-to-br from-primary-500 to-secondary-500 text-white border-0 text-center ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
          {description}
        </p>
      </div>

      <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              disabled={loading || status === 'success'}
              className="w-full px-4 py-3 rounded-xl text-neutral-800 focus:outline-none focus:ring-2 focus:ring-accent-500 disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
            {status === 'success' && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Check className="w-5 h-5 text-success-500" />
              </div>
            )}
          </div>
          
          <Button
            type="submit"
            variant="accent"
            disabled={loading || status === 'success'}
            className="bg-white text-primary-600 hover:bg-primary-50 px-6 py-3"
            icon={loading ? Loader : Mail}
          >
            {loading ? 'Subscribing...' : status === 'success' ? 'Subscribed!' : 'Subscribe'}
          </Button>
        </div>

        {/* Status Messages */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: message ? 1 : 0, 
            height: message ? 'auto' : 0 
          }}
          transition={{ duration: 0.3 }}
          className="mt-4 overflow-hidden"
        >
          {message && (
            <div className={`flex items-center space-x-2 p-3 rounded-lg text-sm ${
              status === 'success' 
                ? 'bg-success-50 text-success-800 border border-success-200' 
                : 'bg-error-50 text-error-800 border border-error-200'
            }`}>
              {status === 'success' ? (
                <Check className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{message}</span>
            </div>
          )}
        </motion.div>

        {/* Privacy Notice */}
        <p className="text-xs text-primary-200 mt-3 text-center">
          We respect your privacy. Unsubscribe at any time. 
          <br />
          By subscribing, you agree to our{' '}
          <a href="/privacy-policy" className="underline hover:text-white transition-colors">
            Privacy Policy
          </a>.
        </p>
      </form>
    </Card>
  );
};