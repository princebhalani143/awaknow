import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Users, Sparkles, TrendingUp, Clock, Star, Play } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { TranslatedText } from '../components/UI/TranslatedText';
import { TopBar } from '../components/Layout/TopBar';
import { Footer } from '../components/Layout/Footer';
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col">
      <TopBar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl flex-1">
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

        {/* AI Video Sessions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="overflow-hidden">
            <div className="relative">
              {/* Video Container */}
              <div className="aspect-video bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl overflow-hidden relative">
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
                  style={{
                    backgroundImage: `url('https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`
                  }}
                />
                
                {/* Overlay Content */}
                <div className="relative h-full flex items-center justify-center bg-gradient-to-br from-primary-500/20 to-secondary-500/20">
                  <div className="text-center space-y-4">
                    {/* Play Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-large hover:bg-white transition-colors group"
                    >
                      <Play className="w-8 h-8 text-primary-600 ml-1 group-hover:text-primary-700" />
                    </motion.button>
                    
                    <div className="space-y-2">
                      <h3 className="text-2xl font-semibold text-neutral-800">
                        <TranslatedText>AI Video Sessions</TranslatedText>
                      </h3>
                      <p className="text-neutral-600 max-w-md mx-auto">
                        <TranslatedText>Experience personalized conversations that understand and respond to your emotions</TranslatedText>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Video Duration Badge */}
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                  2:34
                </div>
              </div>

              {/* Video Description */}
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-neutral-800 mb-2">
                      <TranslatedText>See How AI Conversations Work</TranslatedText>
                    </h4>
                    <p className="text-neutral-600 text-sm leading-relaxed mb-4">
                      <TranslatedText>
                        Watch this demo to understand how our AI companion provides personalized emotional support 
                        through natural video conversations. See real examples of emotion recognition, empathetic responses, 
                        and personalized insights.
                      </TranslatedText>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['Emotion Recognition', 'Natural Conversations', 'Personalized Insights', 'Safe Environment'].map((feature) => (
                        <span
                          key={feature}
                          className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium"
                        >
                          <TranslatedText>{feature}</TranslatedText>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Main Options */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid md:grid-cols-2 gap-6 mb-8"
        >
          {options.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.2 }}
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

        {/* Upgrade CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
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

      <Footer />
    </div>
  );
};