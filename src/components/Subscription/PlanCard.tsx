import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap } from 'lucide-react';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import { SubscriptionPlan } from '../../types/subscription';

interface PlanCardProps {
  plan: SubscriptionPlan;
  isCurrentPlan: boolean;
  isPopular?: boolean;
  onSelectPlan: (planId: string, isAnnual: boolean) => void;
  loading?: boolean;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  isCurrentPlan,
  isPopular = false,
  onSelectPlan,
  loading = false,
}) => {
  const formatFeature = (value: number | 'unlimited') => {
    return value === 'unlimited' ? 'Unlimited' : value.toString();
  };

  const annualSavings = plan.price.monthly > 0 
    ? Math.round(((plan.price.monthly * 12 - plan.price.annual) / (plan.price.monthly * 12)) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
            <Star className="w-3 h-3" />
            <span>Most Popular</span>
          </div>
        </div>
      )}

      <Card className={`h-full ${isPopular ? 'ring-2 ring-accent-500 ring-opacity-50' : ''}`}>
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-neutral-800 mb-2">{plan.displayName}</h3>
          
          {plan.price.monthly === 0 ? (
            <div className="text-3xl font-bold text-neutral-800">Free</div>
          ) : (
            <div className="space-y-2">
              <div className="text-3xl font-bold text-neutral-800">
                ${plan.price.monthly}
                <span className="text-lg font-normal text-neutral-600">/month</span>
              </div>
              {annualSavings > 0 && (
                <div className="text-sm text-success-600">
                  Save {annualSavings}% with annual billing (${plan.price.annual}/year)
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4 mb-8">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">AI Video Minutes</span>
              <span className="font-medium text-neutral-800">{plan.features.tavusMinutes}/month</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Solo Sessions</span>
              <span className="font-medium text-neutral-800">
                {formatFeature(plan.features.soloSessionsPerDay)}/day
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">AI Insights</span>
              <span className="font-medium text-neutral-800">
                {formatFeature(plan.features.insightsPerWeek)}/week
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Session History</span>
              <span className="font-medium text-neutral-800">{plan.features.historyDays} days</span>
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-4 space-y-2">
            <div className="flex items-center space-x-2">
              {plan.features.groupSessions ? (
                <Check className="w-4 h-4 text-success-500" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-neutral-300" />
              )}
              <span className={`text-sm ${plan.features.groupSessions ? 'text-neutral-800' : 'text-neutral-500'}`}>
                Group Sessions
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {plan.features.prioritySupport ? (
                <Check className="w-4 h-4 text-success-500" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-neutral-300" />
              )}
              <span className={`text-sm ${plan.features.prioritySupport ? 'text-neutral-800' : 'text-neutral-500'}`}>
                Priority Support
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {isCurrentPlan ? (
            <Button variant="outline" className="w-full" disabled>
              Current Plan
            </Button>
          ) : plan.price.monthly === 0 ? (
            <Button
              onClick={() => onSelectPlan(plan.id, false)}
              variant="outline"
              className="w-full"
              loading={loading}
            >
              Downgrade to Free
            </Button>
          ) : (
            <>
              <Button
                onClick={() => onSelectPlan(plan.id, false)}
                variant={isPopular ? 'primary' : 'secondary'}
                className="w-full"
                loading={loading}
                icon={isPopular ? Zap : undefined}
              >
                Choose Monthly
              </Button>
              
              {annualSavings > 0 && (
                <Button
                  onClick={() => onSelectPlan(plan.id, true)}
                  variant="outline"
                  className="w-full"
                  loading={loading}
                >
                  Choose Annual (Save {annualSavings}%)
                </Button>
              )}
            </>
          )}
        </div>
      </Card>
    </motion.div>
  );
};