import { supabase } from '../lib/supabase';
import { SubscriptionService } from './subscriptionService';

export interface TavusVideoRequest {
  sessionId: string;
  userId: string;
  prompt: string;
  sessionType: 'reflect_alone' | 'resolve_together';
  participantContext?: string;
}

export interface TavusVideoResponse {
  success: boolean;
  videoUrl?: string;
  tavusSessionId?: string;
  minutesUsed?: number;
  error?: string;
}

export class TavusService {
  private static apiKey = import.meta.env.VITE_TAVUS_API_KEY;
  private static baseUrl = 'https://api.tavus.io/v1';

  static async createConversationalVideo(request: TavusVideoRequest): Promise<TavusVideoResponse> {
    try {
      // Check if user has enough Tavus minutes
      const canUse = await SubscriptionService.canUseTavusMinutes(request.userId, 5); // Estimate 5 minutes
      if (!canUse) {
        return {
          success: false,
          error: 'Insufficient Tavus minutes remaining. Please upgrade your plan.',
        };
      }

      // For now, simulate Tavus API call
      // In production, this would make actual API calls to Tavus
      const mockResponse = await this.simulateTavusAPI(request);

      if (mockResponse.success && mockResponse.minutesUsed) {
        // Update user's Tavus usage
        await SubscriptionService.incrementTavusUsage(request.userId, mockResponse.minutesUsed);

        // Log usage in tavus_usage table
        await supabase.from('tavus_usage').insert({
          user_id: request.userId,
          session_id: request.sessionId,
          minutes_used: mockResponse.minutesUsed,
          tavus_video_id: mockResponse.tavusSessionId,
        });

        // Update session with Tavus data
        await supabase
          .from('sessions')
          .update({
            tavus_video_url: mockResponse.videoUrl,
            tavus_session_id: mockResponse.tavusSessionId,
            tavus_minutes_used: mockResponse.minutesUsed,
            updated_at: new Date().toISOString(),
          })
          .eq('id', request.sessionId);
      }

      return mockResponse;
    } catch (error) {
      console.error('Error creating Tavus video:', error);
      return {
        success: false,
        error: 'Failed to create video session. Please try again.',
      };
    }
  }

  private static async simulateTavusAPI(request: TavusVideoRequest): Promise<TavusVideoResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock successful response
    const mockVideoId = `tavus_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const mockVideoUrl = `https://api.tavus.io/videos/${mockVideoId}`;

    return {
      success: true,
      videoUrl: mockVideoUrl,
      tavusSessionId: mockVideoId,
      minutesUsed: Math.floor(Math.random() * 5) + 2, // Random 2-6 minutes
    };
  }

  static async getTavusUsageStats(userId: string): Promise<{
    totalMinutesUsed: number;
    sessionsCount: number;
    currentMonthUsage: number;
  }> {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format

      const { data, error } = await supabase
        .from('tavus_usage')
        .select('minutes_used, usage_date')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching Tavus usage stats:', error);
        return { totalMinutesUsed: 0, sessionsCount: 0, currentMonthUsage: 0 };
      }

      const totalMinutesUsed = data.reduce((sum, usage) => sum + usage.minutes_used, 0);
      const sessionsCount = data.length;
      const currentMonthUsage = data
        .filter(usage => usage.usage_date.startsWith(currentMonth))
        .reduce((sum, usage) => sum + usage.minutes_used, 0);

      return {
        totalMinutesUsed,
        sessionsCount,
        currentMonthUsage,
      };
    } catch (error) {
      console.error('Error in getTavusUsageStats:', error);
      return { totalMinutesUsed: 0, sessionsCount: 0, currentMonthUsage: 0 };
    }
  }

  // Real Tavus API integration (commented out for now)
  /*
  private static async callTavusAPI(request: TavusVideoRequest): Promise<TavusVideoResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/conversations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: request.prompt,
          context: request.participantContext,
          session_type: request.sessionType,
          // Add other Tavus-specific parameters
        }),
      });

      if (!response.ok) {
        throw new Error(`Tavus API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        videoUrl: data.video_url,
        tavusSessionId: data.session_id,
        minutesUsed: data.duration_minutes,
      };
    } catch (error) {
      console.error('Tavus API error:', error);
      return {
        success: false,
        error: 'Failed to create video with Tavus API',
      };
    }
  }
  */
}