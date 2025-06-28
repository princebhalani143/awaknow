import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Accessibility, 
  X, 
  Eye, 
  EyeOff, 
  Type, 
  Contrast, 
  MousePointer, 
  Volume2, 
  Pause,
  RotateCcw,
  Zap,
  Brain,
  Focus,
  Settings
} from 'lucide-react';

interface AccessibilitySettings {
  // Visual
  highContrast: boolean;
  darkMode: boolean;
  largeText: boolean;
  dyslexiaFont: boolean;
  reduceMotion: boolean;
  hideImages: boolean;
  
  // Motor
  bigCursor: boolean;
  keyboardNavigation: boolean;
  clickAssist: boolean;
  
  // Cognitive
  readingGuide: boolean;
  focusMode: boolean;
  simplifiedUI: boolean;
  
  // Seizure/Epileptic
  pauseAnimations: boolean;
  reduceFlashing: boolean;
  
  // ADHD
  minimizeDistractions: boolean;
  enhanceFocus: boolean;
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  darkMode: false,
  largeText: false,
  dyslexiaFont: false,
  reduceMotion: false,
  hideImages: false,
  bigCursor: false,
  keyboardNavigation: false,
  clickAssist: false,
  readingGuide: false,
  focusMode: false,
  simplifiedUI: false,
  pauseAnimations: false,
  reduceFlashing: false,
  minimizeDistractions: false,
  enhanceFocus: false,
};

export const AccessibilityWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState<'visual' | 'motor' | 'cognitive' | 'seizure' | 'adhd'>('visual');

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Error loading accessibility settings:', error);
      }
    }
  }, []);

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Visual settings
    if (settings.highContrast) {
      root.style.setProperty('--contrast-multiplier', '1.5');
      body.classList.add('high-contrast');
    } else {
      root.style.removeProperty('--contrast-multiplier');
      body.classList.remove('high-contrast');
    }

    if (settings.darkMode) {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }

    if (settings.largeText) {
      root.style.setProperty('--text-scale', '1.25');
      body.classList.add('large-text');
    } else {
      root.style.removeProperty('--text-scale');
      body.classList.remove('large-text');
    }

    if (settings.dyslexiaFont) {
      body.classList.add('dyslexia-font');
    } else {
      body.classList.remove('dyslexia-font');
    }

    if (settings.reduceMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
      body.classList.add('reduce-motion');
    } else {
      root.style.removeProperty('--animation-duration');
      body.classList.remove('reduce-motion');
    }

    if (settings.hideImages) {
      body.classList.add('hide-images');
    } else {
      body.classList.remove('hide-images');
    }

    // Motor settings
    if (settings.bigCursor) {
      body.classList.add('big-cursor');
    } else {
      body.classList.remove('big-cursor');
    }

    if (settings.keyboardNavigation) {
      body.classList.add('keyboard-navigation');
    } else {
      body.classList.remove('keyboard-navigation');
    }

    // Cognitive settings
    if (settings.readingGuide) {
      body.classList.add('reading-guide');
    } else {
      body.classList.remove('reading-guide');
    }

    if (settings.focusMode) {
      body.classList.add('focus-mode');
    } else {
      body.classList.remove('focus-mode');
    }

    if (settings.simplifiedUI) {
      body.classList.add('simplified-ui');
    } else {
      body.classList.remove('simplified-ui');
    }

    // Seizure/Epileptic settings
    if (settings.pauseAnimations) {
      body.classList.add('pause-animations');
    } else {
      body.classList.remove('pause-animations');
    }

    if (settings.reduceFlashing) {
      body.classList.add('reduce-flashing');
    } else {
      body.classList.remove('reduce-flashing');
    }

    // ADHD settings
    if (settings.minimizeDistractions) {
      body.classList.add('minimize-distractions');
    } else {
      body.classList.remove('minimize-distractions');
    }

    if (settings.enhanceFocus) {
      body.classList.add('enhance-focus');
    } else {
      body.classList.remove('enhance-focus');
    }

    // Save to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key: keyof AccessibilitySettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('accessibility-settings');
  };

  const tabs = [
    { id: 'visual' as const, label: 'Visual', icon: Eye },
    { id: 'motor' as const, label: 'Motor', icon: MousePointer },
    { id: 'cognitive' as const, label: 'Cognitive', icon: Brain },
    { id: 'seizure' as const, label: 'Seizure', icon: Pause },
    { id: 'adhd' as const, label: 'ADHD', icon: Focus },
  ];

  const ToggleButton: React.FC<{
    label: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    icon: React.ComponentType<{ className?: string }>;
  }> = ({ label, description, checked, onChange, icon: Icon }) => (
    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
        <Icon className="w-4 h-4 text-primary-600" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-medium text-neutral-800 text-sm">{label}</h4>
          <button
            onClick={() => onChange(!checked)}
            className={`relative w-10 h-6 rounded-full transition-colors ${
              checked ? 'bg-primary-500' : 'bg-neutral-300'
            }`}
            aria-label={`Toggle ${label}`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                checked ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        <p className="text-xs text-neutral-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Accessibility Styles */}
      <style jsx global>{`
        /* High Contrast */
        .high-contrast {
          filter: contrast(150%);
        }

        /* Dark Mode */
        .dark-mode {
          background-color: #1a1a1a !important;
          color: #ffffff !important;
        }
        .dark-mode * {
          background-color: inherit;
          color: inherit;
        }

        /* Large Text */
        .large-text {
          font-size: 125% !important;
        }
        .large-text * {
          font-size: inherit !important;
        }

        /* Dyslexia Font */
        .dyslexia-font {
          font-family: 'Comic Sans MS', 'Arial', sans-serif !important;
        }
        .dyslexia-font * {
          font-family: inherit !important;
        }

        /* Reduce Motion */
        .reduce-motion *,
        .reduce-motion *::before,
        .reduce-motion *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }

        /* Hide Images */
        .hide-images img,
        .hide-images video,
        .hide-images [style*="background-image"] {
          opacity: 0.1 !important;
        }

        /* Big Cursor */
        .big-cursor,
        .big-cursor * {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="10" fill="black"/></svg>') 16 16, auto !important;
        }

        /* Keyboard Navigation */
        .keyboard-navigation *:focus {
          outline: 3px solid #0ea5e9 !important;
          outline-offset: 2px !important;
        }

        /* Reading Guide */
        .reading-guide {
          position: relative;
        }
        .reading-guide::before {
          content: '';
          position: fixed;
          top: 50%;
          left: 0;
          right: 0;
          height: 2px;
          background: #0ea5e9;
          z-index: 9999;
          pointer-events: none;
        }

        /* Focus Mode */
        .focus-mode * {
          background-color: #f9f9f9 !important;
          color: #333333 !important;
        }

        /* Simplified UI */
        .simplified-ui .shadow-soft,
        .simplified-ui .shadow-medium,
        .simplified-ui .shadow-large {
          box-shadow: none !important;
        }
        .simplified-ui .rounded-xl,
        .simplified-ui .rounded-2xl,
        .simplified-ui .rounded-3xl {
          border-radius: 4px !important;
        }

        /* Pause Animations */
        .pause-animations *,
        .pause-animations *::before,
        .pause-animations *::after {
          animation-play-state: paused !important;
        }

        /* Reduce Flashing */
        .reduce-flashing .animate-pulse,
        .reduce-flashing .animate-spin,
        .reduce-flashing .animate-bounce {
          animation: none !important;
        }

        /* Minimize Distractions */
        .minimize-distractions .bg-gradient-to-r,
        .minimize-distractions .bg-gradient-to-br,
        .minimize-distractions .bg-gradient-to-l {
          background: #f3f4f6 !important;
        }

        /* Enhance Focus */
        .enhance-focus *:focus {
          background-color: #fef3c7 !important;
          outline: 3px solid #f59e0b !important;
        }
      `}</style>

      {/* Widget Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-large flex items-center justify-center z-50 transition-all duration-300 hover:scale-110"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open accessibility settings"
      >
        <Accessibility className="w-6 h-6" />
      </motion.button>

      {/* Widget Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Accessibility className="w-5 h-5 text-primary-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-neutral-800">Accessibility Settings</h2>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={resetSettings}
                    className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                    aria-label="Reset all settings"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                    aria-label="Close accessibility settings"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-neutral-200 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-neutral-600 hover:text-neutral-800'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="p-6 max-h-96 overflow-y-auto">
                {activeTab === 'visual' && (
                  <div className="space-y-4">
                    <ToggleButton
                      label="High Contrast"
                      description="Increase contrast for better visibility"
                      checked={settings.highContrast}
                      onChange={(checked) => updateSetting('highContrast', checked)}
                      icon={Contrast}
                    />
                    <ToggleButton
                      label="Dark Mode"
                      description="Switch to dark theme for reduced eye strain"
                      checked={settings.darkMode}
                      onChange={(checked) => updateSetting('darkMode', checked)}
                      icon={Settings}
                    />
                    <ToggleButton
                      label="Large Text"
                      description="Increase text size for better readability"
                      checked={settings.largeText}
                      onChange={(checked) => updateSetting('largeText', checked)}
                      icon={Type}
                    />
                    <ToggleButton
                      label="Dyslexia-Friendly Font"
                      description="Use fonts designed for dyslexic users"
                      checked={settings.dyslexiaFont}
                      onChange={(checked) => updateSetting('dyslexiaFont', checked)}
                      icon={Type}
                    />
                    <ToggleButton
                      label="Reduce Motion"
                      description="Minimize animations and transitions"
                      checked={settings.reduceMotion}
                      onChange={(checked) => updateSetting('reduceMotion', checked)}
                      icon={Pause}
                    />
                    <ToggleButton
                      label="Hide Images"
                      description="Reduce visual clutter by hiding images"
                      checked={settings.hideImages}
                      onChange={(checked) => updateSetting('hideImages', checked)}
                      icon={EyeOff}
                    />
                  </div>
                )}

                {activeTab === 'motor' && (
                  <div className="space-y-4">
                    <ToggleButton
                      label="Big Cursor"
                      description="Increase cursor size for easier tracking"
                      checked={settings.bigCursor}
                      onChange={(checked) => updateSetting('bigCursor', checked)}
                      icon={MousePointer}
                    />
                    <ToggleButton
                      label="Keyboard Navigation"
                      description="Enhanced keyboard navigation support"
                      checked={settings.keyboardNavigation}
                      onChange={(checked) => updateSetting('keyboardNavigation', checked)}
                      icon={Settings}
                    />
                    <ToggleButton
                      label="Click Assist"
                      description="Larger click targets for easier interaction"
                      checked={settings.clickAssist}
                      onChange={(checked) => updateSetting('clickAssist', checked)}
                      icon={MousePointer}
                    />
                  </div>
                )}

                {activeTab === 'cognitive' && (
                  <div className="space-y-4">
                    <ToggleButton
                      label="Reading Guide"
                      description="Add a reading line to help focus"
                      checked={settings.readingGuide}
                      onChange={(checked) => updateSetting('readingGuide', checked)}
                      icon={Eye}
                    />
                    <ToggleButton
                      label="Focus Mode"
                      description="Simplified color scheme for better focus"
                      checked={settings.focusMode}
                      onChange={(checked) => updateSetting('focusMode', checked)}
                      icon={Focus}
                    />
                    <ToggleButton
                      label="Simplified UI"
                      description="Remove decorative elements and shadows"
                      checked={settings.simplifiedUI}
                      onChange={(checked) => updateSetting('simplifiedUI', checked)}
                      icon={Settings}
                    />
                  </div>
                )}

                {activeTab === 'seizure' && (
                  <div className="space-y-4">
                    <ToggleButton
                      label="Pause Animations"
                      description="Stop all animations to prevent seizures"
                      checked={settings.pauseAnimations}
                      onChange={(checked) => updateSetting('pauseAnimations', checked)}
                      icon={Pause}
                    />
                    <ToggleButton
                      label="Reduce Flashing"
                      description="Minimize flashing and blinking elements"
                      checked={settings.reduceFlashing}
                      onChange={(checked) => updateSetting('reduceFlashing', checked)}
                      icon={Zap}
                    />
                  </div>
                )}

                {activeTab === 'adhd' && (
                  <div className="space-y-4">
                    <ToggleButton
                      label="Minimize Distractions"
                      description="Reduce visual noise and distracting elements"
                      checked={settings.minimizeDistractions}
                      onChange={(checked) => updateSetting('minimizeDistractions', checked)}
                      icon={Focus}
                    />
                    <ToggleButton
                      label="Enhance Focus"
                      description="Highlight focused elements more prominently"
                      checked={settings.enhanceFocus}
                      onChange={(checked) => updateSetting('enhanceFocus', checked)}
                      icon={Brain}
                    />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-neutral-200 bg-neutral-50">
                <p className="text-xs text-neutral-600 text-center">
                  These settings are saved locally and will persist across sessions. 
                  For additional accessibility support, contact{' '}
                  <a href="mailto:accessibility@awaknow.org" className="text-primary-600 hover:underline">
                    accessibility@awaknow.org
                  </a>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};