import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Users, Sparkles, TrendingUp, Clock, Star, Play, Crown, ArrowRight, Shield, Zap, Heart, Award, Target, BarChart3, X, ChevronLeft, ChevronRight, User, Building, Globe, Leaf } from 'lucide-react';
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

interface ConflictType {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgImage: string;
  techniques?: string[];
  stages?: string[];
  approaches?: string[];
  mechanisms?: string[];
  strategies?: string[];
}

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { subscription, limits, loading, loadSubscription } = useSubscriptionStore();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const conflictTypes: ConflictType[] = [
    {
      id: 'internal',
      title: 'Internal Conflict',
      description: 'Personal conflicts within oneself due to competing values, desires, or decisions.',
      icon: User,
      color: 'from-primary-500 to-primary-600',
      bgImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      techniques: [
        'Self-reflection and awareness',
        'Clarifying personal values',
        'Decision-making frameworks',
        'Seeking guidance or counseling',
        'Mindfulness and emotional regulation'
      ]
    },
    {
      id: 'interpersonal',
      title: 'Interpersonal Conflict',
      description: 'Conflicts between individuals due to differences in values, goals, communication styles, or personalities.',
      icon: Users,
      color: 'from-secondary-500 to-secondary-600',
      bgImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      stages: [
        'Acknowledge the conflict exists',
        'Open communication between parties',
        'Identify underlying interests',
        'Generate possible solutions',
        'Agree on a resolution and follow through'
      ]
    },
    {
      id: 'organizational',
      title: 'Organizational Conflict',
      description: 'Conflicts within organizations due to competing goals, limited resources, or structural issues.',
      icon: Building,
      color: 'from-accent-500 to-accent-600',
      bgImage: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      approaches: [
        'Clarify roles and responsibilities',
        'Improve communication channels',
        'Establish fair resource allocation',
        'Create conflict resolution procedures',
        'Promote collaborative culture'
      ]
    },
    {
      id: 'international',
      title: 'International Conflict',
      description: 'Conflicts between nations over territory, resources, ideology, or power dynamics.',
      icon: Globe,
      color: 'from-warning-500 to-warning-600',
      bgImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      mechanisms: [
        'Diplomatic negotiations',
        'International mediation',
        'Peace treaties and agreements',
        'Economic cooperation',
        'International law and institutions'
      ]
    },
    {
      id: 'environmental',
      title: 'Environmental Conflict',
      description: 'Conflicts over natural resources, land use, pollution, and environmental conservation.',
      icon: Leaf,
      color: 'from-success-500 to-success-600',
      bgImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      strategies: [
        'Sustainable resource management',
        'Stakeholder engagement',
        'Environmental impact assessments',
        'Policy and regulatory frameworks',
        'Community-based solutions'
      ]
    }
  ];

  useEffect(() => {
    if (user) {
      loadSubscription(user.id);
      loadUserStats();
    }
  }, [user, loadSubscription]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % conflictTypes.length);
    }, 6000); // Auto-advance every 6 seconds

    return () => clearInterval(timer);
  }, [conflictTypes.length]);

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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % conflictTypes.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + conflictTypes.length) % conflictTypes.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
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

        {/* Conflict Types Slider - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12 -mx-4"
        >
          <div className="text-center mb-8 px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
              <TranslatedText>Types of Conflicts</TranslatedText>
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              <TranslatedText>Explore different conflict types and their resolution stages</TranslatedText>
            </p>
          </div>

          <div className="relative w-full">
            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 text-white">
              <div className="relative h-[500px] md:h-[600px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 300 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -300 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    {/* Background Image */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                      style={{
                        backgroundImage: `url('${conflictTypes[currentSlide].bgImage}')`
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
                    
                    {/* Content */}
                    <div className="relative h-full flex items-center">
                      <div className="container mx-auto px-8">
                        <div className="grid lg:grid-cols-2 gap-8 items-center">
                          {/* Left Content */}
                          <div className="space-y-6">
                            <div className="flex items-center space-x-3">
                              <div className={`w-12 h-12 bg-gradient-to-br ${conflictTypes[currentSlide].color} rounded-xl flex items-center justify-center`}>
                                {React.createElement(conflictTypes[currentSlide].icon, { className: "w-6 h-6 text-white" })}
                              </div>
                              <span className="text-accent-400 text-sm font-medium uppercase tracking-wide">
                                Conflict Resolution
                              </span>
                            </div>
                            
                            <h3 className="text-3xl md:text-4xl font-bold leading-tight">
                              {conflictTypes[currentSlide].title}
                            </h3>
                            
                            <p className="text-neutral-300 text-lg leading-relaxed">
                              {conflictTypes[currentSlide].description}
                            </p>

                            <div className="flex space-x-4">
                              <Button
                                onClick={() => navigate('/resolve')}
                                variant="accent"
                                size="lg"
                                icon={Users}
                                className="bg-accent-500 hover:bg-accent-600"
                              >
                                <TranslatedText>Start Resolution</TranslatedText>
                              </Button>
                              <Button
                                onClick={() => navigate('/blog')}
                                variant="ghost"
                                size="lg"
                                className="text-white border-white/20 hover:bg-white/10"
                              >
                                <TranslatedText>Learn More</TranslatedText>
                              </Button>
                            </div>
                          </div>

                          {/* Right Content - Resolution Methods */}
                          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6">
                            <h4 className="text-xl font-semibold mb-4 text-accent-400">
                              {conflictTypes[currentSlide].techniques ? 'Resolution Techniques:' :
                               conflictTypes[currentSlide].stages ? 'Resolution Stages:' :
                               conflictTypes[currentSlide].approaches ? 'Resolution Approaches:' :
                               conflictTypes[currentSlide].mechanisms ? 'Resolution Mechanisms:' :
                               'Resolution Strategies:'}
                            </h4>
                            <ul className="space-y-3">
                              {(conflictTypes[currentSlide].techniques || 
                                conflictTypes[currentSlide].stages || 
                                conflictTypes[currentSlide].approaches || 
                                conflictTypes[currentSlide].mechanisms || 
                                conflictTypes[currentSlide].strategies || []).map((item, index) => (
                                <motion.li
                                  key={index}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: index * 0.1 }}
                                  className="flex items-start space-x-3"
                                >
                                  <div className="w-2 h-2 bg-accent-400 rounded-full mt-2 flex-shrink-0" />
                                  <span className="text-neutral-200 text-sm leading-relaxed">{item}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Slide Indicators */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                  {conflictTypes.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentSlide ? 'bg-accent-400' : 'bg-white/30 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
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
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-neutral-700">AI Minutes</span>
                        <span className="text-sm text-neutral-600">{limits.tavusMinutes} left</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(10, (limits.tavusMinutes / subscription.tavus_minutes_limit) * 100)}%` }}
                        />
                      </div>
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
                      <div className={`text-xs ${
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

        {/* Main Session Options */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="grid md:grid-cols-2 gap-8 mb-12"
        >
          {options.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 + index * 0.2 }}
            >
              <Card 
                hover={option.available} 
                onClick={option.available ? () => navigate(option.route) : undefined} 
                className={`h-full ${option.available ? 'cursor-pointer' : 'opacity-60'} group`}
              >
                <div className="space-y-6 p-2">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${option.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <option.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                        <TranslatedText>{option.title}</TranslatedText>
                      </h3>
                      <p className="text-neutral-600 leading-relaxed">
                        <TranslatedText>{option.description}</TranslatedText>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {option.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-accent-500" />
                        <span className="text-sm text-neutral-600">
                          <TranslatedText>{feature}</TranslatedText>
                        </span>
                      </div>
                    ))}
                  </div>

                  {option.available ? (
                    <Button className="w-full" variant={index === 0 ? 'primary' : 'secondary'} size="lg">
                      <TranslatedText>Start Session</TranslatedText>
                    </Button>
                  ) : (
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/subscription');
                      }}
                      className="w-full" 
                      variant="outline"
                      size="lg"
                      icon={Crown}
                    >
                      <TranslatedText>Upgrade Required</TranslatedText>
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Premium Upgrade CTA */}
        {subscription?.plan_id === 'awaknow_free' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
          >
            <Card className="bg-gradient-to-r from-accent-500 via-accent-600 to-primary-600 text-white border-0 overflow-hidden relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div 
                  className="w-full h-full bg-repeat"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                  }}
                />
              </div>
              
              <div className="relative p-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      <Crown className="w-6 h-6 text-accent-200" />
                      <span className="text-accent-200 text-sm font-medium uppercase tracking-wide">Premium Experience</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                      <TranslatedText>Unlock Your Full Potential</TranslatedText>
                    </h3>
                    <p className="text-accent-100 mb-4 max-w-2xl">
                      <TranslatedText>
                        Get unlimited sessions, advanced AI insights, group conflict resolution, 
                        and priority support. Transform your emotional wellness journey today.
                      </TranslatedText>
                    </p>
                    <div className="flex items-center space-x-6 text-sm text-accent-100">
                      <div className="flex items-center space-x-1">
                        <Zap className="w-4 h-4" />
                        <span>Unlimited Sessions</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Shield className="w-4 h-4" />
                        <span>Advanced Analytics</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>Group Sessions</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-8">
                    <Button 
                      onClick={() => navigate('/subscription')}
                      variant="accent" 
                      size="lg"
                      className="bg-white text-accent-600 hover:bg-accent-50 shadow-large"
                      icon={ArrowRight}
                    >
                      <TranslatedText>Upgrade Now</TranslatedText>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Trust & Security Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="text-center mt-12"
        >
          <div className="flex items-center justify-center space-x-2 text-neutral-600">
            <Shield className="w-5 h-5 text-success-500" />
            <p className="text-sm">
              <TranslatedText>Your data is private, encrypted, and yours alone; even we can't see it. You can cancel anytime, no questions asked.</TranslatedText>
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};