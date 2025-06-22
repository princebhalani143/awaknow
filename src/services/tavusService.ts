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
  
  // Your specific Tavus IDs
  private static PERSONA_ID = 'p035f1ebe15b';
  private static REPLICA_ID = 'r4317e64d25a';

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

      // Check if API key is configured
      if (!this.apiKey || this.apiKey === 'VITE_TAVUS_API_KEY') {
        console.warn('Tavus API key not configured, using mock response');
        return await this.simulateTavusAPI(request);
      }

      // First, verify the persona exists
      const personaValid = await this.verifyPersona();
      if (!personaValid) {
        console.warn('Persona verification failed, using mock response');
        return await this.simulateTavusAPI(request);
      }

      // Try real Tavus API call
      const realResponse = await this.callTavusAPI(request);
      
      if (realResponse.success && realResponse.minutesUsed) {
        // Update user's Tavus usage
        await SubscriptionService.incrementTavusUsage(request.userId, realResponse.minutesUsed);

        // Log usage in tavus_usage table
        await supabase.from('tavus_usage').insert({
          user_id: request.userId,
          session_id: request.sessionId,
          minutes_used: realResponse.minutesUsed,
          tavus_video_id: realResponse.tavusSessionId,
        });

        // Update session with Tavus data
        await supabase
          .from('sessions')
          .update({
            tavus_video_url: realResponse.videoUrl,
            tavus_session_id: realResponse.tavusSessionId,
            tavus_minutes_used: realResponse.minutesUsed,
            updated_at: new Date().toISOString(),
          })
          .eq('id', request.sessionId);
      }

      return realResponse;
    } catch (error) {
      console.error('Error creating Tavus video:', error);
      // Fallback to mock if real API fails
      console.warn('Falling back to mock Tavus response due to error');
      return await this.simulateTavusAPI(request);
    }
  }

  private static async verifyPersona(): Promise<boolean> {
    try {
      console.log(`Verifying Tavus persona: ${this.PERSONA_ID}`);
      
      const response = await fetch(`${this.baseUrl}/personas/${this.PERSONA_ID}`, {
        method: 'GET',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const personaData = await response.json();
        console.log('Persona verified successfully:', personaData);
        return true;
      } else {
        console.error('Persona verification failed:', response.status, await response.text());
        return false;
      }
    } catch (error) {
      console.error('Error verifying persona:', error);
      return false;
    }
  }

  private static async callTavusAPI(request: TavusVideoRequest): Promise<TavusVideoResponse> {
    try {
      // Create conversation request with your specific IDs
      const conversationRequest: TavusConversationRequest = {
        conversation_name: `awaknow_${request.sessionType}_${request.sessionId}`,
        persona_id: this.PERSONA_ID,
        replica_id: this.REPLICA_ID,
        callback_url: `${window.location.origin}/api/tavus/callback`,
        properties: {
          max_call_duration: 30, // 30 minutes max
          participant_left_timeout: 60, // 1 minute
          participant_absent_timeout: 120, // 2 minutes
          enable_recording: true,
          enable_transcription: true,
          language: 'en',
        },
      };

      console.log('Creating Tavus conversation with request:', conversationRequest);

      const response = await fetch(`${this.baseUrl}/conversations`, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(conversationRequest),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Tavus API error response:', response.status, errorText);
        throw new Error(`Tavus API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Tavus API response:', data);
      
      return {
        success: true,
        videoUrl: data.conversation_url || data.join_url,
        tavusSessionId: data.conversation_id,
        minutesUsed: 0, // Will be updated via callback or when session ends
      };
    } catch (error) {
      console.error('Tavus API call failed:', error);
      throw error;
    }
  }

  private static async simulateTavusAPI(request: TavusVideoRequest): Promise<TavusVideoResponse> {
    console.log('Using mock Tavus API for development');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock successful response with your persona ID in the mock URL
    const mockVideoId = `mock_${this.PERSONA_ID}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const mockVideoUrl = `https://mock-tavus.awaknow.com/conversations/${mockVideoId}?persona=${this.PERSONA_ID}&replica=${this.REPLICA_ID}`;

    const minutesUsed = Math.floor(Math.random() * 5) + 2; // Random 2-6 minutes

    // Update user's Tavus usage for mock as well
    await SubscriptionService.incrementTavusUsage(request.userId, minutesUsed);

    // Log usage in tavus_usage table
    await supabase.from('tavus_usage').insert({
      user_id: request.userId,
      session_id: request.sessionId,
      minutes_used: minutesUsed,
      tavus_video_id: mockVideoId,
    });

    // Update session with mock Tavus data
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

  // Get conversation status
  static async getConversationStatus(conversationId: string): Promise<any> {
    try {
      if (!this.apiKey || this.apiKey === 'your_tavus_api_key') {
        return { status: 'mock', duration: 300, persona_id: this.PERSONA_ID }; // Mock 5 minutes
      }

      const response = await fetch(`${this.baseUrl}/conversations/${conversationId}`, {
        method: 'GET',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get conversation status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting conversation status:', error);
      return null;
    }
  }

  // End conversation
  static async endConversation(conversationId: string): Promise<boolean> {
    try {
      if (!this.apiKey || this.apiKey === 'your_tavus_api_key') {
        console.log('Mock: Ending conversation', conversationId);
        return true;
      }

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

  // Get persona information
  static async getPersonaInfo(): Promise<any> {
    try {
      if (!this.apiKey || this.apiKey === 'your_tavus_api_key') {
        return {
          persona_id: this.PERSONA_ID,
          replica_id: this.REPLICA_ID,
          name: 'AwakNow AI Companion',
          description: 'Emotional wellness and reflection AI companion',
          status: 'mock'
        };
      }

      const response = await fetch(`${this.baseUrl}/personas/${this.PERSONA_ID}`, {
        method: 'GET',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get persona info: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting persona info:', error);
      return null;
    }
  }

  // Static getters for the IDs
  static get personaId(): string {
    return this.PERSONA_ID;
  }

  static get replicaId(): string {
    return this.REPLICA_ID;
  }
}