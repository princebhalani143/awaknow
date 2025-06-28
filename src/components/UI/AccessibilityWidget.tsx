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

// Accessibility icon - person in a circle with arms outstretched
const AccessibilityIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg 
    viewBox="0 0 122.88 122.88" 
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M61.44,0A61.46,61.46,0,1,1,18,18,61.21,61.21,0,0,1,61.44,0Zm-.39,74.18L52.1,98.91a4.94,4.94,0,0,1-2.58,2.83A5,5,0,0,1,42.7,95.5l6.24-17.28a26.3,26.3,0,0,0,1.17-4,40.64,40.64,0,0,0,.54-4.18c.24-2.53.41-5.27.54-7.9s.22-5.18.29-7.29c.09-2.63-.62-2.8-2.73-3.3l-.44-.1-18-3.39A5,5,0,0,1,27.08,46a5,5,0,0,1,5.05-7.74l19.34,3.63c.77.07,1.52.16,2.31.25a57.64,57.64,0,0,0,7.18.53A81.13,81.13,0,0,0,69.9,42c.9-.1,1.75-.21,2.6-.29l18.25-3.42A5,5,0,0,1,94.5,39a5,5,0,0,1,1.3,7,5,5,0,0,1-3.21,2.09L75.15,51.37c-.58.13-1.1.22-1.56.29-1.82.31-2.72.47-2.61,3.06.08,1.89.31,4.15.61,6.51.35,2.77.81,5.71,1.29,8.4.31,1.77.6,3.19,1,4.55s.79,2.75,1.39,4.42l6.11,16.9a5,5,0,0,1-6.82,6.24,4.94,4.94,0,0,1-2.58-2.83L63,74.23,62,72.4l-1,1.78Zm.39-53.52a8.83,8.83,0,1,1-6.24,2.59,8.79,8.79,0,0,1,6.24-2.59Zm36.35,4.43a51.42,51.42,0,1,0,15,36.35,51.27,51.27,0,0,0-15-36.35Z"/>
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
        <AccessibilityIcon className="w-7 h-7" />
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
                    <AccessibilityIcon className="w-6 h-6 text-primary-600" />
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