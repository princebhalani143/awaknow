import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Link, ArrowLeft, Share, UserPlus } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { Input } from '../components/UI/Input';
import { TopBar } from '../components/Layout/TopBar';
import { useNavigate } from 'react-router-dom';

export const Resolve: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'select' | 'create' | 'join'>('select');
  const [sessionTitle, setSessionTitle] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateSession = () => {
    // Generate mock session ID and navigate
    const sessionId = 'session-' + Math.random().toString(36).substr(2, 9);
    navigate(`/session/${sessionId}`);
  };

  const handleJoinSession = () => {
    if (joinCode.trim()) {
      navigate(`/session/${joinCode}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
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
            onClick={() => mode === 'select' ? navigate('/home') : setMode('select')}
            variant="ghost"
            icon={ArrowLeft}
            className="!p-2"
          />
          <h1 className="text-2xl font-bold text-neutral-800">Resolve Together</h1>
          <div className="w-10"></div>
        </motion.div>

        <AnimatePresence mode="wait">
          {mode === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <Card className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
                  Conflict Resolution Sessions
                </h2>
                <p className="text-neutral-600 mb-8">
                  Create a safe space for constructive dialogue with AI-guided mediation and communication tools.
                </p>
              </Card>

              <div className="grid gap-4">
                <Card
                  hover
                  onClick={() => setMode('create')}
                  className="cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-neutral-800">Start New Session</h3>
                      <p className="text-neutral-600 text-sm">Create a new conflict resolution session and invite others</p>
                    </div>
                  </div>
                </Card>

                <Card
                  hover
                  onClick={() => setMode('join')}
                  className="cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                      <UserPlus className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-neutral-800">Join Session</h3>
                      <p className="text-neutral-600 text-sm">Enter a session code to join an existing resolution session</p>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {mode === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <Card>
                <h2 className="text-xl font-semibold text-neutral-800 mb-6">Create Resolution Session</h2>
                
                <div className="space-y-4">
                  <Input
                    label="Session Title"
                    placeholder="e.g., Family Discussion, Work Conflict, etc."
                    value={sessionTitle}
                    onChange={setSessionTitle}
                  />

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-neutral-700">
                      Description (Optional)
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Briefly describe what you'd like to resolve..."
                      className="w-full h-24 p-3 border border-neutral-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                    />
                  </div>

                  <div className="p-4 bg-secondary-50 rounded-xl">
                    <h4 className="font-medium text-secondary-800 mb-2">Session Features</h4>
                    <ul className="text-sm text-secondary-700 space-y-1">
                      <li>• AI-guided mediation and communication tools</li>
                      <li>• Private notes and emotion tracking for each participant</li>
                      <li>• Safe environment with structured dialogue</li>
                      <li>• Post-session insights and action plans</li>
                    </ul>
                  </div>

                  <Button
                    onClick={handleCreateSession}
                    disabled={!sessionTitle.trim()}
                    className="w-full"
                    icon={Plus}
                    iconPosition="right"
                  >
                    Create Session
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {mode === 'join' && (
            <motion.div
              key="join"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <Card>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <Link className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-neutral-800 mb-2">Join Session</h2>
                  <p className="text-neutral-600">Enter the session code shared with you</p>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Session Code"
                    placeholder="Enter 6-digit session code"
                    value={joinCode}
                    onChange={setJoinCode}
                    className="text-center"
                  />

                  <div className="p-4 bg-primary-50 rounded-xl">
                    <h4 className="font-medium text-primary-800 mb-2">What to Expect</h4>
                    <ul className="text-sm text-primary-700 space-y-1">
                      <li>• You'll enter a safe, guided conversation space</li>
                      <li>• Each participant has private note-taking</li>
                      <li>• AI mediator helps facilitate healthy dialogue</li>
                      <li>• All interactions remain confidential</li>
                    </ul>
                  </div>

                  <Button
                    onClick={handleJoinSession}
                    disabled={joinCode.length !== 6}
                    className="w-full"
                    icon={UserPlus}
                    iconPosition="right"
                  >
                    Join Session
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};