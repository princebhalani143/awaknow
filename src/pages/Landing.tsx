import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Brain, Users, ArrowRight, Crown, Zap, Star, Check, Shield, Play, Sparkles } from 'lucide-react';
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
      title: 'AI-Powered Conversations',
      description: 'Experience natural, empathetic conversations with advanced AI that understands your emotions and provides personalized guidance.',
      color: 'from-primary-500 to-primary-600'
    },
    {
      icon: Users,
      title: 'Conflict Resolution',
      description: 'Navigate relationship challenges with AI-mediated sessions that promote understanding and healthy communication.',
      color: 'from-secondary-500 to-secondary-600'
    },
    {
      icon: Heart,
      title: 'Emotional Wellness',
      description: 'Track your emotional journey with real-time analysis, personalized insights, and evidence-based wellness strategies.',
      color: 'from-accent-500 to-accent-600'
    }
  ];

  const plans = Object.values(SUBSCRIPTION_PLANS);

  const formatFeature = (value: number | 'unlimited') => {
    return value === 'unlimited' ? 'Unlimited' : value.toString();
  };

  const stats = [
    { value: '10,000+', label: 'Users Helped' },
    { value: '95%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'AI Availability' },
    { value: '100%', label: 'Private & Secure' },
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
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-neutral-800 mb-6 leading-tight">
              <TranslatedText>Transform Your</TranslatedText>
              <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
                {' '}<TranslatedText>Emotional Wellness</TranslatedText>
              </span>
            </h1>
            <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              <TranslatedText>Experience the future of emotional wellness with AI-powered conversations, personalized insights, and conflict resolution tools designed to help you thrive.</TranslatedText>
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                onClick={() => navigate('/auth')}
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                className="text-lg px-12 py-4"
              >
                <TranslatedText>Start Your Journey</TranslatedText>
              </Button>
              <Button
                onClick={() => navigate('/about')}
                variant="outline"
                size="lg"
                className="text-lg px-12 py-4"
              >
                <TranslatedText>Learn More</TranslatedText>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{stat.value}</div>
                  <div className="text-sm text-neutral-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Hero Video/Demo */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative mx-auto max-w-4xl"
          >
            <Card className="overflow-hidden bg-gradient-to-br from-neutral-900 to-neutral-800 border-0">
              <div className="aspect-video relative">
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`
                  }}
                />
                
                {/* Overlay Content */}
                <div className="relative h-full flex items-center justify-center bg-gradient-to-br from-primary-500/20 to-secondary-500/20">
                  <div className="text-center space-y-6">
                    {/* Play Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-large hover:bg-white/30 transition-colors group"
                    >
                      <Play className="w-8 h-8 text-white ml-1 group-hover:text-accent-200" />
                    </motion.button>
                    
                    <div className="space-y-2">
                      <h3 className="text-2xl font-semibold text-white">
                        <TranslatedText>See AwakNow in Action</TranslatedText>
                      </h3>
                      <p className="text-white/80 max-w-md mx-auto">
                        <TranslatedText>Watch how AI-powered conversations can transform your emotional wellness journey</TranslatedText>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                  2:34
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">
              <TranslatedText>Why Choose AwakNow?</TranslatedText>
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              <TranslatedText>Advanced AI technology meets proven psychological principles for unprecedented emotional wellness support</TranslatedText>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
              >
                <Card hover className="text-center h-full group">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
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
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">
              <TranslatedText>How It Works</TranslatedText>
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              <TranslatedText>Simple steps to start your emotional wellness transformation</TranslatedText>
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Sign Up', description: 'Create your free account in seconds' },
              { step: '2', title: 'Choose Session', description: 'Select private reflection or group resolution' },
              { step: '3', title: 'Engage with AI', description: 'Have natural conversations with our AI companion' },
              { step: '4', title: 'Grow & Thrive', description: 'Receive insights and track your progress' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 text-white rounded-full mx-auto mb-4 flex items-center justify-center text-lg font-bold">
                  {item.step}
                </div>
                <h4 className="font-semibold text-neutral-800 mb-2">{item.title}</h4>
                <p className="text-neutral-600 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Pricing Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
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
                transition={{ duration: 0.6, delay: 1.6 + index * 0.1 }}
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
                <TranslatedText>Your data is private, encrypted, and yours alone; even we can't see it. You can cancel anytime, no questions asked.</TranslatedText>
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
          <Card className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white border-0 overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div 
                className="w-full h-full bg-repeat"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
              />
            </div>
            
            <div className="relative">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Sparkles className="w-6 h-6 text-accent-200" />
                <span className="text-accent-200 text-sm font-medium uppercase tracking-wide">Ready to Begin?</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">
                <TranslatedText>Transform Your Life Today</TranslatedText>
              </h2>
              <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                <TranslatedText>Join thousands who have already started their journey to better emotional health and stronger relationships.</TranslatedText>
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
                  <TranslatedText>Start Free Today</TranslatedText>
                </Button>
                <Button
                  onClick={() => navigate('/plans')}
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  <TranslatedText>View All Plans</TranslatedText>
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};