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

    // Test 2: Persona ID Configuration
    try {
      const personaId = TavusService.personaId;
      if (personaId === 'ped1380851e4') {
        results.push({
          test: 'Persona ID Configuration',
          status: 'pass',
          message: `Correct persona ID: ${personaId}`
        });
      } else {
        results.push({
          test: 'Persona ID Configuration',
          status: 'fail',
          message: `Incorrect persona ID: ${personaId}, expected: ped1380851e4`
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
          message: `Persona verified: ${personaInfo.name || personaInfo.persona_id}`
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

    // Test 5: Mock Conversation Creation
    try {
      console.log('🎭 Testing mock conversation creation...');
      const mockRequest = {
        sessionId: 'test-session-' + Date.now(),
        userId: '00000000-0000-4000-8000-000000000000', // Valid UUID format for testing
        prompt: 'Test reflection session',
        sessionType: 'reflect_alone' as const,
        participantContext: 'Test context'
      };

      // This will use mock if API fails, real API if available
      const response = await TavusService.createConversationalVideo(mockRequest);
      
      if (response.success && response.videoUrl) {
        const isRealAPI = !response.videoUrl.includes('mock');
        results.push({
          test: 'Conversation Creation',
          status: 'pass',
          message: `${isRealAPI ? 'Real API' : 'Mock'} conversation created: ${response.tavusSessionId}`
        });
      } else {
        results.push({
          test: 'Conversation Creation',
          status: 'fail',
          message: response.error || 'Failed to create conversation'
        });
      }
    } catch (error) {
      results.push({
        test: 'Conversation Creation',
        status: 'fail',
        message: `Conversation creation error: ${error}`
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