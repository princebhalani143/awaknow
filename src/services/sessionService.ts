import { supabase } from '../lib/supabase';
import { SessionData, SessionParticipant } from '../types/subscription';
import { SubscriptionService } from './subscriptionService';

export class SessionService {
  static async createSession(
    userId: string,
    sessionType: 'reflect_alone' | 'resolve_together',
    title?: string,
    description?: string
  ): Promise<{ success: boolean; sessionId?: string; error?: string }> {
    try {
      // Check permissions based on session type
      if (sessionType === 'reflect_alone') {
        const canCreate = await SubscriptionService.canCreateSoloSession(userId);
        if (!canCreate) {
          return {
            success: false,
            error: 'Daily solo session limit reached. Upgrade to Reflect+ for unlimited sessions.',
          };
        }
      } else if (sessionType === 'resolve_together') {
        const canCreate = await SubscriptionService.canCreateGroupSession(userId);
        if (!canCreate) {
          return {
            success: false,
            error: 'Group sessions require Resolve Together plan. Please upgrade.',
          };
        }
      }

      // Generate invite code for group sessions
      let inviteCode: string | undefined;
      let inviteExpiresAt: string | undefined;

      if (sessionType === 'resolve_together') {
        const { data: codeData, error: codeError } = await supabase
          .rpc('generate_invite_code');
        
        if (codeError) {
          console.error('Error generating invite code:', codeError);
          return { success: false, error: 'Failed to generate session code' };
        }

        inviteCode = codeData;
        inviteExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
      }

      // Create session
      const { data: sessionData, error: sessionError } = await supabase
        .from('sessions')
        .insert({
          session_type: sessionType,
          title,
          description,
          created_by: userId,
          invite_code: inviteCode,
          invite_expires_at: inviteExpiresAt,
        })
        .select()
        .single();

      if (sessionError) {
        console.error('Error creating session:', sessionError);
        return { success: false, error: 'Failed to create session' };
      }

      // Add creator as participant
      await supabase.from('session_participants').insert({
        session_id: sessionData.id,
        user_id: userId,
        is_host: true,
      });

      // Increment solo session count if applicable
      if (sessionType === 'reflect_alone') {
        await SubscriptionService.incrementSoloSessionCount(userId);
      }

      return { success: true, sessionId: sessionData.id };
    } catch (error) {
      console.error('Error in createSession:', error);
      return { success: false, error: 'Failed to create session' };
    }
  }

  static async joinSession(
    userId: string,
    inviteCode: string
  ): Promise<{ success: boolean; sessionId?: string; error?: string }> {
    try {
      // Find session by invite code
      const { data: sessionData, error: sessionError } = await supabase
        .from('sessions')
        .select('*')
        .eq('invite_code', inviteCode)
        .gt('invite_expires_at', new Date().toISOString())
        .eq('status', 'active')
        .single();

      if (sessionError || !sessionData) {
        return { success: false, error: 'Invalid or expired session code' };
      }

      // Check if user is already a participant
      const { data: existingParticipant } = await supabase
        .from('session_participants')
        .select('id')
        .eq('session_id', sessionData.id)
        .eq('user_id', userId)
        .single();

      if (existingParticipant) {
        return { success: true, sessionId: sessionData.id };
      }

      // Check participant limit
      const { count } = await supabase
        .from('session_participants')
        .select('*', { count: 'exact' })
        .eq('session_id', sessionData.id);

      if (count && count >= sessionData.max_participants) {
        return { success: false, error: 'Session is full' };
      }

      // Add user as participant
      const { error: participantError } = await supabase
        .from('session_participants')
        .insert({
          session_id: sessionData.id,
          user_id: userId,
          is_host: false,
        });

      if (participantError) {
        console.error('Error joining session:', participantError);
        return { success: false, error: 'Failed to join session' };
      }

      return { success: true, sessionId: sessionData.id };
    } catch (error) {
      console.error('Error in joinSession:', error);
      return { success: false, error: 'Failed to join session' };
    }
  }

  static async getSession(sessionId: string, userId: string): Promise<SessionData | null> {
    try {
      const { data: sessionData, error: sessionError } = await supabase
        .from('sessions')
        .select(`
          *,
          participants:session_participants(*)
        `)
        .eq('id', sessionId)
        .single();

      if (sessionError || !sessionData) {
        console.error('Error fetching session:', sessionError);
        return null;
      }

      // Check if user has access to this session
      const hasAccess = sessionData.created_by === userId || 
        sessionData.participants.some((p: any) => p.user_id === userId);

      if (!hasAccess) {
        return null;
      }

      return sessionData;
    } catch (error) {
      console.error('Error in getSession:', error);
      return null;
    }
  }

  static async getUserSessions(userId: string): Promise<SessionData[]> {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          participants:session_participants(*)
        `)
        .or(`created_by.eq.${userId},session_participants.user_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user sessions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserSessions:', error);
      return [];
    }
  }

  static async updateSessionNotes(
    sessionId: string,
    userId: string,
    notes: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('session_participants')
        .update({ private_notes: notes })
        .eq('session_id', sessionId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating session notes:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateSessionNotes:', error);
      return false;
    }
  }

  static async completeSession(sessionId: string, userId: string): Promise<boolean> {
    try {
      // Only session creator can complete the session
      const { error } = await supabase
        .from('sessions')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', sessionId)
        .eq('created_by', userId);

      if (error) {
        console.error('Error completing session:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in completeSession:', error);
      return false;
    }
  }
}