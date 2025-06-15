import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Brain, Users, ArrowRight, Crown, Zap, Star, Check, Shield } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { TranslatedText } from '../components/UI/TranslatedText';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../components/Layout/TopBar';
import { Footer } from '../components/Layout/Footer';
import { SUBSCRIPTION_PLANS } from '../config/subscriptionPlans';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Reflection',
      description: 'Get personalized insights through intelligent video conversations that adapt to your emotional state.',
      color: 'from-primary-500 to-primary-600'
    },
    {
      icon: Users,
      title: 'Conflict Resolution',
      description: 'Navigate interpersonal challenges with guided mediation and communication tools.',
      color: 'from-secondary-500 to-secondary-600'
    },
    {
      icon: Heart,
      title: 'Emotional Wellness',
      description: 'Track your emotional journey with sentiment analysis and personalized wellness insights.',
      color: 'from-accent-500 to-accent-600'
    }
  ];

  const plans = Object.values(SUBSCRIPTION_PLANS);

  const formatFeature = (value: number | 'unlimited') => {
    return value === 'unlimited' ? 'Unlimited' : value.toString();
  };

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
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-neutral-800 mb-6 leading-tight">
              <TranslatedText>Your Journey to</TranslatedText>
              <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
                {' '}<TranslatedText>Emotional Wellness</TranslatedText>
              </span>
            </h1>
            <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              <TranslatedText>AwakNow combines AI-powered conversations with personalized insights to help you reflect privately or resolve conflicts with others in a safe, supportive environment.</TranslatedText>
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <Button
              onClick={() => navigate('/auth')}
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
              className="text-lg px-12 py-4"
            >
              <TranslatedText>Start Your Journey</TranslatedText>
            </Button>
          </motion.div>

          {/* Feature Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative mx-auto max-w-4xl"
          >
            <div className="aspect-video bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-3xl shadow-large border-8 border-white overflow-hidden relative">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
                style={{
                  backgroundImage: `url('https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`
                }}
              />
              <div className="relative h-full flex items-center justify-center bg-gradient-to-br from-primary-500/10 to-secondary-500/10">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mx-auto flex items-center justify-center">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-neutral-700">
                    <TranslatedText>AI Video Sessions</TranslatedText>
                  </h3>
                  <p className="text-neutral-600 max-w-md mx-auto">
                    <TranslatedText>Experience personalized conversations that understand and respond to your emotions</TranslatedText>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
            >
              <Card hover className="text-center h-full">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mx-auto mb-6 flex items-center justify-center`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-800 mb-4">
                  <TranslatedText>{feature.title}</TranslatedText>
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  <TranslatedText>{feature.description}</TranslatedText>
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Pricing Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">
              <TranslatedText>Choose Your Plan</TranslatedText>
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              <TranslatedText>Start free and upgrade as your wellness journey grows</TranslatedText>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
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

                <Card className={`text-center h-full ${plan.name === 'reflect_plus' ? 'ring-2 ring-accent-500 ring-opacity-50' : ''}`}>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-neutral-800 mb-2">{plan.displayName}</h3>
                    
                    <div className="space-y-1">
                      <div className="text-3xl font-bold text-neutral-800">
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
                    icon={plan.name === 'reflect_plus' ? Zap : undefined}
                  >
                    {plan.price.monthly === 0 ? 'Get Started Free' : 'Get Started'}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Trust Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.8 }}
            className="text-center mt-8"
          >
            <div className="flex items-center justify-center space-x-2 text-neutral-600">
              <Shield className="w-5 h-5 text-success-500" />
              <p className="text-sm">
                <strong>🔒 Your data is private and encrypted</strong>, even as a company we can't read your data. 
                <strong> Cancel anytime - no questions asked.</strong>
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.0 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white border-0">
            <h2 className="text-3xl font-bold mb-4">
              <TranslatedText>Ready to Begin?</TranslatedText>
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              <TranslatedText>Join thousands who have transformed their emotional wellness through AI-guided reflection and conflict resolution.</TranslatedText>
            </p>
            <Button
              onClick={() => navigate('/auth')}
              variant="accent"
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
              className="bg-white text-primary-600 hover:bg-primary-50"
            >
              <TranslatedText>Get Started Now</TranslatedText>
            </Button>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};