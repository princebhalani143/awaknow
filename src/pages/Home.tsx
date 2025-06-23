import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Users, Sparkles, TrendingUp, Clock, Star, Play, Crown, ArrowRight, Shield, Zap, Heart, Award, Target, BarChart3, X, TestTube } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { TranslatedText } from '../components/UI/TranslatedText';
import { TopBar } from '../components/Layout/TopBar';
import { Footer } from '../components/Layout/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { SessionService } from '../services/sessionService';
import { TavusService } from '../services/tavusService';
import { supabase } from '../lib/supabase';

interface UserStats {
  totalSessions: number;
  totalMinutesUsed: number;
  averageEmotionScore: number;
  completedSessions: number;
  insightsGenerated: number;
  currentStreak: number;
}

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { subscription, limits, loading, loadSubscription } = useSubscriptionStore();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (user) {
      loadSubscription(user.id);
      loadUserStats();
    }
  }, [user, loadSubscription]);

  const loadUserStats = async () => {
    if (!user) return;

    try {
      setLoadingStats(true);

      // Get user sessions
      const sessions = await SessionService.getUserSessions(user.id);
      
      // Get Tavus usage stats
      const tavusStats = await TavusService.getTavusUsageStats(user.id);
      
      // Get insights count
      const { count: insightsCount } = await supabase
        .from('insights')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

      // Get average emotion score from insights
      const { data: emotionData } = await supabase
        .from('insights')
        .select('emotion_score')
        .eq('user_id', user.id)
        .not('emotion_score', 'is', null);

      const averageEmotionScore = emotionData && emotionData.length > 0
        ? emotionData.reduce((sum, insight) => sum + (insight.emotion_score || 0), 0) / emotionData.length
        : 0;

      // Calculate current streak (consecutive days with sessions)
      const currentStreak = calculateStreak(sessions);

      const userStats: UserStats = {
        totalSessions: sessions.length,
        totalMinutesUsed: tavusStats.totalMinutesUsed,
        averageEmotionScore: Math.round(averageEmotionScore * 10) / 10,
        completedSessions: sessions.filter(s => s.status === 'completed').length,
        insightsGenerated: insightsCount || 0,
        currentStreak,
      };

      setStats(userStats);
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const calculateStreak = (sessions: any[]): number => {
    if (sessions.length === 0) return 0;

    const sessionDates = sessions
      .map(s => new Date(s.created_at).toDateString())
      .filter((date, index, arr) => arr.indexOf(date) === index)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    const today = new Date().toDateString();
    let currentDate = new Date();

    for (const sessionDate of sessionDates) {
      const checkDate = currentDate.toDateString();
      if (sessionDate === checkDate) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const options = [
    {
      id: 'reflect',
      title: 'Reflect Alone',
      description: 'Private AI-powered sessions for personal emotional exploration and growth',
      icon: Brain,
      color: 'from-primary-500 to-primary-600',
      features: ['AI Video Conversations', 'Emotion Tracking', 'Personal Insights', 'Voice Analysis'],
      route: '/reflect',
      available: true,
    },
    {
      id: 'resolve',
      title: 'Resolve With Someone',
      description: 'Guided conflict resolution sessions with AI mediation for better relationships',
      icon: Users,
      color: 'from-secondary-500 to-secondary-600',
      features: ['AI Mediation', 'Safe Environment', 'Communication Tools', 'Shared Insights'],
      route: '/resolve',
      available: limits?.canCreateGroupSessions || false,
    }
  ];

  const displayStats = [
    { 
      label: 'Sessions Completed', 
      value: loadingStats ? '...' : stats?.completedSessions.toString() || '0', 
      icon: Clock,
      color: 'text-primary-500',
      bgColor: 'bg-primary-50'
    },
    { 
      label: 'Current Streak', 
      value: loadingStats ? '...' : `${stats?.currentStreak || 0}`, 
      unit: 'days',
      icon: TrendingUp,
      color: 'text-success-500',
      bgColor: 'bg-success-50'
    },
    { 
      label: 'Wellness Score', 
      value: loadingStats ? '...' : stats?.averageEmotionScore.toFixed(1) || '0.0', 
      icon: Star,
      color: 'text-accent-500',
      bgColor: 'bg-accent-50'
    },
    { 
      label: 'AI Minutes Used', 
      value: loadingStats ? '...' : stats?.totalMinutesUsed.toString() || '0', 
      icon: Brain,
      color: 'text-secondary-500',
      bgColor: 'bg-secondary-50'
    },
  ];

  const achievements = [
    { icon: Award, title: 'First Session', description: 'Completed your first reflection', unlocked: (stats?.totalSessions || 0) > 0 },
    { icon: Target, title: 'Consistent Practice', description: '7-day streak achieved', unlocked: (stats?.currentStreak || 0) >= 7 },
    { icon: Heart, title: 'Emotional Growth', description: 'Wellness score above 7.0', unlocked: (stats?.averageEmotionScore || 0) >= 7.0 },
    { icon: BarChart3, title: 'Data Driven', description: '10+ insights generated', unlocked: (stats?.insightsGenerated || 0) >= 10 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col">
        <TopBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col">
      <TopBar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl flex-1">
        {/* Hero Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
              <TranslatedText>Welcome back, {user?.email?.split('@')[0] || 'Friend'}! 👋</TranslatedText>
            </h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              <TranslatedText>Continue your journey of emotional wellness and personal growth with AI-powered insights</TranslatedText>
            </p>
          </div>

          {/* Premium Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {displayStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center p-6 hover:shadow-medium transition-all duration-300">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl mx-auto mb-3 flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-3xl font-bold text-neutral-800 mb-1">
                    {stat.value}
                    {stat.unit && <span className="text-lg font-normal text-neutral-600 ml-1">{stat.unit}</span>}
                  </div>
                  <div className="text-sm text-neutral-500">
                    <TranslatedText>{stat.label}</TranslatedText>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tavus Test Panel - Development Only */}
        {import.meta.env.DEV && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-accent-50 to-warning-50 border-accent-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <TestTube className="w-6 h-6 text-accent-600" />
                  <div>
                    <h3 className="font-semibold text-accent-800">Tavus Integration Test</h3>
                    <p className="text-sm text-accent-700">
                      Test your AI conversation setup with persona {TavusService.personaId}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => navigate('/tavus-test')}
                  variant="accent"
                  size="sm"
                  icon={TestTube}
                >
                  Run Tests
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Premium AI Video Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <Card className="overflow-hidden bg-gradient-to-br from-neutral-900 to-neutral-800 text-white border-0">
            <div className="grid lg:grid-cols-2 gap-8 p-8">
              {/* Content Side */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-accent-400 rounded-full animate-pulse"></div>
                    <span className="text-accent-400 text-sm font-medium uppercase tracking-wide">AI-Powered Sessions</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                    <TranslatedText>Your Personal AI Wellness Companion</TranslatedText>
                  </h2>
                  <p className="text-neutral-300 text-lg leading-relaxed">
                    <TranslatedText>
                      Experience personalized conversations that understand your unique emotional patterns, 
                      provide real-time insights, and guide you toward meaningful growth and healing.
                    </TranslatedText>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {['Real-time Emotion Analysis', 'Personalized Responses', 'Voice & Video Support', 'Privacy Protected'].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-accent-400" />
                      <span className="text-sm text-neutral-300">
                        <TranslatedText>{feature}</TranslatedText>
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={() => navigate('/reflect')}
                    variant="accent"
                    size="lg"
                    icon={Play}
                    className="bg-accent-500 hover:bg-accent-600"
                  >
                    <TranslatedText>Start Session</TranslatedText>
                  </Button>
                  <Button
                    onClick={() => navigate('/analytics')}
                    variant="ghost"
                    size="lg"
                    className="text-white border-white/20 hover:bg-white/10"
                  >
                    <TranslatedText>View Analytics</TranslatedText>
                  </Button>
                </div>
              </div>

              {/* Video/Image Side */}
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-neutral-700 to-neutral-600 rounded-2xl overflow-hidden relative">
                  {/* Background Image from Unsplash */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
                    style={{
                      backgroundImage: `url('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')`
                    }}
                  />
                  
                  {/* Overlay Content */}
                  <div className="relative h-full flex items-center justify-center">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowVideo(true)}
                      className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-large hover:bg-white/30 transition-colors group"
                    >
                      <Play className="w-8 h-8 text-white ml-1 group-hover:text-accent-200" />
                    </motion.button>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                    3:42
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Usage Overview & Achievements */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Usage Overview */}
          {subscription && limits && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="lg:col-span-2"
            >
              <Card className="h-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-neutral-800">Your Plan Usage</h3>
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 rounded-full text-sm font-medium flex items-center space-x-1">
                      <Crown className="w-3 h-3" />
                      <span>{subscription.plan_name}</span>
                    </span>
                    <Button
                      onClick={() => navigate('/subscription')}
                      variant="outline"
                      size="sm"
                      icon={Crown}
                    >
                      Upgrade
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-neutral-50 rounded-xl">
                      <div className="text-2xl font-bold text-secondary-600">
                        {limits.tavusMinutes === '500' ? '∞' : limits.tavusMinutes}
                      </div>
                      <div className="text-sm text-neutral-600">AI Minutes Count</div>
                    </div>
                    <div>
                    </div>
                    
                    <div className="p-4 bg-secondary-50 rounded-xl">
                      <div className="text-2xl font-bold text-secondary-600">
                        {limits.soloSessionsToday === 'unlimited' ? '∞' : limits.soloSessionsToday}
                      </div>
                      <div className="text-sm text-secondary-700">Sessions Today</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-accent-50 rounded-xl">
                      <div className="text-2xl font-bold text-accent-600">
                        {limits.insightsThisWeek === 'unlimited' ? '∞' : limits.insightsThisWeek}
                      </div>
                      <div className="text-sm text-accent-700">Insights Left</div>
                    </div>
                    
                    <div className="p-4 bg-neutral-50 rounded-xl">
                      <div className={`text-2xl font-bold ${limits.canCreateGroupSessions ? 'text-success-600' : 'text-neutral-400'}`}>
                        {limits.canCreateGroupSessions ? '✓' : '✗'}
                      </div>
                      <div className="text-sm text-neutral-600">Group Sessions</div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Card className="h-full">
              <h3 className="text-xl font-semibold text-neutral-800 mb-6">Achievements</h3>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div 
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                      achievement.unlocked 
                        ? 'bg-success-50 border border-success-200' 
                        : 'bg-neutral-50 border border-neutral-200 opacity-60'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      achievement.unlocked 
                        ? 'bg-success-500 text-white' 
                        : 'bg-neutral-300 text-neutral-500'
                    }`}>
                      <achievement.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium text-sm ${
                        achievement.unlocked ? 'text-success-800' : 'text-neutral-600'
                      }`}>
                        {achievement.title}
                      </div>
                      <div className={`text-xs mt-1 ${
                        achievement.unlocked ? 'text-success-600' : 'text-neutral-500'
                      }`}>
                        {achievement.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        
      {/* Video Modal */}
      {showVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowVideo(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Embedded Video */}
            <iframe
              src="https://www.youtube.com/embed/ZcdwGRnV1Fs?autoplay=1&rel=0&modestbranding=1"
              title="AwakNow Personal Dashboard Demo"
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </div>
  );
};