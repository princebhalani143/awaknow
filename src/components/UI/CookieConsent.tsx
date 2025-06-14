import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Settings, X, Check } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always required
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Show banner after a short delay
      setTimeout(() => setShowBanner(true), 2000);
    } else {
      // Load saved preferences
      try {
        const savedPreferences = JSON.parse(cookieConsent);
        setPreferences(savedPreferences);
      } catch (error) {
        console.error('Error parsing cookie preferences:', error);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleAcceptSelected = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleRejectAll = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    setPreferences(essentialOnly);
    localStorage.setItem('cookieConsent', JSON.stringify(essentialOnly));
    setShowBanner(false);
    setShowSettings(false);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'essential') return; // Essential cookies cannot be disabled
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const cookieTypes = [
    {
      key: 'essential' as keyof CookiePreferences,
      title: 'Essential Cookies',
      description: 'Required for basic website functionality, security, and user authentication.',
      required: true,
    },
    {
      key: 'analytics' as keyof CookiePreferences,
      title: 'Analytics Cookies',
      description: 'Help us understand how you use our platform to improve user experience.',
      required: false,
    },
    {
      key: 'preferences' as keyof CookiePreferences,
      title: 'Preference Cookies',
      description: 'Remember your settings and preferences for a personalized experience.',
      required: false,
    },
    {
      key: 'marketing' as keyof CookiePreferences,
      title: 'Marketing Cookies',
      description: 'Used to deliver relevant content and measure campaign effectiveness.',
      required: false,
    },
  ];

  return (
    <>
      {/* Compact Cookie Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 shadow-large"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-3 md:space-y-0 md:space-x-6">
                {/* Content */}
                <div className="flex items-start space-x-3 flex-1">
                  <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Cookie className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-800 text-sm mb-1">Cookie Preferences</h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      We use cookies to enhance your experience and provide personalized content. 
                      You can customize your preferences or accept all cookies.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Button
                    onClick={handleAcceptAll}
                    size="sm"
                    className="text-xs px-3 py-1.5"
                  >
                    Accept All
                  </Button>
                  <Button
                    onClick={() => setShowSettings(true)}
                    variant="outline"
                    size="sm"
                    className="text-xs px-3 py-1.5"
                  >
                    Customize
                  </Button>
                  <Button
                    onClick={handleRejectAll}
                    variant="ghost"
                    size="sm"
                    className="text-xs px-3 py-1.5 text-neutral-600"
                  >
                    Reject All
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cookie Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                    <Cookie className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-neutral-800">Cookie Preferences</h2>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
              </div>

              <div className="space-y-6 mb-6">
                <p className="text-neutral-600 text-sm leading-relaxed">
                  Customize your cookie preferences below. Essential cookies are required for basic functionality 
                  and cannot be disabled. Learn more in our{' '}
                  <a href="/privacy-policy" className="text-primary-600 hover:text-primary-700 underline">
                    Privacy Policy
                  </a>.
                </p>

                <div className="space-y-4">
                  {cookieTypes.map((type) => (
                    <div
                      key={type.key}
                      className="flex items-start justify-between p-4 border border-neutral-200 rounded-xl"
                    >
                      <div className="flex-1 mr-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-neutral-800">{type.title}</h3>
                          {type.required && (
                            <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-neutral-600">{type.description}</p>
                      </div>
                      <button
                        onClick={() => togglePreference(type.key)}
                        disabled={type.required}
                        className={`
                          w-12 h-6 rounded-full transition-colors relative
                          ${preferences[type.key] 
                            ? 'bg-primary-500' 
                            : 'bg-neutral-300'
                          }
                          ${type.required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                      >
                        <div
                          className={`
                            w-5 h-5 bg-white rounded-full shadow-sm transition-transform absolute top-0.5
                            ${preferences[type.key] ? 'translate-x-6' : 'translate-x-0.5'}
                          `}
                        >
                          {preferences[type.key] && (
                            <Check className="w-3 h-3 text-primary-500 absolute top-1 left-1" />
                          )}
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={handleAcceptSelected}
                  className="flex-1"
                >
                  Save Preferences
                </Button>
                <Button
                  onClick={handleAcceptAll}
                  variant="outline"
                  className="flex-1"
                >
                  Accept All
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};