import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle, XCircle, RefreshCw, Eye, Settings, User, Brain } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { TavusTestUtils } from '../../utils/tavusTestUtils';
import { TavusService } from '../../services/tavusService';

interface TestResult {
  test: string;
  status: 'pass' | 'fail';
  message: string;
}

interface TavusTestPanelProps {
  userId?: string;
}

export const TavusTestPanel: React.FC<TavusTestPanelProps> = ({ userId }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  const runTests = async () => {
    if (!userId) {
      setResults([{
        test: 'User Authentication',
        status: 'fail',
        message: 'User not authenticated. Please log in to run tests.'
      }]);
      return;
    }

    setIsRunning(true);
    setResults([]);
    
    try {
      const testResults = await TavusTestUtils.runFullIntegrationTest(userId);
      setResults(testResults.results);
      TavusTestUtils.logTestResults(testResults.results);
    } catch (error) {
      console.error('Error running tests:', error);
      setResults([{
        test: 'Test Execution',
        status: 'fail',
        message: `Failed to run tests: ${error}`
      }]);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: 'pass' | 'fail') => {
    return status === 'pass' ? 
      <CheckCircle className="w-4 h-4 text-success-500" /> : 
      <XCircle className="w-4 h-4 text-error-500" />;
  };

  const passCount = results.filter(r => r.status === 'pass').length;
  const totalCount = results.length;

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-neutral-800">Tavus Integration Test</h3>
          <p className="text-sm text-neutral-600">
            Test your Tavus API integration with persona {TavusService.personaId}
          </p>
        </div>
        <Button
          onClick={() => setShowDetails(!showDetails)}
          variant="ghost"
          icon={Eye}
          size="sm"
        >
          {showDetails ? 'Hide' : 'Show'} Details
        </Button>
      </div>

      {/* Configuration Display */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6 p-4 bg-neutral-50 rounded-lg"
        >
          <h4 className="font-medium text-neutral-800 mb-3 flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Current Configuration</span>
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-neutral-600">Persona ID:</span>
              <div className="font-mono text-primary-600">{TavusService.personaId}</div>
              <div className="text-xs text-neutral-500">
                {import.meta.env.VITE_TAVUS_PERSONA_ID ? 'From environment variable' : 'Using fallback value'}
              </div>
            </div>
            <div>
              <span className="text-neutral-600">Replica ID:</span>
              <div className="font-mono text-secondary-600">{TavusService.replicaId}</div>
              <div className="text-xs text-neutral-500">
                {import.meta.env.VITE_TAVUS_REPLICA_ID ? 'From environment variable' : 'Using fallback value'}
              </div>
            </div>
            <div>
              <span className="text-neutral-600">API Key:</span>
              <div className="font-mono text-neutral-800">
                {import.meta.env.VITE_TAVUS_API_KEY ? 
                  `${import.meta.env.VITE_TAVUS_API_KEY.slice(0, 8)}...` : 
                  'Not configured'
                }
              </div>
            </div>
            <div>
              <span className="text-neutral-600">Environment:</span>
              <div className="text-neutral-800">{import.meta.env.DEV ? 'Development' : 'Production'}</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Test Button */}
      <div className="text-center mb-6">
        <Button
          onClick={runTests}
          disabled={isRunning || !userId}
          loading={isRunning}
          icon={isRunning ? RefreshCw : Play}
          size="lg"
          className="w-full"
        >
          {isRunning ? 'Running Tests...' : !userId ? 'Please Log In to Run Tests' : 'Run Integration Tests'}
        </Button>
      </div>

      {/* Results Summary */}
      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className={`p-4 rounded-lg border-2 ${
            passCount === totalCount 
              ? 'bg-success-50 border-success-200' 
              : 'bg-warning-50 border-warning-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {passCount === totalCount ? (
                  <CheckCircle className="w-5 h-5 text-success-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-warning-500" />
                )}
                <span className={`font-medium ${
                  passCount === totalCount ? 'text-success-800' : 'text-warning-800'
                }`}>
                  {passCount === totalCount ? 'All Tests Passed!' : 'Some Tests Failed'}
                </span>
              </div>
              <span className={`text-sm ${
                passCount === totalCount ? 'text-success-600' : 'text-warning-600'
              }`}>
                {passCount}/{totalCount} passed
              </span>
            </div>
            
            {passCount === totalCount ? (
              <p className="text-success-700 text-sm mt-2">
                🎉 Your Tavus integration is working perfectly! You can now create AI conversations with persona {TavusService.personaId}.
              </p>
            ) : (
              <p className="text-warning-700 text-sm mt-2">
                ⚠️ Some tests failed. Check the details below and ensure your API key has access to persona {TavusService.personaId}.
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Detailed Results */}
      {results.length > 0 && showDetails && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h4 className="font-medium text-neutral-800">Detailed Results:</h4>
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${
                result.status === 'pass' 
                  ? 'bg-success-50 border-success-200' 
                  : 'bg-error-50 border-error-200'
              }`}
            >
              <div className="flex items-start space-x-3">
                {getStatusIcon(result.status)}
                <div className="flex-1">
                  <div className={`font-medium text-sm ${
                    result.status === 'pass' ? 'text-success-800' : 'text-error-800'
                  }`}>
                    {result.test}
                  </div>
                  <div className={`text-xs mt-1 ${
                    result.status === 'pass' ? 'text-success-600' : 'text-error-600'
                  }`}>
                    {result.message}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Next Steps */}
      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-primary-50 rounded-lg"
        >
          <h4 className="font-medium text-primary-800 mb-2">Next Steps:</h4>
          <ul className="text-sm text-primary-700 space-y-1">
            {passCount === totalCount ? (
              <>
                <li>✅ Go to "Reflect Alone" to test a real conversation</li>
                <li>✅ Check browser console for detailed API logs</li>
                <li>✅ Monitor usage in your Tavus dashboard</li>
              </>
            ) : (
              <>
                <li>🔧 Fix any failed tests above</li>
                <li>🔑 Verify your API key in Tavus dashboard</li>
                <li>👤 Ensure persona {TavusService.personaId} is accessible</li>
                <li>🔄 Re-run tests after making changes</li>
              </>
            )}
          </ul>
        </motion.div>
      )}
    </Card>
  );
};