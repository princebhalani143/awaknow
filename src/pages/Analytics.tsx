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

export const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    if (user) {
      loadAnalytics();
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
            <p className="text-neutral-600">Loading your reports...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col">
        <TopBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-neutral-600">Unable to load reports data</p>
            <Button onClick={() => navigate('/home')} className="mt-4">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col">
      <TopBar />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl flex-1">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <Button
            onClick={() => navigate('/home')}
            variant="ghost"
            icon={ArrowLeft}
            className="!p-2"
          />
          <div className="text-center">
            <h1 className="text-3xl font-bold text-neutral-800">Reports Dashboard</h1>
            <p className="text-neutral-600">Your wellness journey insights</p>
          </div>
          <div className="flex space-x-2">
            {(['week', 'month', 'year'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="text-center p-4">
            <Clock className="w-6 h-6 text-primary-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-neutral-800">{analytics.totalSessions}</div>
            <div className="text-xs text-neutral-500">Total Sessions</div>
          </Card>

          <Card className="text-center p-4">
            <TrendingUp className="w-6 h-6 text-success-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-neutral-800">{analytics.completedSessions}</div>
            <div className="text-xs text-neutral-500">Completed</div>
          </Card>

          <Card className="text-center p-4">
            <Video className="w-6 h-6 text-secondary-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-neutral-800">{analytics.totalMinutesUsed.toFixed(2)}</div>
            <div className="text-xs text-neutral-500">AI Minutes Used</div>
          </Card>

          <Card className="text-center p-4">
            <Activity className="w-6 h-6 text-accent-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-neutral-800">{analytics.streakData.currentStreak}</div>
            <div className="text-xs text-neutral-500">Current Streak</div>
          </Card>
        </motion.div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Session Types */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <div className="flex items-center space-x-3 mb-4">
                <PieChart className="w-5 h-5 text-primary-500" />
                <h3 className="text-lg font-semibold text-neutral-800">Session Types</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-primary-500" />
                    <span className="text-sm text-neutral-700">Reflect Alone</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-neutral-200 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ 
                          width: `${analytics.totalSessions > 0 ? (analytics.sessionsByType.reflect_alone / analytics.totalSessions) * 100 : 0}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-neutral-800">
                      {analytics.sessionsByType.reflect_alone}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-secondary-500" />
                    <span className="text-sm text-neutral-700">Resolve Together</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-neutral-200 rounded-full h-2">
                      <div 
                        className="bg-secondary-500 h-2 rounded-full"
                        style={{ 
                          width: `${analytics.totalSessions > 0 ? (analytics.sessionsByType.resolve_together / analytics.totalSessions) * 100 : 0}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-neutral-800">
                      {analytics.sessionsByType.resolve_together}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Emotion Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card>
              <div className="flex items-center space-x-3 mb-4">
                <Heart className="w-5 h-5 text-accent-500" />
                <h3 className="text-lg font-semibold text-neutral-800">Emotion Trends</h3>
              </div>
              {analytics.emotionTrends.length > 0 ? (
                <div className="space-y-2">
                  <div className="text-sm text-neutral-600">Average Emotion Score</div>
                  <div className="text-2xl font-bold text-neutral-800">
                    {(analytics.emotionTrends.reduce((sum, trend) => sum + trend.score, 0) / analytics.emotionTrends.length).toFixed(1)}
                  </div>
                  <div className="text-xs text-neutral-500">
                    Based on {analytics.emotionTrends.length} insights
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-500">
                  <Heart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No emotion data yet</p>
                  <p className="text-xs">Complete sessions to see trends</p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Weekly Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-8"
        >
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <BarChart3 className="w-5 h-5 text-primary-500" />
              <h3 className="text-lg font-semibold text-neutral-800">Activity Over Time</h3>
            </div>
            {analytics.weeklyActivity.length > 0 ? (
              <div className="space-y-4">
                {analytics.weeklyActivity.map((week, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600 w-16">{week.week}</span>
                    <div className="flex-1 mx-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-neutral-200 rounded-full h-2">
                          <div 
                            className="bg-primary-500 h-2 rounded-full"
                            style={{ 
                              width: `${Math.max(10, (week.sessions / Math.max(...analytics.weeklyActivity.map(w => w.sessions))) * 100)}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium text-neutral-800 w-8">
                          {week.sessions}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-neutral-500 w-16 text-right">
                      {week.minutes.toFixed(2)}m
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No activity data yet</p>
                <p className="text-xs">Start sessions to see your progress</p>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Insights Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <Brain className="w-5 h-5 text-secondary-500" />
              <h3 className="text-lg font-semibold text-neutral-800">AI Insights Summary</h3>
            </div>
            {analytics.topInsights.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {analytics.topInsights.map((insight, index) => (
                  <div key={index} className="p-4 bg-neutral-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-neutral-800 capitalize">
                        {insight.type.replace('_', ' ')}
                      </span>
                      <span className="text-sm text-neutral-600">{insight.count}</span>
                    </div>
                    <div className="text-xs text-neutral-500">
                      Avg. Confidence: {(insight.averageConfidence * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500">
                <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No insights generated yet</p>
                <p className="text-xs">Complete sessions to receive AI insights</p>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};