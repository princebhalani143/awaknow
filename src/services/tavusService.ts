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

export interface TavusConversationRequest {
  conversation_name: string;
  persona_id: string;
  replica_id: string;
  callback_url?: string;
  properties?: {
    max_call_duration?: number;
    participant_left_timeout?: number;
    participant_absent_timeout?: number;
    enable_recording?: boolean;
    enable_transcription?: boolean;
    language?: string;
  };
}

export class TavusService {
  private static apiKey = import.meta.env.VITE_TAVUS_API_KEY;
  private static baseUrl = 'https://tavusapi.com/v2';
  private static PERSONA_ID = 'ped1380851e4';
  private static REPLICA_ID = 'r4317e64d25a';

  static async createConversationalVideo(request: TavusVideoRequest): Promise<TavusVideoResponse> {
    if (!this.apiKey || this.apiKey === 'your_tavus_api_key') {
      return await this.simulateTavusAPI(request);
    }

    try {
      const { data: existingSession } = await supabase
        .from('tavus_sessions')
        .select('*')
        .eq('user_id', request.userId)
        .eq('status', 'active')
        .maybeSingle();

      if (existingSession) {
        return { success: false, error: 'You already have an active Tavus session.' };
      }

      const canUse = await SubscriptionService.incrementTavusUsage(request.userId, -50);
      if (!canUse) {
        return { success: false, error: 'Not enough Tavus credits.' };
      }

      const conversationRequest: TavusConversationRequest = {
        conversation_name: `awaknow_${request.sessionType}_${request.sessionId}`,
        persona_id: this.PERSONA_ID,
        replica_id: this.REPLICA_ID,
        callback_url: `${window.location.origin}/api/tavus/callback`,
        properties: {
          max_call_duration: 300,
          participant_left_timeout: 60,
          participant_absent_timeout: 120,
          enable_recording: true,
          enable_transcription: true,
          language: 'English',
        },
      };

      const response = await fetch(`${this.baseUrl}/conversations`, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(conversationRequest),
      });

      const data = await response.json();

      if (!response.ok || !data?.conversation_id) {
        return { success: false, error: 'Failed to create Tavus session.' };
      }

      await supabase.from('tavus_sessions').insert([{
        user_id: request.userId,
        tavus_session_id: data.conversation_id,
        status: 'active',
      }]);

      return {
        success: true,
        tavusSessionId: data.conversation_id,
        videoUrl: data.conversation_url || data.join_url,
        minutesUsed: 5,
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static async simulateTavusAPI(request: TavusVideoRequest): Promise<TavusVideoResponse> {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockVideoId = `mock_${this.PERSONA_ID}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const mockVideoUrl = `https://mock-tavus.awaknow.com/conversations/${mockVideoId}?persona=${this.PERSONA_ID}&replica=${this.REPLICA_ID}`;

    const minutesUsed = Math.floor(Math.random() * 5) + 2;

    await SubscriptionService.incrementTavusUsage(request.userId, minutesUsed);

    await supabase.from('tavus_usage').insert({
      user_id: request.userId,
      session_id: request.sessionId,
      minutes_used: minutesUsed,
      tavus_video_id: mockVideoId,
    });

    await supabase
      .from('sessions')
      .update({
        tavus_video_url: mockVideoUrl,
        tavus_session_id: mockVideoId,
        tavus_minutes_used: minutesUsed,
        updated_at: new Date().toISOString(),
      })
      .eq('id', request.sessionId);

    return {
      success: true,
      videoUrl: mockVideoUrl,
      tavusSessionId: mockVideoId,
      minutesUsed,
    };
  }

  static async getTavusUsageStats(userId: string): Promise<{
    totalMinutesUsed: number;
    sessionsCount: number;
    currentMonthUsage: number;
  }> {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7);
      const { data } = await supabase
        .from('tavus_usage')
        .select('minutes_used, usage_date')
        .eq('user_id', userId);

      const totalMinutesUsed = data.reduce((sum, usage) => sum + usage.minutes_used, 0);
      const sessionsCount = data.length;
      const currentMonthUsage = data
        .filter(usage => usage.usage_date.startsWith(currentMonth))
        .reduce((sum, usage) => sum + usage.minutes_used, 0);

      return { totalMinutesUsed, sessionsCount, currentMonthUsage };
    } catch {
      return { totalMinutesUsed: 0, sessionsCount: 0, currentMonthUsage: 0 };
    }
  }

  static async getConversationStatus(conversationId: string): Promise<any> {
    try {
      if (!this.apiKey || this.apiKey === 'your_tavus_api_key') {
        return { status: 'mock', duration: 300, persona_id: this.PERSONA_ID };
      }

      const response = await fetch(`${this.baseUrl}/conversations/${conversationId}`, {
        method: 'GET',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      return await response.json();
    } catch (error) {
      console.error('Error getting conversation status:', error);
      return null;
    }
  }

  static async endConversation(conversationId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/conversations/${conversationId}/end`, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error ending conversation:', error);
      return false;
    }
  }

  static async markSessionCompleted(tavusSessionId: string): Promise<void> {
    await supabase
      .from('tavus_sessions')
      .update({ status: 'completed' })
      .eq('tavus_session_id', tavusSessionId);
  }

  static async getPersonaInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/personas/${this.PERSONA_ID}`, {
        method: 'GET',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      return await response.json();
    } catch (error) {
      console.error('Error getting persona info:', error);
      return null;
    }
  }

  static get personaId(): string {
    return this.PERSONA_ID;
  }

  static get replicaId(): string {
    return this.REPLICA_ID;
  }
}