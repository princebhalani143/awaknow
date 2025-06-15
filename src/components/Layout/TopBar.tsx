import React, { useState } from 'react';
import { User, Settings, Brain, Lock, LogOut, Shield, Crown, Trash2, Receipt, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useSubscriptionStore } from '../../stores/subscriptionStore';

export const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const { subscription } = useSubscriptionStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showAccountDeletion, setShowAccountDeletion] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const handleLogoClick = () => {
    if (user) {
      navigate('/home');
    } else {
      navigate('/');
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setActionMessage('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setActionMessage('Password must be at least 6 characters');
      return;
    }

    setActionLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      setActionMessage('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setTimeout(() => {
        setShowPasswordChange(false);
        setActionMessage('');
      }, 2000);
    } catch (error: any) {
      setActionMessage(error.message || 'Failed to update password');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAccountDeletion = async () => {
    if (deleteConfirmation !== 'DELETE') {
      setActionMessage('Please type DELETE to confirm');
      return;
    }

    if (!user?.email) {
      setActionMessage('Unable to identify user email');
      return;
    }

    setActionLoading(true);
    try {
      // Add email to blocked list (prevent re-registration for free plans)
      await supabase.from('blocked_emails').insert({
        email: user.email,
        blocked_at: new Date().toISOString(),
        reason: 'user_requested_deletion'
      });

      // Delete user data (RLS policies will handle cascade deletion)
      const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
      
      if (deleteError) {
        // If admin deletion fails, try user deletion
        const { error: userDeleteError } = await supabase.auth.signOut();
        if (userDeleteError) throw userDeleteError;
      }

      // Sign out and redirect
      await signOut();
      navigate('/');
    } catch (error: any) {
      setActionMessage(error.message || 'Failed to delete account');
    } finally {
      setActionLoading(false);
    }
  };

  const closePasswordChange = () => {
    setShowPasswordChange(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setActionMessage('');
  };

  const closeAccountDeletion = () => {
    setShowAccountDeletion(false);
    setDeleteConfirmation('');
    setActionMessage('');
  };

  const navigationItems = [
    { label: 'About', path: '/about' },
    { label: 'Plans', path: '/plans' },
  ];

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

        {/* Desktop Navigation */}
        {!user && (
          <div className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="text-neutral-600 hover:text-primary-600 transition-colors font-medium"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center space-x-3">
          {/* Subscription Badge */}
          {user && subscription && subscription.plan_id !== 'awaknow_free' && (
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-accent-100 to-primary-100 rounded-full">
              <Crown className="w-4 h-4 text-accent-600" />
              <span className="text-sm font-medium text-accent-700">{subscription.plan_name}</span>
            </div>
          )}

          {/* Mobile Menu Button */}
          {!user && (
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

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
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-neutral-500 capitalize">
                          {subscription?.plan_name || 'Free'} Plan
                        </p>
                        {subscription?.plan_id !== 'awaknow_free' && (
                          <Crown className="w-3 h-3 text-accent-500" />
                        )}
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate('/subscription');
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
                    >
                      <Crown className="w-4 h-4 text-neutral-500" />
                      <span className="text-sm text-neutral-700">Subscription</span>
                    </button>

                    <button 
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate('/billing-history');
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
                    >
                      <Receipt className="w-4 h-4 text-neutral-500" />
                      <span className="text-sm text-neutral-700">Billing History</span>
                    </button>

                    <button 
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate('/analytics');
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-neutral-500" />
                      <span className="text-sm text-neutral-700">Analytics</span>
                    </button>

                    <button 
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowPasswordChange(true);
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
                    >
                      <Lock className="w-4 h-4 text-neutral-500" />
                      <span className="text-sm text-neutral-700">Change Password</span>
                    </button>

                    <button 
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowAccountDeletion(true);
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-error-50 text-error-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm">Delete Account</span>
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

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {!user && showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-neutral-200"
          >
            <div className="p-4 space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-neutral-600 hover:text-primary-600 hover:bg-neutral-50 rounded-lg transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password Change Modal */}
      <AnimatePresence>
        {showPasswordChange && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closePasswordChange}
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
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">Change Password</h3>
                <p className="text-sm text-neutral-600">
                  Enter your new password below
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                </div>

                {actionMessage && (
                  <div className={`p-3 rounded-lg text-sm ${
                    actionMessage.includes('successfully') 
                      ? 'bg-success-50 text-success-800' 
                      : 'bg-error-50 text-error-800'
                  }`}>
                    {actionMessage}
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={closePasswordChange}
                    className="flex-1 px-4 py-2 border border-neutral-300 rounded-xl text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePasswordChange}
                    disabled={actionLoading || !newPassword || !confirmPassword}
                    className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {actionLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Account Deletion Modal */}
      <AnimatePresence>
        {showAccountDeletion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeAccountDeletion}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-error-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-error-600" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">Delete Account</h3>
                <p className="text-sm text-neutral-600">
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-error-50 rounded-lg border border-error-200">
                  <h4 className="font-medium text-error-800 mb-2">What will be deleted:</h4>
                  <ul className="text-sm text-error-700 space-y-1">
                    <li>• All your sessions and conversations</li>
                    <li>• Personal insights and analytics</li>
                    <li>• Account settings and preferences</li>
                    <li>• Subscription and billing history</li>
                  </ul>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Type "DELETE" to confirm
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-error-500 focus:border-transparent"
                    placeholder="Type DELETE"
                  />
                </div>

                {actionMessage && (
                  <div className="p-3 bg-error-50 text-error-800 rounded-lg text-sm">
                    {actionMessage}
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={closeAccountDeletion}
                    className="flex-1 px-4 py-2 border border-neutral-300 rounded-xl text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAccountDeletion}
                    disabled={actionLoading || deleteConfirmation !== 'DELETE'}
                    className="flex-1 px-4 py-2 bg-error-500 text-white rounded-xl hover:bg-error-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {actionLoading ? 'Deleting...' : 'Delete Account'}
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