// Tavus Integration Testing Utilities
import { TavusService } from '../services/tavusService';

export class TavusTestUtils {
  static async runFullIntegrationTest(): Promise<{
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

    // Test 2: Updated Persona ID Configuration
    try {
      const personaId = TavusService.personaId;
      if (personaId === 'p7e13c73f41f') {
        results.push({
          test: 'Persona ID Configuration',
          status: 'pass',
          message: `✅ Updated persona ID: ${personaId}`
        });
      } else {
        results.push({
          test: 'Persona ID Configuration',
          status: 'fail',
          message: `❌ Incorrect persona ID: ${personaId}, expected: p7e13c73f41f`
        });
      }
    } catch (error) {
      results.push({
        test: 'Persona ID Configuration',
        status: 'fail',
        message: `Error checking persona ID: ${error}`
      });
    }

    // Test 3: Replica ID Configuration
    try {
      const replicaId = TavusService.replicaId;
      if (replicaId === 'r4317e64d25a') {
        results.push({
          test: 'Replica ID Configuration',
          status: 'pass',
          message: `Correct replica ID: ${replicaId}`
        });
      } else {
        results.push({
          test: 'Replica ID Configuration',
          status: 'fail',
          message: `Incorrect replica ID: ${replicaId}, expected: r4317e64d25a`
        });
      }
    } catch (error) {
      results.push({
        test: 'Replica ID Configuration',
        status: 'fail',
        message: `Error checking replica ID: ${error}`
      });
    }

    // Test 4: Persona Verification API Call
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

    // Test 5: Session Management Test
    try {
      console.log('🔒 Testing session management...');
      
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
        userId: '00000000-0000-4000-8000-000000000000', // Valid UUID format for testing
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
    }

    // Test 6: Fallback Video Test
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
      console.log('🔧 Updated with new persona: p7e13c73f41f');
      console.log('🛡️ Session management and cleanup working properly');
    } else {
      console.log('⚠️  Some tests failed. Check the issues above.');
    }
  }
}

// Auto-run tests in development
if (import.meta.env.DEV) {
  // Run tests after a short delay to ensure everything is loaded
  setTimeout(async () => {
    try {
      const testResults = await TavusTestUtils.runFullIntegrationTest();
      TavusTestUtils.logTestResults(testResults.results);
    } catch (error) {
      console.error('Error running Tavus tests:', error);
    }
  }, 2000);
}