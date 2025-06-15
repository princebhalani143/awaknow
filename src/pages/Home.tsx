import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Users, Sparkles, TrendingUp, Clock, Star, Crown, ArrowRight, Shield, Zap, Heart, Award, Target, BarChart3, Calendar, MessageCircle, Settings } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { TranslatedText } from '../components/UI/TranslatedText';
import { TopBar } from '../components/Layout/TopBar';
import { Footer } from '../components/Layout/Footer';
import { ConflictTypesSlider } from '../components/Home/ConflictTypesSlider';
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

interface RecentSession {
  id: string;
  session_type: string;
  title?: string;
  created_at: string;
  status: string;
}

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { subscription, limits, loading, loadSubscription } = useSubscriptionStore();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (user) {
      loadSubscription(user.id);
      loadUserStats();
      loadRecentSessions();
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

  const loadRecentSessions = async () => {
    if (!user) return;

    try {
      const sessions = await SessionService.getUserSessions(user.id);
      setRecentSessions(sessions.slice(0, 3)); // Get last 3 sessions
    } catch (error) {
      console.error('Error loading recent sessions:', error);
    }
  };

  const calculateStreak = (sessions: any[]): number => {
    if (sessions.length === 0) return 0;

    const sessionDates = sessions
      .map(s => new Date(s.created_at).toDateString())
      .filter((date, index, arr) => arr.indexOf(date) === index)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
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

  const quickActions = [
    {
      id: 'reflect',
      title: 'Quick Reflection',
      description: 'Start a 5-minute AI conversation',
      icon: Brain,
      color: 'from-primary-500 to-primary-600',
      route: '/reflect',
      available: true,
    },
    {
      id: 'resolve',
      title: 'Resolve Conflict',
      description: 'Get help with a relationship issue',
      icon: Users,
      color: 'from-secondary-500 to-secondary-600',
      route: '/resolve',
      available: limits?.canCreateGroupSessions || false,
    },
    {
      id: 'analytics',
      title: 'View Progress',
      description: 'Check your wellness journey',
      icon: BarChart3,
      color: 'from-accent-500 to-accent-600',
      route: '/analytics',
      available: true,
    },
    {
      id: 'subscription',
      title: 'Manage Plan',
      description: 'Update your subscription',
      icon: Crown,
      color: 'from-warning-500 to-warning-600',
      route: '/subscription',
      available: true,
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
        {/* Personal Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-neutral-800">
                <TranslatedText>Welcome back, {user?.email?.split('@')[0] || 'Friend'}! 👋</TranslatedText>
              </h1>
              <p className="text-lg text-neutral-600 mt-2">
                <TranslatedText>Ready to continue your wellness journey?</TranslatedText>
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-neutral-500">Today</div>
              <div className="text-lg font-semibold text-neutral-800">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center p-4 hover:shadow-medium transition-all duration-300">
                  <div className={`w-10 h-10 ${stat.bgColor} rounded-xl mx-auto mb-2 flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-neutral-800">
                    {stat.value}
                    {stat.unit && <span className="text-sm font-normal text-neutral-600 ml-1">{stat.unit}</span>}
                  </div>
                  <div className="text-xs text-neutral-500">
                    <TranslatedText>{stat.label}</TranslatedText>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-neutral-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              >
                <Card 
                  hover={action.available} 
                  onClick={action.available ? () => navigate(action.route) : undefined} 
                  className={`text-center p-4 h-full ${action.available ? 'cursor-pointer' : 'opacity-60'} group`}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-neutral-800 text-sm mb-1">
                    <TranslatedText>{action.title}</TranslatedText>
                  </h3>
                  <p className="text-xs text-neutral-600">
                    <TranslatedText>{action.description}</TranslatedText>
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-neutral-800">Recent Sessions</h3>
                <Button
                  onClick={() => navigate('/analytics')}
                  variant="outline"
                  size="sm"
                  icon={ArrowRight}
                >
                  View All
                </Button>
              </div>
              
              {recentSessions.length > 0 ? (
                <div className="space-y-4">
                  {recentSessions.map((session) => (
                    <div key={session.id} className="flex items-center space-x-4 p-3 bg-neutral-50 rounded-lg">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        session.session_type === 'reflect_alone' ? 'bg-primary-100' : 'bg-secondary-100'
                      }`}>
                        {session.session_type === 'reflect_alone' ? (
                          <Brain className={`w-5 h-5 text-primary-600`} />
                        ) : (
                          <Users className={`w-5 h-5 text-secondary-600`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-neutral-800">
                          {session.title || (session.session_type === 'reflect_alone' ? 'Personal Reflection' : 'Conflict Resolution')}
                        </div>
                        <div className="text-sm text-neutral-600 flex items-center space-x-2">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(session.created_at).toLocaleDateString()}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            session.status === 'completed' ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700'
                          }`}>
                            {session.status}
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() => navigate(`/session/${session.id}`)}
                        variant="ghost"
                        size="sm"
                        icon={ArrowRight}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                  <h4 className="font-medium text-neutral-800 mb-2">No sessions yet</h4>
                  <p className="text-neutral-600 text-sm mb-4">Start your first session to begin tracking your progress</p>
                  <Button
                    onClick={() => navigate('/reflect')}
                    icon={Brain}
                  >
                    Start Reflecting
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Achievements & Plan */}
          <div className="space-y-6">
            {/* Current Plan */}
            {subscription && limits && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-neutral-800">Your Plan</h3>
                    <span className="px-3 py-1 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 rounded-full text-sm font-medium flex items-center space-x-1">
                      <Crown className="w-3 h-3" />
                      <span>{subscription.plan_name}</span>
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-neutral-600">AI Minutes</span>
                        <span className="text-sm font-medium">{limits.tavusMinutes} left</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(10, (limits.tavusMinutes / subscription.tavus_minutes_limit) * 100)}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-2 bg-secondary-50 rounded-lg">
                        <div className="text-lg font-bold text-secondary-600">
                          {limits.soloSessionsToday === 'unlimited' ? '∞' : limits.soloSessionsToday}
                        </div>
                        <div className="text-xs text-secondary-700">Sessions Today</div>
                      </div>
                      <div className="text-center p-2 bg-accent-50 rounded-lg">
                        <div className="text-lg font-bold text-accent-600">
                          {limits.insightsThisWeek === 'unlimited' ? '∞' : limits.insightsThisWeek}
                        </div>
                        <div className="text-xs text-accent-700">Insights Left</div>
                      </div>
                    </div>

                    <Button
                      onClick={() => navigate('/subscription')}
                      variant="outline"
                      size="sm"
                      className="w-full"
                      icon={Settings}
                    >
                      Manage Plan
                    </Button>
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
              <Card>
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">Achievements</h3>
                <div className="space-y-3">
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
        </div>

        {/* Conflict Types Slider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mb-8"
        >
          <ConflictTypesSlider />
        </motion.div>

        {/* Upgrade CTA for Free Users */}
        {subscription?.plan_id === 'awaknow_free' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <Card className="bg-gradient-to-r from-accent-500 via-accent-600 to-primary-600 text-white border-0 overflow-hidden relative">
              <div className="absolute inset-0 opacity-10">
                <div 
                  className="w-full h-full bg-repeat"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                  }}
                />
              </div>
              
              <div className="relative p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Crown className="w-5 h-5 text-accent-200" />
                      <span className="text-accent-200 text-sm font-medium uppercase tracking-wide">Premium Experience</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                      <TranslatedText>Unlock Your Full Potential</TranslatedText>
                    </h3>
                    <p className="text-accent-100 mb-3 max-w-xl">
                      <TranslatedText>
                        Get unlimited sessions, advanced AI insights, group conflict resolution, 
                        and priority support.
                      </TranslatedText>
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-accent-100">
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
                  <div className="ml-6">
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
      </div>

      <Footer />
    </div>
  );
};