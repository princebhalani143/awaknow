import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MessageCircle, Heart, Brain, Share, ArrowLeft, Settings } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { TopBar } from '../components/Layout/TopBar';
import { useNavigate, useParams } from 'react-router-dom';

export const Session: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [step, setStep] = useState<'intro' | 'active' | 'complete'>('intro');
  const [participants, setParticipants] = useState(['You', 'Alex']);
  const [notes, setNotes] = useState('');
  const [sessionCode] = useState(id?.toUpperCase() || 'ABC123');

  const handleStartSession = () => {
    setStep('active');
  };

  const handleCompleteSession = () => {
    setStep('complete');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
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
            onClick={() => navigate('/resolve')}
            variant="ghost"
            icon={ArrowLeft}
            className="!p-2"
          />
          <div className="text-center">
            <h1 className="text-xl font-bold text-neutral-800">Resolution Session</h1>
            <p className="text-sm text-neutral-600">Code: {sessionCode}</p>
          </div>
          <Button
            variant="ghost"
            icon={Share}
            className="!p-2"
          />
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Session Info */}
              <Card>
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-neutral-800 mb-2">
                    Welcome to Your Resolution Session
                  </h2>
                  <p className="text-neutral-600">
                    A safe space for constructive dialogue with AI guidance
                  </p>
                </div>

                {/* Participants */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-neutral-800 mb-3">Participants</h3>
                  <div className="flex flex-wrap gap-2">
                    {participants.map((participant, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 px-3 py-2 bg-secondary-100 rounded-lg"
                      >
                        <div className="w-6 h-6 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{participant[0]}</span>
                        </div>
                        <span className="text-sm font-medium text-neutral-700">{participant}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Guidelines */}
                <div className="p-4 bg-gradient-to-r from-secondary-50 to-primary-50 rounded-xl mb-6">
                  <h4 className="font-semibold text-neutral-800 mb-3">Session Guidelines</h4>
                  <ul className="text-sm text-neutral-700 space-y-2">
                    <li className="flex items-start space-x-2">
                      <Heart className="w-4 h-4 text-secondary-500 mt-0.5 flex-shrink-0" />
                      <span>Speak with respect and empathy</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Brain className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                      <span>Listen actively and seek to understand</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <MessageCircle className="w-4 h-4 text-accent-500 mt-0.5 flex-shrink-0" />
                      <span>Use "I" statements to express feelings</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Settings className="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0" />
                      <span>AI will guide and facilitate the conversation</span>
                    </li>
                  </ul>
                </div>

                <Button
                  onClick={handleStartSession}
                  className="w-full"
                  size="lg"
                >
                  Begin Resolution Session
                </Button>
              </Card>
            </motion.div>
          )}

          {step === 'active' && (
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="grid lg:grid-cols-3 gap-6"
            >
              {/* Main Session Area */}
              <div className="lg:col-span-2 space-y-6">
                {/* AI Mediator */}
                <Card>
                  <div className="aspect-video bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Brain className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-neutral-600 font-medium">AI Mediator</p>
                      <p className="text-sm text-neutral-500 mt-2">
                        "Let's start by having each person share their perspective..."
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Current Phase */}
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-neutral-800">Current Phase</h3>
                    <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium">
                      Understanding Perspectives
                    </span>
                  </div>
                  <p className="text-neutral-600 mb-4">
                    Each participant is sharing their perspective on the situation. Listen actively and take notes on key points you want to address.
                  </p>
                  <div className="flex space-x-3">
                    <Button variant="secondary" className="flex-1">
                      I'm Ready to Share
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Continue Listening
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Personal Notes */}
                <Card>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-4">Your Private Notes</h3>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Write your thoughts, feelings, and key points you want to remember..."
                    className="w-full h-32 p-3 border border-neutral-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent text-sm"
                  />
                  <p className="text-xs text-neutral-500 mt-2">
                    These notes are private and only visible to you
                  </p>
                </Card>

                {/* Emotion Tracker */}
                <Card>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-4">How You're Feeling</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['Calm', 'Frustrated', 'Hopeful', 'Anxious'].map((emotion) => (
                      <button
                        key={emotion}
                        className="p-2 text-sm bg-neutral-50 hover:bg-secondary-50 border border-neutral-200 rounded-lg transition-colors"
                      >
                        {emotion}
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Session Progress */}
                <Card>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-4">Progress</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                      <span className="text-sm text-neutral-700">Introductions</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-secondary-500 rounded-full"></div>
                      <span className="text-sm text-neutral-700">Sharing Perspectives</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-neutral-300 rounded-full"></div>
                      <span className="text-sm text-neutral-500">Finding Common Ground</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-neutral-300 rounded-full"></div>
                      <span className="text-sm text-neutral-500">Action Planning</span>
                    </div>
                  </div>
                </Card>

                <Button
                  onClick={handleCompleteSession}
                  variant="outline"
                  className="w-full"
                >
                  End Session
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <Card className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-success-500 to-secondary-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
                  Session Complete
                </h2>
                <p className="text-neutral-600 mb-8">
                  Great work on having this important conversation. Here's a summary of your session.
                </p>
              </Card>

              {/* Summary */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-4">Key Insights</h3>
                  <div className="space-y-3 text-sm">
                    <p className="p-3 bg-primary-50 rounded-lg text-primary-800">
                      Both parties showed willingness to understand each other's perspectives
                    </p>
                    <p className="p-3 bg-secondary-50 rounded-lg text-secondary-800">
                      Common ground was found around shared values and goals
                    </p>
                    <p className="p-3 bg-success-50 rounded-lg text-success-800">
                      Clear action steps were identified for moving forward
                    </p>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-4">Next Steps</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      <span>Follow up in 1 week to check progress</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
                      <span>Practice active listening techniques</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                      <span>Schedule regular check-ins</span>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={() => navigate('/home')}
                  className="flex-1"
                >
                  Back to Home
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                >
                  Save Summary
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};