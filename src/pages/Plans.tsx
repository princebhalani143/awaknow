import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Shield, ArrowRight, Crown } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { TopBar } from '../components/Layout/TopBar';
import { Footer } from '../components/Layout/Footer';
import { useNavigate } from 'react-router-dom';
import { SUBSCRIPTION_PLANS } from '../config/subscriptionPlans';

export const Plans: React.FC = () => {
  const navigate = useNavigate();
  const plans = Object.values(SUBSCRIPTION_PLANS);

  const formatFeature = (value: number | 'unlimited') => {
    return value === 'unlimited' ? 'Unlimited' : value.toString();
  };

  const features = [
    {
      category: 'Core Features',
      items: [
        { name: 'AI Video Conversations', free: true, reflect: true, resolve: true },
        { name: 'Emotion Analysis', free: true, reflect: true, resolve: true },
        { name: 'Personal Insights', free: 'Basic', reflect: 'Advanced', resolve: 'Premium' },
        { name: 'Session History', free: '7 days', reflect: '30 days', resolve: '90 days' },
      ]
    },
    {
      category: 'Session Limits',
      items: [
        { name: 'AI Video Minutes', free: '25/month', reflect: '100/month', resolve: '15000/month' },
        { name: 'Solo Sessions', free: '1/day', reflect: 'Unlimited', resolve: 'Unlimited' },
        { name: 'AI Insights', free: '1/week', reflect: 'Unlimited', resolve: 'Unlimited' },
        { name: 'Group Sessions', free: false, reflect: false, resolve: true },
      ]
    },
    {
      category: 'Support & Security',
      items: [
        { name: 'End-to-End Encryption', free: true, reflect: true, resolve: true },
        { name: 'Data Export', free: false, reflect: true, resolve: true },
        { name: 'Priority Support', free: false, reflect: false, resolve: true },
        { name: 'Advanced Analytics', free: false, reflect: true, resolve: true },
      ]
    }
  ];

  const faqs = [
    {
      question: 'Can I change my plan anytime?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately for upgrades, or at the next billing cycle for downgrades.'
    },
    {
      question: 'Is my data secure and private?',
      answer: 'Absolutely. All conversations are end-to-end encrypted, and we never share your personal data. Even we cannot access your private sessions.'
    },
    {
      question: 'What happens if I cancel?',
      answer: 'You can cancel anytime with no questions asked. You\'ll retain access until the end of your billing period, and can export all your data.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 30-day money-back guarantee for all paid plans. Contact us if you\'re not satisfied for any reason.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col">
      <TopBar />
      
      <div className="container mx-auto px-4 py-12 max-w-6xl flex-1">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-800 mb-6 leading-tight">
            Choose Your
            <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
              {' '}Wellness Plan
            </span>
          </h1>
          <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Start free and upgrade as your emotional wellness journey grows. All plans include 
            our core AI features with varying limits and advanced capabilities.
          </p>
          <div className="flex items-center justify-center space-x-2 text-neutral-600">
            <Shield className="w-5 h-5 text-success-500" />
            <span className="text-sm">Your data is private, encrypted, and yours alone; even we can't see it. You can cancel anytime, no questions asked.</span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              className="relative"
            >
              {plan.name === 'reflect_plus' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <Card className={`h-full text-center ${plan.name === 'reflect_plus' ? 'ring-2 ring-accent-500 ring-opacity-50 scale-105' : ''}`}>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-neutral-800 mb-2">{plan.displayName}</h3>
                  
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-neutral-800">
                      ${plan.price.monthly.toFixed(2)}
                      <span className="text-lg font-normal text-neutral-600">/month</span>
                    </div>
                    {plan.price.monthly > 0 && (
                      <div className="text-sm text-success-600">
                        or ${plan.price.annual}/year (save ${(plan.price.monthly * 12 - plan.price.annual).toFixed(0)})
                      </div>
                    )}
                  </div>
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

                <Button
                  onClick={() => navigate('/auth')}
                  variant={plan.name === 'reflect_plus' ? 'primary' : plan.price.monthly === 0 ? 'outline' : 'secondary'}
                  className="w-full"
                  size="lg"
                  icon={plan.name === 'reflect_plus' ? Zap : plan.name === 'resolve_together' ? Crown : undefined}
                >
                  {plan.price.monthly === 0 ? 'Get Started Free' : 'Get Started'}
                </Button>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <Card>
            <h3 className="text-2xl font-bold text-neutral-800 mb-8 text-center">Detailed Feature Comparison</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-3 px-4 font-medium text-neutral-800">Features</th>
                    <th className="text-center py-3 px-4 font-medium text-neutral-800">Free</th>
                    <th className="text-center py-3 px-4 font-medium text-neutral-800">Reflect+</th>
                    <th className="text-center py-3 px-4 font-medium text-neutral-800">Resolve Together</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((category, categoryIndex) => (
                    <React.Fragment key={categoryIndex}>
                      <tr>
                        <td colSpan={4} className="py-4 px-4">
                          <h4 className="font-semibold text-neutral-800 text-sm uppercase tracking-wide">
                            {category.category}
                          </h4>
                        </td>
                      </tr>
                      {category.items.map((item, itemIndex) => (
                        <tr key={itemIndex} className="border-b border-neutral-100">
                          <td className="py-3 px-4 text-neutral-700">{item.name}</td>
                          <td className="py-3 px-4 text-center">
                            {typeof item.free === 'boolean' ? (
                              item.free ? (
                                <Check className="w-4 h-4 text-success-500 mx-auto" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-neutral-300 mx-auto" />
                              )
                            ) : (
                              <span className="text-sm text-neutral-600">{item.free}</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {typeof item.reflect === 'boolean' ? (
                              item.reflect ? (
                                <Check className="w-4 h-4 text-success-500 mx-auto" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-neutral-300 mx-auto" />
                              )
                            ) : (
                              <span className="text-sm text-neutral-600">{item.reflect}</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {typeof item.resolve === 'boolean' ? (
                              item.resolve ? (
                                <Check className="w-4 h-4 text-success-500 mx-auto" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-neutral-300 mx-auto" />
                              )
                            ) : (
                              <span className="text-sm text-neutral-600">{item.resolve}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-neutral-600">Everything you need to know about our plans</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6">
                <h4 className="font-semibold text-neutral-800 mb-3">{faq.question}</h4>
                <p className="text-neutral-600 text-sm leading-relaxed">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <Card className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white border-0 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Wellness Journey?</h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands who have transformed their emotional wellness with AwakNow. 
              Start free and upgrade when you're ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/auth')}
                variant="accent"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                className="bg-white text-primary-600 hover:bg-primary-50"
              >
                Start Free Today
              </Button>
              <Button
                onClick={() => navigate('/about')}
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                Learn More
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};