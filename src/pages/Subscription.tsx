import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Crown, Zap, CreditCard, Calendar, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
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
import { RevenueCatService } from '../services/revenueCatService';

export const Subscription: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { subscription, limits, loading, loadSubscription, getCurrentPlan } = useSubscriptionStore();
  const [upgradeLoading, setUpgradeLoading] = useState<string | null>(null);
  const [offerings, setOfferings] = useState<any>(null);
  const [purchaseHistory, setPurchaseHistory] = useState<any[]>([]);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isAnnual, setIsAnnual] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      loadSubscription(user.id);
      loadOfferings();
      loadPurchaseHistory();
    }
  }, [user, loadSubscription]);

  const loadOfferings = async () => {
    try {
      const offerings = await RevenueCatService.getOfferings();
      setOfferings(offerings);
    } catch (error) {
      console.error('Failed to load offerings:', error);
    }
  };

  const loadPurchaseHistory = async () => {
    if (!user) return;
    
    try {
      const history = await RevenueCatService.getPurchaseHistory(user.id);
      setPurchaseHistory(history);
    } catch (error) {
      console.error('Failed to load purchase history:', error);
    }
  };

  const handleSelectPlan = async (planId: string, isAnnual: boolean = false) => {
    if (!user) return;

    const plan = SUBSCRIPTION_PLANS[Object.keys(SUBSCRIPTION_PLANS).find(key => 
      SUBSCRIPTION_PLANS[key].id === planId
    ) as keyof typeof SUBSCRIPTION_PLANS];
    
    if (!plan) return;
    
    setSelectedPlan(plan);
    setIsAnnual(isAnnual);
    setShowPurchaseModal(true);
  };

  const handlePurchase = async () => {
    if (!user || !selectedPlan) return;
    
    setPurchaseStatus('processing');
    setErrorMessage('');
    
    try {
      setUpgradeLoading(selectedPlan.id);
      
      // Call RevenueCat service to process the purchase
      const result = await RevenueCatService.purchasePackage(
        user.id,
        selectedPlan.name,
        isAnnual
      );
      
      if (result.success) {
        setPurchaseStatus('success');
        
        // Reload subscription data
        await loadSubscription(user.id);
        await loadPurchaseHistory();
        
        // Close modal after a delay
        setTimeout(() => {
          setShowPurchaseModal(false);
          setPurchaseStatus('idle');
        }, 2000);
      } else {
        setPurchaseStatus('error');
        setErrorMessage(result.error || 'Failed to process payment');
      }
    } catch (error) {
      console.error('Error during purchase:', error);
      setPurchaseStatus('error');
      setErrorMessage('An unexpected error occurred');
    } finally {
      setUpgradeLoading(null);
    }
  };

  const handleCancelSubscription = async () => {
    if (!user) return;
    
    try {
      const success = await RevenueCatService.cancelSubscription(user.id);
      
      if (success) {
        // Reload subscription data
        await loadSubscription(user.id);
        await loadPurchaseHistory();
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    }
  };

  const handleReactivateSubscription = async () => {
    if (!user) return;
    
    try {
      const success = await RevenueCatService.reactivateSubscription(user.id);
      
      if (success) {
        // Reload subscription data
        await loadSubscription(user.id);
        await loadPurchaseHistory();
      }
    } catch (error) {
      console.error('Error reactivating subscription:', error);
    }
  };

  const currentPlan = getCurrentPlan();
  const currentSubscription = purchaseHistory.length > 0 ? purchaseHistory[0] : null;

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

        {/* Current Subscription Card */}
        {subscription && subscription.plan_id !== 'awaknow_free' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold text-neutral-800">{subscription.plan_name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        subscription.status === 'active' 
                          ? 'bg-success-100 text-success-700' 
                          : 'bg-warning-100 text-warning-700'
                      }`}>
                        {subscription.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-neutral-600 mt-1">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Renews: {new Date(subscription.current_period_end).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CreditCard className="w-3 h-3" />
                        <span>
                          {currentSubscription?.periodType === 'annual' ? 'Annual' : 'Monthly'} billing
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {subscription.cancel_at_period_end ? (
                    <>
                      <div className="text-sm text-warning-600 bg-warning-50 px-3 py-1 rounded-full">
                        Cancels on {new Date(subscription.current_period_end).toLocaleDateString()}
                      </div>
                      <Button
                        onClick={handleReactivateSubscription}
                        variant="outline"
                        size="sm"
                        icon={RefreshCw}
                      >
                        Reactivate
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={handleCancelSubscription}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    onClick={() => navigate('/billing-history')}
                    variant="secondary"
                    size="sm"
                  >
                    Billing History
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

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

      {/* Purchase Modal */}
      {showPurchaseModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                {purchaseStatus === 'success' ? 'Purchase Successful!' : `Upgrade to ${selectedPlan.displayName}`}
              </h3>
              {purchaseStatus !== 'success' && (
                <p className="text-neutral-600 text-sm">
                  {isAnnual 
                    ? `Annual subscription billed at $${selectedPlan.price.annual}/year`
                    : `Monthly subscription billed at $${selectedPlan.price.monthly}/month`
                  }
                </p>
              )}
            </div>

            {purchaseStatus === 'idle' && (
              <>
                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <h4 className="font-medium text-primary-800 mb-2">Plan Details</h4>
                    <ul className="text-sm space-y-2">
                      <li className="flex justify-between">
                        <span className="text-neutral-600">Plan:</span>
                        <span className="font-medium text-neutral-800">{selectedPlan.displayName}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-neutral-600">Billing:</span>
                        <span className="font-medium text-neutral-800">{isAnnual ? 'Annual' : 'Monthly'}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-neutral-600">Price:</span>
                        <span className="font-medium text-neutral-800">
                          ${isAnnual ? selectedPlan.price.annual : selectedPlan.price.monthly}
                          {isAnnual ? '/year' : '/month'}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-neutral-600">AI Minutes:</span>
                        <span className="font-medium text-neutral-800">{selectedPlan.features.tavusMinutes}/month</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-neutral-600">Auto-renews:</span>
                        <span className="font-medium text-neutral-800">Yes (cancel anytime)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 bg-success-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-success-500" />
                      <h4 className="font-medium text-success-800">Secure Payment</h4>
                    </div>
                    <p className="text-sm text-success-700">
                      Your payment information is securely processed. We never store your full card details.
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={() => setShowPurchaseModal(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handlePurchase}
                    className="flex-1"
                  >
                    Confirm Purchase
                  </Button>
                </div>
              </>
            )}

            {purchaseStatus === 'processing' && (
              <div className="text-center py-6">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-neutral-600">Processing your payment...</p>
              </div>
            )}

            {purchaseStatus === 'success' && (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-success-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-success-500" />
                </div>
                <p className="text-success-700 mb-6">Your subscription has been successfully activated!</p>
                <Button
                  onClick={() => {
                    setShowPurchaseModal(false);
                    setPurchaseStatus('idle');
                  }}
                  className="w-full"
                >
                  Continue
                </Button>
              </div>
            )}

            {purchaseStatus === 'error' && (
              <div className="space-y-4 mb-6">
                <div className="p-4 bg-error-50 rounded-lg text-center">
                  <div className="w-12 h-12 bg-error-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-error-500" />
                  </div>
                  <h4 className="font-medium text-error-800 mb-2">Payment Failed</h4>
                  <p className="text-sm text-error-700">
                    {errorMessage || 'There was an issue processing your payment. Please try again.'}
                  </p>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={() => setShowPurchaseModal(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => setPurchaseStatus('idle')}
                    className="flex-1"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-4 text-xs text-neutral-500 text-center">
              By confirming your purchase, you agree to our{' '}
              <button
                onClick={() => navigate('/terms-conditions')}
                className="text-primary-600 hover:underline"
              >
                Terms & Conditions
              </button>
              {' '}and{' '}
              <button
                onClick={() => navigate('/privacy-policy')}
                className="text-primary-600 hover:underline"
              >
                Privacy Policy
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};