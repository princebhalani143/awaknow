import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, Heart, Brain, Smile, Frown, Meh, ArrowLeft, Video, Play, Pause, Square } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
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

  const emotionIcons = {
    happy: { icon: Smile, color: 'text-success-500' },
    sad: { icon: Frown, color: 'text-primary-500' },
    neutral: { icon: Meh, color: 'text-neutral-500' },
    anxious: { icon: Brain, color: 'text-warning-500' },
  };

  const handleStartSession = async () => {
    if (!user) return;

    setStep('creating');
    setError(null);

    try {
      // Create session
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

      setSessionId(sessionResult.sessionId!);
      setStep('tavus-loading');

      // Create Tavus conversation
      const tavusResult = await TavusService.createConversationalVideo({
        sessionId: sessionResult.sessionId!,
        userId: user.id,
        prompt: input || 'I want to reflect on my thoughts and feelings',
        sessionType: 'reflect_alone',
        participantContext: 'Personal emotional wellness and reflection session'
      });

      if (tavusResult.success && tavusResult.videoUrl) {
        setTavusVideoUrl(tavusResult.videoUrl);
        setStep('conversation');
      } else {
        setError(tavusResult.error || 'Failed to create AI conversation');
        setStep('prompt');
      }
    } catch (error) {
      console.error('Error starting session:', error);
      setError('Failed to start session. Please try again.');
      setStep('prompt');
    }
  };

  const handleEndSession = () => {
    setStep('response');
    // Add mock emotion data
    setEmotions(prev => [...prev, {
      emotion: 'reflective',
      timestamp: new Date(),
      intensity: 0.7
    }]);
  };

  const handleNewReflection = () => {
    setStep('prompt');
    setInput('');
    setIsRecording(false);
    setSessionId(null);
    setTavusVideoUrl(null);
    setError(null);
    setEmotions([]);
  };

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
          <h1 className="text-2xl font-bold text-neutral-800">Reflect Alone</h1>
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
                  Share your thoughts, feelings, or experiences. Our AI companion will listen and provide personalized insights.
                </p>

                {error && (
                  <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-xl">
                    <p className="text-error-800 text-sm">{error}</p>
                  </div>
                )}

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
                  Creating a personalized conversation experience just for you
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

          {step === 'conversation' && (
            <motion.div
              key="conversation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* AI Video Interface */}
              <Card>
                <div className="aspect-video bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl mb-4 relative overflow-hidden">
                  {tavusVideoUrl ? (
                    <iframe
                      src={tavusVideoUrl}
                      className="w-full h-full rounded-xl"
                      allow="camera; microphone; autoplay"
                      title="AI Conversation"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <Brain className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-neutral-600 font-medium">AI Companion Ready</p>
                        <p className="text-sm text-neutral-500 mt-2">
                          Your personalized conversation partner
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-neutral-600">Live Conversation</span>
                  </div>
                  <Button
                    onClick={handleEndSession}
                    variant="outline"
                    size="sm"
                    icon={Square}
                  >
                    End Session
                  </Button>
                </div>
              </Card>

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
                  <h3 className="text-lg font-semibold text-neutral-800 mb-4">Privacy & Security</h3>
                  <ul className="space-y-2 text-sm text-neutral-600">
                    <li>🔒 End-to-end encrypted</li>
                    <li>🤐 Completely confidential</li>
                    <li>🗑️ Delete anytime</li>
                    <li>📊 Your data, your control</li>
                  </ul>
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
                  Thank you for taking time to reflect. Here are your personalized insights.
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