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
  fallback?: boolean;
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
  
  // Get Persona and Replica IDs from environment variables with fallbacks
  private static PERSONA_ID = import.meta.env.VITE_TAVUS_PERSONA_ID || 'p7e13c73f41f';
  private static REPLICA_ID = import.meta.env.VITE_TAVUS_REPLICA_ID || 'r4317e64d25a';
  
  // Fallback video - consistent across all failures
  private static FALLBACK_VIDEO = '/tavus-fall-back.mp4';
  
  // Session management to prevent parallel sessions
  private static activeSessions = new Map<string, string>(); // userId -> sessionId
  private static sessionLocks = new Map<string, Promise<any>>(); // userId -> Promise

  static async createConversationalVideo(request: TavusVideoRequest): Promise<TavusVideoResponse> {
    console.log('🎬 Creating Tavus conversation with persona:', this.PERSONA_ID);
    
    // Check for missing or invalid API key
    if (!this.apiKey || this.apiKey === 'your_tavus_api_key') {
      console.warn('⚠️ Tavus API key not configured, using fallback');
      return await this.useFallback(request, 'Missing or invalid Tavus API key');
    }

    // Prevent parallel sessions for the same user
    const existingSessionLock = this.sessionLocks.get(request.userId);
    if (existingSessionLock) {
      console.log('🔒 User already has a session being created, waiting...');
      try {
        await existingSessionLock;
      } catch (error) {
        console.log('Previous session creation failed, proceeding...');
      }
    }

    // Check for existing active session
    const existingActiveSession = this.activeSessions.get(request.userId);
    if (existingActiveSession) {
      console.log('🚫 User already has an active session:', existingActiveSession);
      return await this.useFallback(request, 'You already have an active session. Please end your current session before starting a new one.');
    }

    // Check database for active Tavus sessions
    try {
      const { data: existingSession } = await supabase
        .from('tavus_sessions')
        .select('*')
        .eq('user_id', request.userId)
        .eq('status', 'active')
        .maybeSingle();

      if (existingSession) {
        console.log('🚫 Found existing active session in database:', existingSession.tavus_session_id);
        this.activeSessions.set(request.userId, existingSession.tavus_session_id);
        return await this.useFallback(request, 'You already have an active session. Please end your current session before starting a new one.');
      }
    } catch (error) {
      console.error('Error checking existing sessions:', error);
    }

    // Create session lock to prevent parallel creation
    const sessionCreationPromise = this.createSessionInternal(request);
    this.sessionLocks.set(request.userId, sessionCreationPromise);

    try {
      const result = await sessionCreationPromise;
      
      // If successful, track the active session
      if (result.success && result.tavusSessionId && result.tavusSessionId !== 'fallback') {
        this.activeSessions.set(request.userId, result.tavusSessionId);
      }
      
      return result;
    } finally {
      // Always clean up the lock
      this.sessionLocks.delete(request.userId);
    }
  }

  private static async createSessionInternal(request: TavusVideoRequest): Promise<TavusVideoResponse> {
    try {
      // Check Tavus usage limits before creating session
      const { canUse, minutesUsed, minutesLimit } = await SubscriptionService.canUseTavusMinutes(request.userId, 1);
      if (!canUse) {
        console.log(`❌ Insufficient Tavus credits: ${minutesUsed}/${minutesLimit}`);
        return await this.useFallback(request, `Insufficient AI video minutes (${minutesUsed}/${minutesLimit}). Please upgrade your plan or wait for your monthly reset.`);
      }

      console.log('🚀 Creating Tavus conversation with persona:', this.PERSONA_ID);

      const conversationRequest: TavusConversationRequest = {
        conversation_name: `awaknow_${request.sessionType}_${request.sessionId}`,
        persona_id: this.PERSONA_ID,
        replica_id: this.REPLICA_ID,
        callback_url: `${window.location.origin}/api/tavus/callback`,
        properties: {
          max_call_duration: 300, // 5 minutes max
          participant_left_timeout: 60,
          participant_absent_timeout: 120,
          enable_recording: true,
          enable_transcription: true,
          language: 'English',
        },
      };

      console.log('📡 Making API request to Tavus...');
      const response = await fetch(`${this.baseUrl}/conversations`, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(conversationRequest),
      });

      const data = await response.json();
      console.log('📥 Tavus API response:', { status: response.status, data });

      if (!response.ok || !data?.conversation_id) {
        console.error('❌ Tavus API error:', data);
        return await this.useFallback(request, data?.message || `Tavus API error: ${response.status}`);
      }

      // Store session in database
      const { error: dbError } = await supabase.from('tavus_sessions').insert([{
        user_id: request.userId,
        tavus_session_id: data.conversation_id,
        status: 'active',
      }]);

      if (dbError) {
        console.error('❌ Database error storing session:', dbError);
        // Try to end the Tavus session since we can't track it
        await this.endConversation(data.conversation_id);
        return await this.useFallback(request, 'Failed to track session. Please try again.');
      }

      // Update session record with Tavus details
      await supabase.from('sessions')
        .update({
          tavus_video_url: data.conversation_url || data.join_url,
          tavus_session_id: data.conversation_id,
          tavus_minutes_used: 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', request.sessionId);

      // Increment usage
      await SubscriptionService.incrementTavusUsage(request.userId, 1);

      console.log('✅ Tavus session created successfully:', data.conversation_id);

      return {
        success: true,
        tavusSessionId: data.conversation_id,
        videoUrl: data.conversation_url || data.join_url,
        minutesUsed: 1,
        fallback: false,
      };
    } catch (error: any) {
      console.error('❌ Error creating Tavus session:', error);
      return await this.useFallback(request, error.message || 'Unexpected error occurred');
    }
  }

  private static async useFallback(request: TavusVideoRequest, error: string): Promise<TavusVideoResponse> {
    console.log('🔄 Using fallback video due to:', error);
    
    // Update session with fallback video
    await supabase.from('sessions')
      .update({
        tavus_video_url: this.FALLBACK_VIDEO,
        tavus_session_id: 'fallback',
        tavus_minutes_used: 0,
        updated_at: new Date().toISOString(),
      })
      .eq('id', request.sessionId);

    return {
      success: true,
      videoUrl: this.FALLBACK_VIDEO,
      tavusSessionId: 'fallback',
      minutesUsed: 0,
      error,
      fallback: true,
    };
  }

  static async endConversation(conversationId: string): Promise<boolean> {
    if (!conversationId || conversationId === 'fallback') {
      console.log('🔄 Skipping end conversation for fallback session');
      return true;
    }

    if (!this.apiKey || this.apiKey === 'your_tavus_api_key') {
      console.log('🔄 Skipping end conversation - no API key');
      return true;
    }

    try {
      console.log('🛑 Ending Tavus conversation:', conversationId);
      
      const response = await fetch(`${this.baseUrl}/conversations/${conversationId}/end`, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      const success = response.ok;
      console.log(success ? '✅ Conversation ended successfully' : '❌ Failed to end conversation');
      
      return success;
    } catch (error) {
      console.error('❌ Error ending conversation:', error);
      return false;
    }
  }

  static async markSessionCompleted(sessionId: string, userId?: string): Promise<void> {
    if (!sessionId || sessionId === 'fallback') {
      return;
    }

    try {
      console.log('✅ Marking session as completed:', sessionId);
      
      // Update database
      await supabase
        .from('tavus_sessions')
        .update({ status: 'completed' })
        .eq('tavus_session_id', sessionId);

      // Remove from active sessions tracking
      if (userId) {
        this.activeSessions.delete(userId);
        console.log('🗑️ Removed user from active sessions:', userId);
      }

      // End the actual Tavus conversation
      await this.endConversation(sessionId);
    } catch (error) {
      console.error('❌ Error marking session completed:', error);
    }
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

      const totalMinutesUsed = (data || []).reduce((sum, usage) => sum + usage.minutes_used, 0);
      const sessionsCount = (data || []).length;
      const currentMonthUsage = (data || [])
        .filter(usage => usage.usage_date.startsWith(currentMonth))
        .reduce((sum, usage) => sum + usage.minutes_used, 0);

      return { totalMinutesUsed, sessionsCount, currentMonthUsage };
    } catch (error) {
      console.error('Error getting Tavus usage stats:', error);
      return { totalMinutesUsed: 0, sessionsCount: 0, currentMonthUsage: 0 };
    }
  }

  static async getConversationStatus(conversationId: string): Promise<any> {
    if (!conversationId || conversationId === 'fallback') {
      return { status: 'mock', duration: 300, persona_id: this.PERSONA_ID };
    }

    if (!this.apiKey || this.apiKey === 'your_tavus_api_key') {
      return { status: 'mock', duration: 300, persona_id: this.PERSONA_ID };
    }

    try {
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

  static async getPersonaInfo(): Promise<any> {
    if (!this.apiKey || this.apiKey === 'your_tavus_api_key') {
      return { 
        persona_id: this.PERSONA_ID, 
        name: 'AwakNow AI Companion',
        status: 'mock' 
      };
    }

    try {
      console.log('🔍 Fetching persona info for:', this.PERSONA_ID);
      const response = await fetch(`${this.baseUrl}/personas/${this.PERSONA_ID}`, {
        method: 'GET',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('📋 Persona info:', data);
      return data;
    } catch (error) {
      console.error('Error getting persona info:', error);
      return { 
        persona_id: this.PERSONA_ID, 
        name: 'AwakNow AI Companion',
        status: 'error' 
      };
    }
  }

  // Clean up any orphaned sessions on app start
  static async cleanupOrphanedSessions(userId: string): Promise<void> {
    try {
      const { data: activeSessions } = await supabase
        .from('tavus_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active');

      if (activeSessions && activeSessions.length > 0) {
        console.log('🧹 Cleaning up orphaned sessions:', activeSessions.length);
        
        for (const session of activeSessions) {
          await this.markSessionCompleted(session.tavus_session_id, userId);
        }
      }
    } catch (error) {
      console.error('Error cleaning up orphaned sessions:', error);
    }
  }

  // Getters for the persona details
  static get personaId(): string {
    return this.PERSONA_ID;
  }

  static get replicaId(): string {
    return this.REPLICA_ID;
  }

  static get fallbackVideo(): string {
    return this.FALLBACK_VIDEO;
  }

  // Force end all sessions for a user (emergency cleanup)
  static async forceEndAllUserSessions(userId: string): Promise<void> {
    try {
      console.log('🚨 Force ending all sessions for user:', userId);
      
      const { data: sessions } = await supabase
        .from('tavus_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active');

      if (sessions) {
        for (const session of sessions) {
          await this.markSessionCompleted(session.tavus_session_id, userId);
        }
      }

      // Clear from memory tracking
      this.activeSessions.delete(userId);
      this.sessionLocks.delete(userId);
      
      console.log('✅ All user sessions force ended');
    } catch (error) {
      console.error('Error force ending user sessions:', error);
    }
  }
}