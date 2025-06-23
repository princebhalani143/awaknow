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
  private static baseUrl = 'https://tavusapi.com/v2';
  private static PERSONA_ID = 'ped1380851e4';
  private static REPLICA_ID = 'r4317e64d25a';

  static async createConversationalVideo(request: TavusVideoRequest): Promise<TavusVideoResponse> {
    if (!request.sessionId || !request.userId || !request.prompt) {
      return { success: false, error: 'Missing required session details.' };
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

      const response = await fetch(`${this.baseUrl}/conversations`, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_name: request.prompt,
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
        }),
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
    } catch {
      return false;
    }
  }

  static async markSessionCompleted(tavusSessionId: string): Promise<void> {
    await supabase
      .from('tavus_sessions')
      .update({ status: 'completed' })
      .eq('tavus_session_id', tavusSessionId);
  }
}