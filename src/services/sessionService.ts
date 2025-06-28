import { supabase } from '../lib/supabase';
import { SessionData, SessionParticipant } from '../types/subscription';
import { SubscriptionService } from './subscriptionService';
import { TavusService } from './tavusService';

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
        .select('*')
        .eq('id', sessionId)
        .single();

      if (sessionError || !sessionData) {
        console.error('Error fetching session:', sessionError);
        return null;
      }

      // Check if user has access to this session
      const hasAccess = sessionData.created_by === userId;

      if (!hasAccess) {
        // Check if user is a participant (separate query to avoid RLS recursion)
        const { data: participantData } = await supabase
          .from('session_participants')
          .select('id')
          .eq('session_id', sessionId)
          .eq('user_id', userId)
          .single();

        if (!participantData) {
          return null;
        }
      }

      // Get participants separately to avoid RLS issues
      const { data: participants } = await supabase
        .from('session_participants')
        .select('*')
        .eq('session_id', sessionId);

      return {
        ...sessionData,
        participants: participants || []
      };
    } catch (error) {
      console.error('Error in getSession:', error);
      return null;
    }
  }

  static async getUserSessions(userId: string): Promise<SessionData[]> {
    try {
      // Get sessions created by the user (avoid complex joins that cause RLS recursion)
      const { data: createdSessions, error: createdError } = await supabase
        .from('sessions')
        .select('*')
        .eq('created_by', userId)
        .order('created_at', { ascending: false });

      if (createdError) {
        console.error('Error fetching created sessions:', createdError);
        return [];
      }

      // Get session IDs where user is a participant
      const { data: participantSessionIds, error: participantError } = await supabase
        .from('session_participants')
        .select('session_id')
        .eq('user_id', userId);

      if (participantError) {
        console.error('Error fetching participant session IDs:', participantError);
        return createdSessions || [];
      }

      // Get sessions where user is a participant (but not creator)
      const participantIds = (participantSessionIds || [])
        .map(p => p.session_id)
        .filter(id => !(createdSessions || []).some(s => s.id === id));

      let participantSessions: any[] = [];
      if (participantIds.length > 0) {
        const { data: participantSessionsData, error: participantSessionsError } = await supabase
          .from('sessions')
          .select('*')
          .in('id', participantIds)
          .order('created_at', { ascending: false });

        if (participantSessionsError) {
          console.error('Error fetching participant sessions:', participantSessionsError);
        } else {
          participantSessions = participantSessionsData || [];
        }
      }

      // Combine all sessions
      const allSessions = [...(createdSessions || []), ...participantSessions];

      // Sort by created_at descending
      allSessions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      // Add participants to each session (separate queries to avoid RLS issues)
      const sessionsWithParticipants = await Promise.all(
        allSessions.map(async (session) => {
          const { data: participants } = await supabase
            .from('session_participants')
            .select('*')
            .eq('session_id', session.id);

          return {
            ...session,
            participants: participants || []
          };
        })
      );

      return sessionsWithParticipants;
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
      console.log('📝 Marking session as completed:', sessionId);
      
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

      // Also end any associated Tavus session
      const { data: sessionData } = await supabase
        .from('sessions')
        .select('tavus_session_id')
        .eq('id', sessionId)
        .single();

      if (sessionData?.tavus_session_id && sessionData.tavus_session_id !== 'fallback') {
        await TavusService.markSessionCompleted(sessionData.tavus_session_id, userId);
      }

      return true;
    } catch (error) {
      console.error('Error in completeSession:', error);
      return false;
    }
  }
}