import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TestTube, Brain, Video } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { TavusTestPanel } from '../components/UI/TavusTestPanel';
import { TopBar } from '../components/Layout/TopBar';
import { Footer } from '../components/Layout/Footer';
import { useNavigate } from 'react-router-dom';
import { TavusService } from '../services/tavusService';
import { useAuthStore } from '../stores/authStore';

export const TavusTest: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col">
      <TopBar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl flex-1">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <Button
            onClick={() => navigate('/home')}
            variant="ghost"
            icon={ArrowLeft}
            className="!p-2"
          />
          <div className="text-center">
            <h1 className="text-3xl font-bold text-neutral-800">Tavus Integration Test</h1>
            <p className="text-neutral-600">Verify your AI conversation setup</p>
          </div>
          <div className="w-10"></div>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <TestTube className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
            Test Your Tavus AI Integration
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            This comprehensive test will verify that your Tavus API is properly configured 
            with persona <code className="bg-neutral-100 px-2 py-1 rounded text-primary-600">{TavusService.personaId}</code> 
            and replica <code className="bg-neutral-100 px-2 py-1 rounded text-secondary-600">{TavusService.replicaId}</code>.
          </p>
        </motion.div>

        {/* Test Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <TavusTestPanel userId={user?.id} />
        </motion.div>

        {/* Information Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid md:grid-cols-2 gap-6 mb-8"
        >
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-soft p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="w-6 h-6 text-primary-500" />
              <h3 className="text-lg font-semibold text-neutral-800">What This Tests</h3>
            </div>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>✓ API key configuration and validity</li>
              <li>✓ Persona ID {TavusService.personaId} accessibility</li>
              <li>✓ Replica ID {TavusService.replicaId} configuration</li>
              <li>✓ Real API connection to Tavus servers</li>
              <li>✓ Conversation creation capabilities</li>
              <li>✓ Error handling and fallback mechanisms</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 shadow-soft p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Video className="w-6 h-6 text-secondary-500" />
              <h3 className="text-lg font-semibold text-neutral-800">After Testing</h3>
            </div>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>🎯 Try "Reflect Alone" for real conversations</li>
              <li>📊 Monitor usage in Tavus dashboard</li>
              <li>🔍 Check browser console for detailed logs</li>
              <li>⚙️ Adjust settings based on test results</li>
              <li>🚀 Deploy with confidence</li>
              <li>📈 Track user engagement and feedback</li>
            </ul>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={() => navigate('/reflect')}
            variant="primary"
            size="lg"
            icon={Brain}
          >
            Try Reflect Alone
          </Button>
          <Button
            onClick={() => navigate('/resolve')}
            variant="secondary"
            size="lg"
            icon={Video}
          >
            Try Resolve Together
          </Button>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};