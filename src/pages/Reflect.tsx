import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, Heart, Brain, Smile, Frown, Meh, ArrowLeft, Video, Play, Pause, Square } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { TavusVideo } from '../components/UI/TavusVideo';
import { TopBar } from '../components/Layout/TopBar';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { SessionService } from '../services/sessionService';
import { TavusService } from '../services/tavusService';

export const Reflect: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [step, setStep] = useState<'prompt' | 'creating' | 'tavus-loading' | 'conversation' | 'response'>('prompt');
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [tavusVideoUrl, setTavusVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [emotions, setEmotions] = useState<Array<{ emotion: string; timestamp: Date; intensity: number }>>([]);
  const [isFallbackMode, setIsFallbackMode] = useState(false);

  const emotionIcons = {
    happy: { icon: Smile, color: 'text-success-500' },
    sad: { icon: Frown, color: 'text-primary-500' },
    neutral: { icon: Meh, color: 'text-neutral-500' },
    anxious: { icon: Brain, color: 'text-warning-500' },
  };

  // Cleanup any orphaned sessions when component mounts
  useEffect(() => {
    if (user) {
      TavusService.cleanupOrphanedSessions(user.id);
    }
  }, [user]);

  const handleStartSession = async () => {
    if (!user || sessionId) return; // ✅ Prevents re-creation if session already exists

    setStep('creating');
    setError(null);

    try {
      console.log('🚀 Starting new reflection session...');
      
      const sessionResult = await SessionService.createSession(
        user.id,
        'reflect_alone',
        'Personal Reflection Session',
        input || 'Personal reflection and emotional exploration'
      );

      if (!sessionResult.success) {
        setError(sessionResult.error || 'Failed to create session');
        setStep('prompt');
        return;
      }

      console.log('✅ Session created:', sessionResult.sessionId);
      setSessionId(sessionResult.sessionId!);
      setStep('tavus-loading');

      const tavusResult = await TavusService.createConversationalVideo({
        sessionId: sessionResult.sessionId!,
        userId: user.id,
        prompt: input || 'I want to reflect on my thoughts and feelings',
        sessionType: 'reflect_alone',
        participantContext: `Personal emotional wellness and reflection session. User context: ${input || 'General reflection'}`
      });

      if (tavusResult.success && tavusResult.videoUrl) {
        console.log('✅ Tavus session created:', tavusResult.tavusSessionId);
        setTavusVideoUrl(tavusResult.videoUrl);
        setStep('conversation');
        
        // Check if we're using fallback mode
        setIsFallbackMode(!!tavusResult.fallback || 
                         tavusResult.videoUrl.includes('fallback') || 
                         tavusResult.videoUrl.includes('.mp4') || 
                         tavusResult.videoUrl.includes('.webm'));
        
        if (tavusResult.fallback) {
          console.log('⚠️ Using fallback mode:', tavusResult.error);
        }
      } else {
        setError(tavusResult.error || 'Failed to create AI conversation');
        setStep('prompt');
      }
    } catch (error) {
      console.error('❌ Error starting session:', error);
      setError('Failed to start session. Please try again.');
      setStep('prompt');
    }
  };

  const handleEndSession = async () => {
    console.log('🏁 Ending reflection session...');
    
    if (sessionId) {
      // Mark session as completed in database
      await SessionService.completeSession(sessionId, user?.id || '');
      
      // End Tavus session if it exists
      if (tavusVideoUrl && !isFallbackMode) {
        await TavusService.markSessionCompleted(sessionId, user?.id);
      }
    }
    
    setStep('response');
    // Add mock emotion data
    setEmotions(prev => [...prev, {
      emotion: 'reflective',
      timestamp: new Date(),
      intensity: 0.7
    }]);
  };

  const handleNewReflection = () => {
    console.log('🔄 Starting new reflection...');
    setStep('prompt');
    setInput('');
    setIsRecording(false);
    setSessionId(null);
    setTavusVideoUrl(null);
    setError(null);
    setEmotions([]);
    setIsFallbackMode(false);
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (sessionId && user) {
        console.log('🧹 Component unmounting - cleaning up session');
        TavusService.markSessionCompleted(sessionId, user.id);
      }
    };
  }, [sessionId, user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <TopBar />
      
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-6"
        >
          <Button
            onClick={() => navigate('/home')}
            variant="ghost"
            icon={ArrowLeft}
            className="!p-2"
          />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-800">Reflect Alone</h1>
            <p className="text-sm text-neutral-600">Powered by Tavus AI • Persona: {TavusService.personaId}</p>
          </div>
          <div className="w-10"></div>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 'prompt' && (
            <motion.div
              key="prompt"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <Card className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
                  What's on your mind today?
                </h2>
                <p className="text-neutral-600 mb-8">
                  Share your thoughts, feelings, or experiences. Our AI companion will listen and provide personalized insights using advanced Tavus technology.
                </p>

                {error && (
                  <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-xl">
                    <p className="text-error-800 text-sm">{error}</p>
                  </div>
                )}

                {/* Updated Tavus Info */}
                <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-xl">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Brain className="w-5 h-5 text-primary-600" />
                    <span className="text-primary-800 font-medium">AI-Powered Conversation</span>
                  </div>
                  <div className="text-xs text-primary-700 space-y-1">
                    <div>Persona ID: {TavusService.personaId}</div>
                    <div>Replica ID: {TavusService.replicaId}</div>
                    <div>Technology: Tavus Conversational AI</div>
                    <div className="text-primary-600 font-medium">✨ Updated with new persona for enhanced conversations</div>
                  </div>
                </div>

                {/* Text Input */}
                <div className="space-y-4 mb-6">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your thoughts here... (optional - you can also start directly with AI conversation)"
                    className="w-full h-32 p-4 border border-neutral-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <Button
                    onClick={handleStartSession}
                    className="w-full"
                    icon={Video}
                    iconPosition="right"
                    disabled={!!sessionId} // Prevent multiple sessions
                  >
                    Start AI Conversation
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 'creating' && (
            <motion.div
              key="creating"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 border-4 border-primary-200 border-t-primary-500 rounded-full mx-auto mb-6"
                />
                <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
                  Creating your session...
                </h2>
                <p className="text-neutral-600">
                  Setting up your private reflection space
                </p>
              </Card>
            </motion.div>
          )}

          {step === 'tavus-loading' && (
            <motion.div
              key="tavus-loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-24 h-24 bg-gradient-to-br from-secondary-500 to-accent-500 rounded-full mx-auto mb-6 flex items-center justify-center"
                >
                  <Video className="w-12 h-12 text-white" />
                </motion.div>
                <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
                  Preparing your AI companion...
                </h2>
                <p className="text-neutral-600 mb-4">
                  Initializing Tavus AI with persona {TavusService.personaId}
                </p>
                <div className="flex justify-center space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                      className="w-2 h-2 bg-primary-500 rounded-full"
                    />
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {step === 'conversation' && tavusVideoUrl && (
            <motion.div
              key="conversation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Tavus Video Interface */}
              <TavusVideo
                videoUrl={tavusVideoUrl}
                sessionId={sessionId || ''}
                onSessionEnd={handleEndSession}
              />

              {/* Session Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-4">Session Guidelines</h3>
                  <ul className="space-y-2 text-sm text-neutral-600">
                    <li className="flex items-center space-x-2">
                      <Heart className="w-4 h-4 text-primary-500" />
                      <span>Speak openly about your feelings</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Brain className="w-4 h-4 text-secondary-500" />
                      <span>Ask questions about your emotions</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Smile className="w-4 h-4 text-success-500" />
                      <span>Take your time to reflect</span>
                    </li>
                  </ul>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-4">AI Technology</h3>
                  <div className="space-y-2 text-sm text-neutral-600">
                    <div className="flex justify-between">
                      <span>Platform:</span>
                      <span className="font-medium">Tavus AI</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Persona:</span>
                      <span className="font-mono text-xs">{TavusService.personaId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Replica:</span>
                      <span className="font-mono text-xs">{TavusService.replicaId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Privacy:</span>
                      <span className="text-success-600">🔒 Encrypted</span>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {step === 'response' && (
            <motion.div
              key="response"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Session Complete */}
              <Card className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-success-500 to-primary-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
                  Session Complete
                </h2>
                <p className="text-neutral-600 mb-8">
                  Thank you for taking time to reflect. Here are your personalized insights from your Tavus AI conversation.
                </p>
              </Card>

              {/* Insights */}
              <Card>
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">Key Insights</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-primary-50 rounded-lg">
                    <p className="text-sm text-primary-800">
                      <strong>Emotional Pattern:</strong> You're showing signs of thoughtful reflection and self-awareness.
                    </p>
                  </div>
                  <div className="p-3 bg-secondary-50 rounded-lg">
                    <p className="text-sm text-secondary-800">
                      <strong>Growth Opportunity:</strong> Consider exploring deeper into the emotions you mentioned.
                    </p>
                  </div>
                  <div className="p-3 bg-accent-50 rounded-lg">
                    <p className="text-sm text-accent-800">
                      <strong>Wellness Tip:</strong> Regular reflection sessions can help maintain emotional balance.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Emotion Timeline */}
              {emotions.length > 0 && (
                <Card>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-4">Emotion Timeline</h3>
                  <div className="space-y-2">
                    {emotions.map((emotion, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Heart className="w-4 h-4 text-primary-500" />
                          <span className="text-sm font-medium text-neutral-700 capitalize">{emotion.emotion}</span>
                        </div>
                        <div className="text-xs text-neutral-500">
                          {emotion.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Actions */}
              <div className="flex space-x-4">
                <Button
                  onClick={handleNewReflection}
                  variant="primary"
                  className="flex-1"
                >
                  New Reflection
                </Button>
                <Button
                  onClick={() => navigate('/home')}
                  variant="outline"
                  className="flex-1"
                >
                  Back to Home
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};