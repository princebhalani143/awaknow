import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Crown, Zap } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { PlanCard } from '../components/Subscription/PlanCard';
import { UsageMeter } from '../components/Subscription/UsageMeter';
import { TopBar } from '../components/Layout/TopBar';
import { Footer } from '../components/Layout/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { SUBSCRIPTION_PLANS } from '../config/subscriptionPlans';

export const Subscription: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { subscription, limits, loading, loadSubscription, updateSubscription, getCurrentPlan } = useSubscriptionStore();
  const [upgradeLoading, setUpgradeLoading] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadSubscription(user.id);
    }
  }, [user, loadSubscription]);

  const handleSelectPlan = async (planId: string, isAnnual: boolean) => {
    if (!user) return;

    setUpgradeLoading(planId);
    try {
      // In production, this would integrate with RevenueCat
      // For now, we'll simulate the upgrade process
      const success = await updateSubscription(user.id, planId);
      
      if (success) {
        // Show success message or redirect
        console.log('Plan updated successfully');
      } else {
        console.error('Failed to update plan');
      }
    } catch (error) {
      console.error('Error updating plan:', error);
    } finally {
      setUpgradeLoading(null);
    }
  };

  const currentPlan = getCurrentPlan();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col">
        <TopBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading subscription details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col">
      <TopBar />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl flex-1">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <Button
            onClick={() => navigate('/home')}
            variant="ghost"
            icon={ArrowLeft}
            className="!p-2"
          />
          <div className="text-center">
            <h1 className="text-3xl font-bold text-neutral-800">Subscription Plans</h1>
            <p className="text-neutral-600">Choose the plan that fits your wellness journey</p>
          </div>
          <div className="w-10"></div>
        </motion.div>

        {/* Current Usage */}
        {subscription && limits && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <UsageMeter limits={limits} subscription={subscription} />
          </motion.div>
        )}

        {/* Plan Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-neutral-800 mb-4">Choose Your Plan</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Unlock the full potential of AI-powered emotional wellness. All plans include secure data encryption and can be cancelled anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {Object.values(SUBSCRIPTION_PLANS).map((plan, index) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isCurrentPlan={currentPlan?.id === plan.id}
                isPopular={plan.name === 'reflect_plus'}
                onSelectPlan={handleSelectPlan}
                loading={upgradeLoading === plan.id}
              />
            ))}
          </div>
        </motion.div>

        {/* Features Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-8"
        >
          <Card>
            <h3 className="text-xl font-semibold text-neutral-800 mb-6 text-center">Why Upgrade?</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-neutral-800">Enhanced AI Experience</h4>
                </div>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li>• More AI video minutes for deeper conversations</li>
                  <li>• Unlimited daily reflection sessions</li>
                  <li>• Advanced emotion analysis and insights</li>
                  <li>• Longer session history retention</li>
                </ul>
              </div>

              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-accent-500 rounded-xl flex items-center justify-center">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-neutral-800">Premium Features</h4>
                </div>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li>• Group conflict resolution sessions</li>
                  <li>• Priority customer support</li>
                  <li>• Export your wellness data</li>
                  <li>• Early access to new features</li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="bg-gradient-to-r from-success-50 to-primary-50 border-success-200">
            <div className="text-center">
              <h4 className="font-semibold text-neutral-800 mb-2">Your Data is Safe & Secure</h4>
              <p className="text-sm text-neutral-600">
                All your conversations and personal data are encrypted end-to-end. 
                We're HIPAA compliant and never share your information with third parties. 
                Cancel anytime with full data export available.
              </p>
            </div>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};