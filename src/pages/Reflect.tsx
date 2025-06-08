import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, Heart, Brain, Smile, Frown, Meh, ArrowLeft } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { TopBar } from '../components/Layout/TopBar';
import { useNavigate } from 'react-router-dom';

export const Reflect: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'prompt' | 'listening' | 'processing' | 'response'>('prompt');
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [emotions, setEmotions] = useState<Array<{ emotion: string; timestamp: Date; intensity: number }>>([]);

  const emotionIcons = {
    happy: { icon: Smile, color: 'text-success-500' },
    sad: { icon: Frown, color: 'text-primary-500' },
    neutral: { icon: Meh, color: 'text-neutral-500' },
    anxious: { icon: Brain, color: 'text-warning-500' },
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setStep('listening');
    // Simulate recording process
    setTimeout(() => {
      setStep('processing');
      setTimeout(() => {
        setStep('response');
        // Add mock emotion data
        setEmotions(prev => [...prev, {
          emotion: 'reflective',
          timestamp: new Date(),
          intensity: 0.7
        }]);
      }, 2000);
    }, 3000);
  };

  const handleTextSubmit = () => {
    if (input.trim()) {
      setStep('processing');
      setTimeout(() => {
        setStep('response');
        setEmotions(prev => [...prev, {
          emotion: 'thoughtful',
          timestamp: new Date(),
          intensity: 0.6
        }]);
      }, 2000);
    }
  };

  const handleNewReflection = () => {
    setStep('prompt');
    setInput('');
    setIsRecording(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <TopBar />
      
      <div className="container mx-auto px-4 py-6 max-w-2xl">
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

                {/* Text Input */}
                <div className="space-y-4 mb-6">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your thoughts here..."
                    className="w-full h-32 p-4 border border-neutral-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <Button
                    onClick={handleTextSubmit}
                    disabled={!input.trim()}
                    className="w-full"
                    icon={Send}
                    iconPosition="right"
                  >
                    Share Your Thoughts
                  </Button>
                </div>

                <div className="flex items-center space-x-4 text-neutral-400">
                  <div className="flex-1 h-px bg-neutral-200"></div>
                  <span className="text-sm">or</span>
                  <div className="flex-1 h-px bg-neutral-200"></div>
                </div>

                {/* Voice Input */}
                <Button
                  onClick={handleStartRecording}
                  variant="secondary"
                  className="w-full mt-6"
                  icon={Mic}
                  iconPosition="right"
                >
                  Speak Your Mind
                </Button>
              </Card>
            </motion.div>
          )}

          {step === 'listening' && (
            <motion.div
              key="listening"
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
                  <Mic className="w-12 h-12 text-white" />
                </motion.div>
                <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
                  I'm listening...
                </h2>
                <p className="text-neutral-600 mb-8">
                  Speak freely about what's on your mind. Take your time.
                </p>
                <div className="flex justify-center space-x-2 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [8, 24, 8] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      className="w-2 bg-secondary-500 rounded-full"
                    />
                  ))}
                </div>
                <Button
                  onClick={() => setStep('processing')}
                  variant="outline"
                >
                  Done Speaking
                </Button>
              </Card>
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 border-4 border-primary-200 border-t-primary-500 rounded-full mx-auto mb-6"
                />
                <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
                  Processing your reflection...
                </h2>
                <p className="text-neutral-600">
                  Our AI is analyzing your thoughts and preparing personalized insights.
                </p>
              </Card>
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
              {/* AI Video Response */}
              <Card>
                <div className="aspect-video bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl mb-4 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-neutral-600">AI Video Response</p>
                    <p className="text-sm text-neutral-500 mt-2">Personalized insights based on your reflection</p>
                  </div>
                </div>
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