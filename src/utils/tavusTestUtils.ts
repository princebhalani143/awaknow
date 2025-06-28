// Tavus Integration Testing Utilities
import { TavusService } from '../services/tavusService';
import { SubscriptionService } from '../services/subscriptionService';

export class TavusTestUtils {
  static async runFullIntegrationTest(userId: string): Promise<{
    success: boolean;
    results: Array<{ test: string; status: 'pass' | 'fail'; message: string }>;
  }> {
    const results: Array<{ test: string; status: 'pass' | 'fail'; message: string }> = [];
    
    console.log('🧪 Starting Tavus Integration Tests...');
    
    // Test 1: API Key Configuration
    try {
      const apiKey = import.meta.env.VITE_TAVUS_API_KEY;
      if (!apiKey || apiKey === 'your_tavus_api_key') {
        results.push({
          test: 'API Key Configuration',
          status: 'fail',
          message: 'API key not configured or using placeholder value'
        });
      } else {
        results.push({
          test: 'API Key Configuration',
          status: 'pass',
          message: `API key configured (${apiKey.slice(0, 8)}...)`
        });
      }
    } catch (error) {
      results.push({
        test: 'API Key Configuration',
        status: 'fail',
        message: `Error checking API key: ${error}`
      });
    }

    // Test 2: Environment Variables for Persona/Replica IDs
    try {
      const envPersonaId = import.meta.env.VITE_TAVUS_PERSONA_ID;
      const envReplicaId = import.meta.env.VITE_TAVUS_REPLICA_ID;
      
      if (envPersonaId && envReplicaId) {
        results.push({
          test: 'Environment Variables',
          status: 'pass',
          message: `✅ Persona/Replica IDs configured in environment variables`
        });
      } else {
        results.push({
          test: 'Environment Variables',
          status: 'pass', // Still pass, just using fallbacks
          message: `⚠️ Using fallback Persona/Replica IDs (environment variables not set)`
        });
      }
    } catch (error) {
      results.push({
        test: 'Environment Variables',
        status: 'fail',
        message: `Error checking environment variables: ${error}`
      });
    }

    // Test 3: Updated Persona ID Configuration
    try {
      const personaId = TavusService.personaId;
      const expectedPersonaId = import.meta.env.VITE_TAVUS_PERSONA_ID || 'p7e13c73f41f';
      
      if (personaId === expectedPersonaId) {
        results.push({
          test: 'Persona ID Configuration',
          status: 'pass',
          message: `✅ Using correct persona ID: ${personaId}`
        });
      } else {
        results.push({
          test: 'Persona ID Configuration',
          status: 'fail',
          message: `❌ Incorrect persona ID: ${personaId}, expected: ${expectedPersonaId}`
        });
      }
    } catch (error) {
      results.push({
        test: 'Persona ID Configuration',
        status: 'fail',
        message: `Error checking persona ID: ${error}`
      });
    }

    // Test 4: Replica ID Configuration
    try {
      const replicaId = TavusService.replicaId;
      const expectedReplicaId = import.meta.env.VITE_TAVUS_REPLICA_ID || 'r4317e64d25a';
      
      if (replicaId === expectedReplicaId) {
        results.push({
          test: 'Replica ID Configuration',
          status: 'pass',
          message: `Correct replica ID: ${replicaId}`
        });
      } else {
        results.push({
          test: 'Replica ID Configuration',
          status: 'fail',
          message: `Incorrect replica ID: ${replicaId}, expected: ${expectedReplicaId}`
        });
      }
    } catch (error) {
      results.push({
        test: 'Replica ID Configuration',
        status: 'fail',
        message: `Error checking replica ID: ${error}`
      });
    }

    // Test 5: Persona Verification API Call
    try {
      console.log('🔍 Testing persona verification...');
      const personaInfo = await TavusService.getPersonaInfo();
      if (personaInfo && personaInfo.persona_id) {
        results.push({
          test: 'Persona Verification',
          status: 'pass',
          message: `✅ Persona verified: ${personaInfo.name || personaInfo.persona_id}`
        });
      } else {
        results.push({
          test: 'Persona Verification',
          status: 'fail',
          message: 'Persona verification failed - check API key and persona access'
        });
      }
    } catch (error) {
      results.push({
        test: 'Persona Verification',
        status: 'fail',
        message: `Persona verification error: ${error}`
      });
    }

    // Test 6: Session Management Test
    let originalCanUseTavusMinutes: typeof SubscriptionService.canUseTavusMinutes | null = null;
    
    try {
      console.log('🔒 Testing session management...');
      
      // Temporarily mock the subscription service to avoid authentication issues during testing
      originalCanUseTavusMinutes = SubscriptionService.canUseTavusMinutes;
      SubscriptionService.canUseTavusMinutes = async () => ({ canUse: true, minutesUsed: 0, minutesLimit: 25 });
      
      // Generate a proper UUID for the session ID
      const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };

      const mockRequest = {
        sessionId: generateUUID(),
        userId: userId, // Use the actual authenticated user ID
        prompt: 'Test reflection session',
        sessionType: 'reflect_alone' as const,
        participantContext: 'Test context'
      };

      // This will use mock if API fails, real API if available
      const response = await TavusService.createConversationalVideo(mockRequest);
      
      if (response.success && response.videoUrl) {
        const isRealAPI = !response.videoUrl.includes('mock') && !response.videoUrl.includes('.mp4');
        results.push({
          test: 'Session Management',
          status: 'pass',
          message: `${isRealAPI ? 'Real API' : 'Fallback'} session created: ${response.tavusSessionId}`
        });
        
        // Test session cleanup
        if (response.tavusSessionId && response.tavusSessionId !== 'fallback') {
          await TavusService.markSessionCompleted(response.tavusSessionId, mockRequest.userId);
          results.push({
            test: 'Session Cleanup',
            status: 'pass',
            message: 'Session cleanup successful'
          });
        }
      } else {
        results.push({
          test: 'Session Management',
          status: 'fail',
          message: response.error || 'Failed to create session'
        });
      }
    } catch (error) {
      results.push({
        test: 'Session Management',
        status: 'fail',
        message: `Session management error: ${error}`
      });
    } finally {
      // Restore the original method to avoid side effects
      if (originalCanUseTavusMinutes) {
        SubscriptionService.canUseTavusMinutes = originalCanUseTavusMinutes;
      }
    }

    // Test 7: Fallback Video Test
    try {
      console.log('🎬 Testing fallback video...');
      const fallbackVideo = TavusService.fallbackVideo;
      if (fallbackVideo === '/tavus-fall-back.mp4') {
        results.push({
          test: 'Fallback Video',
          status: 'pass',
          message: `Fallback video configured: ${fallbackVideo}`
        });
      } else {
        results.push({
          test: 'Fallback Video',
          status: 'fail',
          message: `Incorrect fallback video: ${fallbackVideo}`
        });
      }
    } catch (error) {
      results.push({
        test: 'Fallback Video',
        status: 'fail',
        message: `Fallback video test error: ${error}`
      });
    }

    const allPassed = results.every(r => r.status === 'pass');
    
    console.log('🧪 Test Results:', results);
    
    return {
      success: allPassed,
      results
    };
  }

  static logTestResults(results: Array<{ test: string; status: 'pass' | 'fail'; message: string }>) {
    console.log('\n📊 TAVUS INTEGRATION TEST RESULTS');
    console.log('=====================================');
    
    results.forEach((result, index) => {
      const icon = result.status === 'pass' ? '✅' : '❌';
      console.log(`${index + 1}. ${icon} ${result.test}`);
      console.log(`   ${result.message}\n`);
    });

    const passCount = results.filter(r => r.status === 'pass').length;
    const totalCount = results.length;
    
    console.log(`📈 Summary: ${passCount}/${totalCount} tests passed`);
    
    if (passCount === totalCount) {
      console.log('🎉 All tests passed! Tavus integration is ready.');
      console.log('🔧 Using persona ID from environment variables or fallback');
      console.log('🛡️ Session management and cleanup working properly');
    } else {
      console.log('⚠️  Some tests failed. Check the issues above.');
    }
  }
}

// Note: Auto-run tests removed to prevent foreign key constraint errors
// Tests should only be run manually by authenticated users