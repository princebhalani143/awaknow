import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Video, Brain, Users } from 'lucide-react';
import { Card } from '../UI/Card';

interface UsageMeterProps {
  limits: {
    tavusMinutes: number;
    soloSessionsToday: number | 'unlimited';
    insightsThisWeek: number | 'unlimited';
    canCreateGroupSessions: boolean;
  };
  subscription: {
    tavus_minutes_limit: number;
    plan_name: string;
  };
}

export const UsageMeter: React.FC<UsageMeterProps> = ({ limits, subscription }) => {
  const tavusPercentage = (limits.tavusMinutes / subscription.tavus_minutes_limit) * 100;
  
  const getUsageColor = (percentage: number) => {
    if (percentage > 80) return 'text-success-600 bg-success-500';
    if (percentage > 50) return 'text-warning-600 bg-warning-500';
    return 'text-error-600 bg-error-500';
  };

  const formatLimit = (value: number | 'unlimited') => {
    return value === 'unlimited' ? '∞' : value.toString();
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-800">Usage Overview</h3>
        <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
          {subscription.plan_name}
        </span>
      </div>

      <div className="space-y-6">
        {/* Tavus Minutes */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Video className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-neutral-700">AI Video Minutes</span>
            </div>
            <span className="text-sm text-neutral-600">
              {limits.tavusMinutes} / {subscription.tavus_minutes_limit}
              <p>Each additional minute will incur a charge of $0.20 USD, billed to your card.</p>
            </span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(0, 100)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-2 rounded-full ${getUsageColor(tavusPercentage)}`}
            />
          </div>
          {limits.tavusMinutes <= 5 && (
            <p className="text-xs text-warning-600 mt-1">
              Running low on video minutes. Consider upgrading your plan.
            </p>
          )}
        </div>

        {/* Solo Sessions Today */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 text-secondary-500" />
            <span className="text-sm font-medium text-neutral-700">Solo Sessions Today</span>
          </div>
          <span className="text-sm text-neutral-600">
            {formatLimit(limits.soloSessionsToday)} remaining
          </span>
        </div>

        {/* Insights This Week */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-accent-500" />
            <span className="text-sm font-medium text-neutral-700">AI Insights This Week</span>
          </div>
          <span className="text-sm text-neutral-600">
            {formatLimit(limits.insightsThisWeek)} remaining
          </span>
        </div>

        {/* Group Sessions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium text-neutral-700">Group Sessions</span>
          </div>
          <span className={`text-sm ${limits.canCreateGroupSessions ? 'text-success-600' : 'text-neutral-500'}`}>
            {limits.canCreateGroupSessions ? 'Available' : 'Upgrade Required'}
          </span>
        </div>
      </div>
    </Card>
  );
};