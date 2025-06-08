import React, { useState } from 'react';
import { User, Settings, Globe } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useLanguageStore, languages } from '../../stores/languageStore';
import { motion, AnimatePresence } from 'framer-motion';

export const TopBar: React.FC = () => {
  const { user, signOut } = useAuthStore();
  const { currentLanguage, setLanguage } = useLanguageStore();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-neutral-200">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <h1 className="text-xl font-bold text-neutral-800">Awaknow</h1>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 transition-colors"
          >
            <span className="text-lg">{currentLanguage.flag}</span>
            <span className="text-sm font-medium text-neutral-700">{currentLanguage.code.toUpperCase()}</span>
            <Globe className="w-4 h-4 text-neutral-500" />
          </button>

          <AnimatePresence>
            {showLanguageMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-large border z-50"
              >
                <div className="p-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang);
                        setShowLanguageMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="text-sm font-medium text-neutral-700">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Menu */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white"
            >
              <User className="w-5 h-5" />
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-large border z-50"
                >
                  <div className="p-2">
                    <div className="px-3 py-2 border-b border-neutral-200">
                      <p className="text-sm font-medium text-neutral-800">{user.email || user.phone}</p>
                      <p className="text-xs text-neutral-500 capitalize">{user.subscription_tier} Plan</p>
                    </div>
                    <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors">
                      <Settings className="w-4 h-4 text-neutral-500" />
                      <span className="text-sm text-neutral-700">Settings</span>
                    </button>
                    <button
                      onClick={signOut}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-error-50 text-error-600 text-sm transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};