import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
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

// Person icon with arms stretched outward
const PersonIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="5" r="3" />
    <path d="M12 8v9" />
    <path d="M8 12H4" />
    <path d="M20 12h-4" />
    <path d="M8 17l-2 4" />
    <path d="M16 17l2 4" />
  </svg>
);

export const AccessibilityWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState<'visual' | 'motor' | 'cognitive' | 'seizure' | 'adhd'>('visual');
  const [readingGuidePosition, setReadingGuidePosition] = useState(0);

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
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (settings.darkMode) {
      root.classList.add('dark-mode');
    } else {
      root.classList.remove('dark-mode');
    }

    if (settings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    if (settings.dyslexiaFont) {
      root.classList.add('dyslexia-font');
    } else {
      root.classList.remove('dyslexia-font');
    }

    if (settings.reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    if (settings.hideImages) {
      root.classList.add('hide-images');
    } else {
      root.classList.remove('hide-images');
    }

    // Motor settings
    if (settings.bigCursor) {
      root.classList.add('big-cursor');
    } else {
      root.classList.remove('big-cursor');
    }

    if (settings.keyboardNavigation) {
      root.classList.add('keyboard-navigation');
    } else {
      root.classList.remove('keyboard-navigation');
    }

    if (settings.clickAssist) {
      root.classList.add('click-assist');
    } else {
      root.classList.remove('click-assist');
    }

    // Cognitive settings
    if (settings.readingGuide) {
      root.classList.add('reading-guide');
      
      // Add mouse move event listener for reading guide
      const handleMouseMove = (e: MouseEvent) => {
        setReadingGuidePosition(e.clientY);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
      };
    } else {
      root.classList.remove('reading-guide');
    }

    if (settings.focusMode) {
      root.classList.add('focus-mode');
    } else {
      root.classList.remove('focus-mode');
    }

    if (settings.simplifiedUI) {
      root.classList.add('simplified-ui');
    } else {
      root.classList.remove('simplified-ui');
    }

    // Seizure/Epileptic settings
    if (settings.pauseAnimations) {
      root.classList.add('pause-animations');
    } else {
      root.classList.remove('pause-animations');
    }

    if (settings.reduceFlashing) {
      root.classList.add('reduce-flashing');
    } else {
      root.classList.remove('reduce-flashing');
    }

    // ADHD settings
    if (settings.minimizeDistractions) {
      root.classList.add('minimize-distractions');
    } else {
      root.classList.remove('minimize-distractions');
    }

    if (settings.enhanceFocus) {
      root.classList.add('enhance-focus');
    } else {
      root.classList.remove('enhance-focus');
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
            role="switch"
            aria-checked={checked}
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
          filter: contrast(1.5);
        }
        .high-contrast img,
        .high-contrast video {
          filter: contrast(1.2);
        }
        .high-contrast button,
        .high-contrast a {
          filter: contrast(1.3);
        }

        /* Dark Mode */
        .dark-mode {
          filter: invert(1) hue-rotate(180deg);
        }
        .dark-mode img,
        .dark-mode video {
          filter: invert(1) hue-rotate(180deg);
        }

        /* Large Text */
        .large-text {
          font-size: 120% !important;
          line-height: 1.5 !important;
        }
        .large-text h1 {
          font-size: 2.5rem !important;
        }
        .large-text h2 {
          font-size: 2rem !important;
        }
        .large-text h3 {
          font-size: 1.75rem !important;
        }
        .large-text p, 
        .large-text span, 
        .large-text div, 
        .large-text button {
          font-size: 1.2rem !important;
        }

        /* Dyslexia Font */
        .dyslexia-font,
        .dyslexia-font * {
          font-family: 'OpenDyslexic', 'Comic Sans MS', 'Arial', sans-serif !important;
          letter-spacing: 0.05em !important;
          word-spacing: 0.1em !important;
          line-height: 1.5 !important;
        }

        /* Reduce Motion */
        .reduce-motion *,
        .reduce-motion *::before,
        .reduce-motion *::after {
          animation-duration: 0.001s !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.001s !important;
          scroll-behavior: auto !important;
        }

        /* Hide Images */
        .hide-images img {
          opacity: 0 !important;
          filter: grayscale(100%) !important;
        }
        .hide-images [style*="background-image"] {
          background-image: none !important;
        }
        .hide-images video {
          display: none !important;
        }
        .hide-images svg {
          visibility: visible !important;
        }

        /* Big Cursor */
        .big-cursor,
        .big-cursor * {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' fill='none'%3E%3Ccircle cx='16' cy='16' r='12' fill='%230ea5e9' fill-opacity='0.5'/%3E%3Ccircle cx='16' cy='16' r='6' fill='%230ea5e9'/%3E%3C/svg%3E"), auto !important;
        }
        .big-cursor a,
        .big-cursor button {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' fill='none'%3E%3Ccircle cx='16' cy='16' r='12' fill='%23f97316' fill-opacity='0.5'/%3E%3Ccircle cx='16' cy='16' r='6' fill='%23f97316'/%3E%3C/svg%3E"), pointer !important;
        }

        /* Keyboard Navigation */
        .keyboard-navigation *:focus {
          outline: 3px solid #0ea5e9 !important;
          outline-offset: 3px !important;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.4) !important;
        }
        .keyboard-navigation button:focus,
        .keyboard-navigation a:focus {
          background-color: rgba(14, 165, 233, 0.1) !important;
        }

        /* Click Assist */
        .click-assist a,
        .click-assist button,
        .click-assist input,
        .click-assist select,
        .click-assist textarea {
          padding: 0.5rem !important;
          min-height: 44px !important;
          min-width: 44px !important;
        }

        /* Reading Guide */
        .reading-guide-line {
          position: fixed;
          left: 0;
          right: 0;
          height: 2px;
          background-color: rgba(14, 165, 233, 0.7);
          z-index: 9999;
          pointer-events: none;
          box-shadow: 0 0 4px rgba(14, 165, 233, 0.5), 0 0 10px rgba(14, 165, 233, 0.3);
        }

        /* Focus Mode */
        .focus-mode p,
        .focus-mode h1,
        .focus-mode h2,
        .focus-mode h3,
        .focus-mode h4,
        .focus-mode h5,
        .focus-mode h6,
        .focus-mode span,
        .focus-mode div {
          color: #000000 !important;
          background-color: #ffffff !important;
        }
        .focus-mode p:hover,
        .focus-mode h1:hover,
        .focus-mode h2:hover,
        .focus-mode h3:hover,
        .focus-mode h4:hover,
        .focus-mode h5:hover,
        .focus-mode h6:hover,
        .focus-mode span:hover,
        .focus-mode div:hover {
          background-color: #f0f9ff !important;
        }

        /* Simplified UI */
        .simplified-ui * {
          border-radius: 4px !important;
          box-shadow: none !important;
          background-image: none !important;
        }
        .simplified-ui .bg-gradient-to-r,
        .simplified-ui .bg-gradient-to-br,
        .simplified-ui .bg-gradient-to-l,
        .simplified-ui .bg-gradient-to-bl,
        .simplified-ui .bg-gradient-to-t,
        .simplified-ui .bg-gradient-to-tr {
          background: #f3f4f6 !important;
        }

        /* Pause Animations */
        .pause-animations * {
          animation-play-state: paused !important;
          transition: none !important;
        }

        /* Reduce Flashing */
        .reduce-flashing .animate-pulse,
        .reduce-flashing .animate-spin,
        .reduce-flashing .animate-ping,
        .reduce-flashing .animate-bounce {
          animation: none !important;
        }
        .reduce-flashing [class*="bg-gradient"] {
          background: #f3f4f6 !important;
        }

        /* Minimize Distractions */
        .minimize-distractions .bg-gradient-to-r,
        .minimize-distractions .bg-gradient-to-br,
        .minimize-distractions .bg-gradient-to-l {
          background: #f3f4f6 !important;
        }
        .minimize-distractions .animate-pulse,
        .minimize-distractions .animate-spin,
        .minimize-distractions .animate-ping,
        .minimize-distractions .animate-bounce {
          animation: none !important;
        }

        /* Enhance Focus */
        .enhance-focus *:focus {
          outline: 4px solid #f97316 !important;
          outline-offset: 4px !important;
          background-color: rgba(249, 115, 22, 0.1) !important;
        }
        .enhance-focus h1, 
        .enhance-focus h2, 
        .enhance-focus h3 {
          border-left: 4px solid #f97316 !important;
          padding-left: 8px !important;
        }
      `}</style>

      {/* Reading Guide Line */}
      {settings.readingGuide && (
        <div 
          className="reading-guide-line" 
          style={{ top: `${readingGuidePosition}px` }}
          aria-hidden="true"
        />
      )}

      {/* Widget Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-large flex items-center justify-center z-50 transition-all duration-300 hover:scale-110"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Explore your accessibility options"
        title="Explore your accessibility options"
      >
        <PersonIcon className="w-6 h-6" />
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
                    <PersonIcon className="w-5 h-5 text-primary-600" />
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
                    aria-selected={activeTab === tab.id}
                    role="tab"
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
                  <a href="mailto:info@awaknow.org" className="text-primary-600 hover:underline">
                    info@awaknow.org
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