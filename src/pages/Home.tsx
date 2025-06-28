import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Heart, 
  Brain, 
  Users,
  Video,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { TopBar } from '../components/Layout/TopBar';
import { Footer } from '../components/Layout/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { SessionService } from '../services/sessionService';
import { TavusService } from '../services/tavusService';
import { supabase } from '../lib/supabase';

interface AnalyticsData {
  totalSessions: number;
  completedSessions: number;
  totalMinutesUsed: number;
  averageSessionDuration: number;
  emotionTrends: Array<{
    date: string;
    score: number;
    sentiment: string;
  }>;
  sessionsByType: {
    reflect_alone: number;
    resolve_together: number;
  };
  weeklyActivity: Array<{
    week: string;
    sessions: number;
    minutes: number;
  }>;
  topInsights: Array<{
    type: string;
    count: number;
    averageConfidence: number;
  }>;
  streakData: {
    currentStreak: number;
    longestStreak: number;
    streakDates: string[];
  };
}

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    if (user) {
      loadAnalytics();
      
      // Clean up any orphaned sessions
      TavusService.cleanupOrphanedSessions(user.id);
    }
  }, [user, timeRange]);

  const loadAnalytics = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get date range
      const now = new Date();
      const startDate = new Date();
      switch (timeRange) {
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      // Fetch sessions
      const sessions = await SessionService.getUserSessions(user.id);
      const filteredSessions = sessions.filter(
        s => new Date(s.created_at) >= startDate
      );

      // Fetch Tavus usage
      const tavusStats = await TavusService.getTavusUsageStats(user.id);

      // Fetch insights
      const { data: insights } = await supabase
        .from('insights')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString());

      // Calculate analytics
      const totalSessions = filteredSessions.length;
      const completedSessions = filteredSessions.filter(s => s.status === 'completed').length;
      
      // Session types
      const sessionsByType = {
        reflect_alone: filteredSessions.filter(s => s.session_type === 'reflect_alone').length,
        resolve_together: filteredSessions.filter(s => s.session_type === 'resolve_together').length,
      };

      // Emotion trends from insights
      const emotionTrends = insights
        ?.filter(i => i.emotion_score !== null)
        .map(i => ({
          date: new Date(i.created_at).toISOString().split('T')[0],
          score: i.emotion_score || 0,
          sentiment: i.sentiment || 'neutral',
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [];

      // Weekly activity
      const weeklyActivity = calculateWeeklyActivity(filteredSessions, startDate, now);

      // Top insights by type
      const insightTypes = insights?.reduce((acc, insight) => {
        const type = insight.insight_type;
        if (!acc[type]) {
          acc[type] = { count: 0, totalConfidence: 0 };
        }
        acc[type].count++;
        acc[type].totalConfidence += insight.ai_confidence || 0;
        return acc;
      }, {} as Record<string, { count: number; totalConfidence: number }>) || {};

      const topInsights = Object.entries(insightTypes).map(([type, data]) => ({
        type,
        count: data.count,
        averageConfidence: data.count > 0 ? data.totalConfidence / data.count : 0,
      }));

      // Streak calculation
      const streakData = calculateStreakData(sessions);

      const analyticsData: AnalyticsData = {
        totalSessions,
        completedSessions,
        totalMinutesUsed: tavusStats.totalMinutesUsed,
        averageSessionDuration: totalSessions > 0 ? tavusStats.totalMinutesUsed / totalSessions : 0,
        emotionTrends,
        sessionsByType,
        weeklyActivity,
        topInsights,
        streakData,
      };

      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateWeeklyActivity = (sessions: any[], startDate: Date, endDate: Date) => {
    const weeks: Array<{ week: string; sessions: number; minutes: number }> = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const weekStart = new Date(currentDate);
      const weekEnd = new Date(currentDate);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const weekSessions = sessions.filter(s => {
        const sessionDate = new Date(s.created_at);
        return sessionDate >= weekStart && sessionDate <= weekEnd;
      });

      const weekMinutes = weekSessions.reduce((sum, s) => sum + (s.tavus_minutes_used || 0), 0);

      weeks.push({
        week: `${weekStart.getMonth() + 1}/${weekStart.getDate()}`,
        sessions: weekSessions.length,
        minutes: weekMinutes,
      });

      currentDate.setDate(currentDate.getDate() + 7);
    }

    return weeks;
  };

  const calculateStreakData = (sessions: any[]) => {
    const sessionDates = sessions
      .map(s => new Date(s.created_at).toDateString())
      .filter((date, index, arr) => arr.indexOf(date) === index)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    const today = new Date().toDateString();
    let currentDate = new Date();

    // Calculate current streak
    for (const sessionDate of sessionDates) {
      const checkDate = currentDate.toDateString();
      if (sessionDate === checkDate) {
        currentStreak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Calculate longest streak
    for (let i = 0; i < sessionDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prevDate = new Date(sessionDates[i - 1]);
        const currDate = new Date(sessionDates[i]);
        const diffDays = Math.abs(prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (diffDays === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return {
      currentStreak,
      longestStreak,
      streakDates: sessionDates,
    };
  };

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
              Welcome, {user?.full_name || user?.email?.split('@')[0] || 'Friend'}! 👋
            </h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Continue your journey of emotional wellness and personal growth with AI-powered insights
            </p>
          </div>

          {/* Premium Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { 
                label: 'Sessions Completed', 
                value: loading ? '...' : analytics?.completedSessions.toString() || '0', 
                icon: Clock,
                color: 'text-primary-500',
                bgColor: 'bg-primary-50'
              },
              { 
                label: 'Current Streak', 
                value: loading ? '...' : `${analytics?.streakData.currentStreak || 0}`, 
                unit: 'days',
                icon: TrendingUp,
                color: 'text-success-500',
                bgColor: 'bg-success-50'
              },
              { 
                label: 'Wellness Score', 
                value: loading ? '...' : analytics?.averageEmotionScore.toFixed(1) || '0.0', 
                icon: Heart,
                color: 'text-accent-500',
                bgColor: 'bg-accent-50'
              },
              { 
                label: 'AI Minutes Used', 
                value: loading ? '...' : analytics?.totalMinutesUsed.toFixed(2) || '0', 
                icon: Brain,
                color: 'text-secondary-500',
                bgColor: 'bg-secondary-50'
              },
            ].map((stat, index) => (
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
                    {stat.label}
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
                    Your Personal AI Wellness Companion
                  </h2>
                  <p className="text-neutral-300 text-lg leading-relaxed">
                    Experience personalized conversations that understand your unique emotional patterns, 
                    provide real-time insights, and guide you toward meaningful growth and healing.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {['Real-time Emotion Analysis', 'Personalized Responses', 'Voice & Video Support', 'Privacy Protected'].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-accent-400" />
                      <span className="text-sm text-neutral-300">
                        {feature}
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
                    Start Session
                  </Button>
                  <Button
                    onClick={() => navigate('/analytics')}
                    variant="ghost"
                    size="lg"
                    className="text-white border-white/20 hover:bg-white/10"
                  >
                    View Reports
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
                      onClick={() => navigate('/reflect')}
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
                    {subscription.plan_id !== 'awaknow_pro' && (
                      <Button
                        onClick={() => navigate('/subscription')}
                        variant="outline"
                        size="sm"
                        icon={Crown}
                      >
                        Upgrade
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-neutral-50 rounded-xl">
                      <div className="text-2xl font-bold text-secondary-600">
                        {limits.tavusMinutes.toFixed(2)}
                      </div>
                      <div className="text-sm text-neutral-600">AI Minutes Remaining</div>
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
                {[
                  { icon: Award, title: 'First Session', description: 'Completed your first reflection', unlocked: (analytics?.totalSessions || 0) > 0 },
                  { icon: Target, title: 'Consistent Practice', description: '7-day streak achieved', unlocked: (analytics?.streakData.currentStreak || 0) >= 7 },
                  { icon: Heart, title: 'Emotional Growth', description: 'Wellness score above 7.0', unlocked: (analytics?.averageEmotionScore || 0) >= 7.0 },
                  { icon: BarChart3, title: 'Data Driven', description: '10+ insights generated', unlocked: (analytics?.topInsights.reduce((sum, insight) => sum + insight.count, 0) || 0) >= 10 },
                ].map((achievement, index) => (
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

        {/* Main Session Options */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="grid md:grid-cols-2 gap-8 mb-12"
        >
          {[
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
          ].map((option, index) => (
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
                        {option.title}
                      </h3>
                      <p className="text-neutral-600 leading-relaxed">
                        {option.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {option.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-accent-500" />
                        <span className="text-sm text-neutral-600">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {option.available ? (
                    <Button className="w-full" variant={index === 0 ? 'primary' : 'secondary'} size="lg">
                      Start Session
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
                      Upgrade Required
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Premium Upgrade CTA - Only show for free users */}
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
                      Unlock Your Full Potential
                    </h3>
                    <p className="text-accent-100 mb-4 max-w-2xl">
                      Get unlimited sessions, advanced AI insights, group conflict resolution, 
                      and priority support. Transform your emotional wellness journey today.
                    </p>
                    <div className="flex items-center space-x-6 text-sm text-accent-100">
                      <div className="flex items-center space-x-1">
                        <Zap className="w-4 h-4" />
                        <span>Unlimited Sessions</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Shield className="w-4 h-4" />
                        <span>Advanced Reports</span>
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
                      Upgrade Now
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
              Your data is private, encrypted, and yours alone; even we can't see it. You can cancel anytime, no questions asked.
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};