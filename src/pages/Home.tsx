import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Users, Sparkles, TrendingUp, Clock, Star } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { TranslatedText } from '../components/UI/TranslatedText';
import { TopBar } from '../components/Layout/TopBar';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const options = [
    {
      id: 'reflect',
      title: 'Reflect Alone',
      description: 'Private AI-powered sessions for personal emotional exploration and growth',
      icon: Brain,
      color: 'from-primary-500 to-primary-600',
      features: ['AI Video Conversations', 'Emotion Tracking', 'Personal Insights', 'Voice Analysis'],
      route: '/reflect'
    },
    {
      id: 'resolve',
      title: 'Resolve With Someone',
      description: 'Guided conflict resolution sessions with AI mediation for better relationships',
      icon: Users,
      color: 'from-secondary-500 to-secondary-600',
      features: ['AI Mediation', 'Safe Environment', 'Communication Tools', 'Shared Insights'],
      route: '/resolve'
    }
  ];

  const stats = [
    { label: 'Sessions Completed', value: '12', icon: Clock },
    { label: 'Emotional Growth', value: '85%', icon: TrendingUp },
    { label: 'Wellness Score', value: '4.8', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <TopBar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-800 mb-2">
              <TranslatedText>Welcome back, {user?.email?.split('@')[0] || 'Friend'}! 👋</TranslatedText>
            </h1>
            <p className="text-neutral-600">
              <TranslatedText>How would you like to explore your emotional wellness today?</TranslatedText>
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center p-4">
                  <stat.icon className="w-6 h-6 text-primary-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-neutral-800">{stat.value}</div>
                  <div className="text-xs text-neutral-500">
                    <TranslatedText>{stat.label}</TranslatedText>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Options */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid md:grid-cols-2 gap-6 mb-8"
        >
          {options.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.2 }}
            >
              <Card hover onClick={() => navigate(option.route)} className="h-full cursor-pointer">
                <div className="space-y-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${option.color} rounded-2xl flex items-center justify-center`}>
                    <option.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                      <TranslatedText>{option.title}</TranslatedText>
                    </h3>
                    <p className="text-neutral-600 mb-4 leading-relaxed">
                      <TranslatedText>{option.description}</TranslatedText>
                    </p>
                  </div>

                  <div className="space-y-2">
                    {option.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-accent-500" />
                        <span className="text-sm text-neutral-600">
                          <TranslatedText>{feature}</TranslatedText>
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full" variant={index === 0 ? 'primary' : 'secondary'}>
                    <TranslatedText>Start Session</TranslatedText>
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="bg-gradient-to-r from-accent-500 to-accent-600 text-white border-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">
                  <TranslatedText>Upgrade to Premium</TranslatedText>
                </h3>
                <p className="text-accent-100 text-sm">
                  <TranslatedText>Unlock unlimited sessions, advanced insights, and priority support</TranslatedText>
                </p>
              </div>
              <Button variant="accent" className="bg-white text-accent-600 hover:bg-accent-50">
                <TranslatedText>Upgrade Now</TranslatedText>
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};