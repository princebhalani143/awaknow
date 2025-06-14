import React, { useState } from 'react';
import { User, Settings, Brain, Lock, LogOut, Shield } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const handleLogoClick = () => {
    if (user) {
      navigate('/home');
    } else {
      navigate('/');
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      setResetMessage('Please enter your email address');
      return;
    }

    setResetLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail);
      if (error) throw error;
      setResetMessage('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      setResetMessage(error.message || 'Failed to send reset email');
    } finally {
      setResetLoading(false);
    }
  };

  const closePasswordReset = () => {
    setShowPasswordReset(false);
    setResetEmail('');
    setResetMessage('');
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-neutral-200">
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleLogoClick}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-neutral-800">AwakNow</h1>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          {/* User Icon - Always visible */}
          <div className="relative">
            <button
              onClick={() => user ? setShowProfileMenu(!showProfileMenu) : navigate('/auth')}
              className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white hover:shadow-lg transition-shadow"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Profile Menu - Only show when logged in */}
            <AnimatePresence>
              {user && showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-large border z-50"
                >
                  <div className="p-2">
                    <div className="px-3 py-3 border-b border-neutral-200">
                      <p className="text-sm font-medium text-neutral-800 truncate">{user.email}</p>
                      <p className="text-xs text-neutral-500 capitalize">{user.subscription_tier} Plan</p>
                    </div>
                    
                    <button 
                      onClick={() => {
                        setShowProfileMenu(false);
                        // Navigate to settings page (future implementation)
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-neutral-500" />
                      <span className="text-sm text-neutral-700">Account Settings</span>
                    </button>

                    <button 
                      onClick={() => {
                        setShowProfileMenu(false);
                        setResetEmail(user.email || '');
                        setShowPasswordReset(true);
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
                    >
                      <Lock className="w-4 h-4 text-neutral-500" />
                      <span className="text-sm text-neutral-700">Change Password</span>
                    </button>

                    <button 
                      onClick={() => {
                        setShowProfileMenu(false);
                        // Navigate to security page (future implementation)
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
                    >
                      <Shield className="w-4 h-4 text-neutral-500" />
                      <span className="text-sm text-neutral-700">Security</span>
                    </button>

                    <div className="border-t border-neutral-200 mt-2 pt-2">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          signOut();
                        }}
                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-error-50 text-error-600 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Sign Out</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Password Reset Modal */}
      <AnimatePresence>
        {showPasswordReset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closePasswordReset}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">Reset Password</h3>
                <p className="text-sm text-neutral-600">
                  We'll send a password reset link to your email address
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                {resetMessage && (
                  <div className={`p-3 rounded-lg text-sm ${
                    resetMessage.includes('sent') 
                      ? 'bg-success-50 text-success-800' 
                      : 'bg-error-50 text-error-800'
                  }`}>
                    {resetMessage}
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={closePasswordReset}
                    className="flex-1 px-4 py-2 border border-neutral-300 rounded-xl text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePasswordReset}
                    disabled={resetLoading || !resetEmail}
                    className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {resetLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};