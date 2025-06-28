import React, { useState } from 'react';
import { User, Brain, Menu, X, UserCircle } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSubscriptionStore } from '../../stores/subscriptionStore';

export const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { subscription } = useSubscriptionStore();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogoClick = () => {
    if (user) {
      navigate('/home');
    } else {
      navigate('/');
    }
  };

  // Navigation items - show different items based on login status
  const publicNavigationItems = [
    { label: 'About', path: '/about' },
    { label: 'Plans', path: '/plans' },
    { label: 'Insights', path: '/blog' },
  ];

  // Removed "Home" from logged-in navigation - users can click logo to go home
  const loggedInNavigationItems = [
    { label: 'Reflect', path: '/reflect' },
    { label: 'Resolve', path: '/resolve' },
    { label: 'Analytics', path: '/analytics' },
  ];

  const navigationItems = user ? loggedInNavigationItems : publicNavigationItems;

  return (
    <>
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-neutral-200 relative z-40">
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

        {/* Desktop Navigation - Show for both logged in and logged out users */}
        <div className="hidden md:flex items-center space-x-6 main-navigation">
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

        <div className="flex items-center space-x-3">
          {/* Subscription Badge */}
          {user && subscription && subscription.plan_id !== 'awaknow_free' && (
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-accent-100 to-primary-100 rounded-full">
              <span className="text-sm font-medium text-accent-700">{subscription.plan_name}</span>
            </div>
          )}

          {/* Mobile Menu Button - Show for all users */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* User Icon - Always visible */}
          <div className="relative">
            <button
              onClick={() => user ? navigate('/profile') : navigate('/auth')}
              className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white hover:shadow-lg transition-shadow relative z-50"
            >
              {user ? <UserCircle className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu - Show for all users */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-neutral-200 relative z-30"
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
              
              {/* Add profile link for mobile when logged in */}
              {user && (
                <button
                  onClick={() => {
                    navigate('/profile');
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-neutral-600 hover:text-primary-600 hover:bg-neutral-50 rounded-lg transition-colors"
                >
                  Edit Profile
                </button>
              )}
              
              {/* Add auth button for mobile when not logged in */}
              {!user && (
                <button
                  onClick={() => {
                    navigate('/auth');
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors font-medium"
                >
                  Sign In
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};