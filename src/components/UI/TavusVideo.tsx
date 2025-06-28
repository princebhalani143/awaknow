import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, Mic, MicOff, VideoOff, Phone, Settings, User, Brain } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { TavusService } from '../../services/tavusService';

interface TavusVideoProps {
  videoUrl: string;
  sessionId: string;
  onSessionEnd?: () => void;
  className?: string;
}

export const TavusVideo: React.FC<TavusVideoProps> = ({
  videoUrl,
  sessionId,
  onSessionEnd,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [personaInfo, setPersonaInfo] = useState<any>(null);
  const [hasEnded, setHasEnded] = useState(false);
  const [isFallbackMode, setIsFallbackMode] = useState(false);

  useEffect(() => {
    // Determine if we're in fallback mode
    const fallbackDetected = 
      videoUrl.includes('fallback') || 
      videoUrl.includes('.mp4') || 
      videoUrl.includes('.webm');
    
    setIsFallbackMode(fallbackDetected);
    
    // Load persona information
    loadPersonaInfo();
    
    // Simulate connection process
    const timer = setTimeout(() => {
      setIsLoading(false);
      setConnectionStatus('connected');
    }, 3000);

    return () => clearTimeout(timer);
  }, [videoUrl]);

  useEffect(() => {
    const handleUnload = () => {
      // Avoid awaiting here – instead trigger it and forget
      if (sessionId && !hasEnded) {
        console.log('🔄 Page unload - ending session:', sessionId);
        TavusService.endConversation(sessionId);
        TavusService.markSessionCompleted(sessionId);
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasEnded) {
        // Show confirmation dialog
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? Your session will be ended.';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Optional: also call cleanup when component unmounts
      if (!hasEnded) {
        handleUnload();
      }
    };
  }, [sessionId, hasEnded]);

  const loadPersonaInfo = async () => {
    try {
      const info = await TavusService.getPersonaInfo();
      setPersonaInfo(info);
    } catch (error) {
      console.error('Error loading persona info:', error);
    }
  };

  const handleEndCall = async () => {
    if (hasEnded) return;
    
    console.log('🛑 User ending call manually');
    setHasEnded(true);
    setConnectionStatus('disconnected');
    
    // Try to end the conversation via API
    if (sessionId) {
      await TavusService.endConversation(sessionId);
      await TavusService.markSessionCompleted(sessionId);
    }
    
    onSessionEnd?.();
  };

  if (isLoading) {
    return (
      <Card className={`relative overflow-hidden ${className}`}>
        <div className="aspect-video bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mx-auto mb-4 flex items-center justify-center"
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
            <p className="text-neutral-600 font-medium">Connecting to AI Companion...</p>
            <p className="text-sm text-neutral-500 mt-1">
              Persona: {TavusService.personaId}
            </p>
            <div className="flex justify-center space-x-1 mt-3">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  className="w-2 h-2 bg-primary-500 rounded-full"
                />
              ))}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      {/* Video Container */}
      <div className="aspect-video bg-black rounded-xl relative overflow-hidden">
        {isFallbackMode ? (
          // Mock video interface with persona information
          <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center relative">
            {/* Fallback Video Background */}
            {videoUrl.includes('.mp4') || videoUrl.includes('.webm') ? (
              <video
                autoPlay
                loop
                muted
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              >
                <source src={videoUrl} type="video/mp4" />
                <source src="/tavus-fall-back.webm" type="video/webm" />
              </video>
            ) : null}
            
            <div className="text-center text-white relative z-10">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mx-auto mb-6 flex items-center justify-center"
              >
                <Brain className="w-12 h-12" />
              </motion.div>
              <h3 className="text-2xl font-semibold mb-2">AwakNow AI Companion</h3>
              <p className="text-neutral-300 text-sm mb-4">
                {personaInfo?.name || 'Emotional Wellness AI'}
              </p>
              
              {/* Persona Details */}
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 mb-4 max-w-sm mx-auto">
                <div className="text-xs text-neutral-400 space-y-1">
                  <div>Persona ID: {TavusService.personaId}</div>
                  <div>Replica ID: {TavusService.replicaId}</div>
                  <div>Mode: {personaInfo?.status === 'mock' ? 'Demo' : 'Live'}</div>
                  <div>Status: {isFallbackMode ? 'Fallback Video' : 'Live Session'}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                <span className="text-success-400 text-sm">Connected & Ready</span>
              </div>
              
              <p className="text-xs text-neutral-400 mt-3">
                {isFallbackMode ? 'Demo mode - Start speaking to begin your conversation' : 'Start speaking to begin your conversation'}
              </p>
            </div>
          </div>
        ) : (
          // Real Tavus iframe
          <iframe
            src={videoUrl}
            className="w-full h-full"
            allow="camera; microphone; autoplay; display-capture"
            allowFullScreen
            title="Tavus AI Conversation"
          />
        )}

        {/* Connection Status Overlay */}
        {connectionStatus === 'connecting' && (
          <div className="absolute top-4 left-4 bg-warning-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span>Connecting...</span>
          </div>
        )}

        {connectionStatus === 'connected' && (
          <div className="absolute top-4 left-4 bg-success-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span>Connected</span>
          </div>
        )}

        {connectionStatus === 'disconnected' && (
          <div className="absolute top-4 left-4 bg-error-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span>Disconnected</span>
          </div>
        )}

        {/* Persona Info Overlay */}
        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs">
          <div className="flex items-center space-x-2">
            <User className="w-3 h-3" />
            <span>Persona: {TavusService.personaId.slice(-6)}</span>
          </div>
        </div>

        {/* Controls Overlay - Tavus Video Controls */}
        <div className="tavus-video-controls absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-3 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2 rounded-full transition-colors ${
                isMuted ? 'bg-error-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`p-2 rounded-full transition-colors ${
                isVideoOff ? 'bg-error-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
            >
              {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
            </button>

            <button
              onClick={handleEndCall}
              disabled={hasEnded}
              className="p-2 bg-error-500 text-white rounded-full hover:bg-error-600 transition-colors disabled:opacity-50"
              title="End conversation"
            >
              <Phone className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Session Info */}
      <div className="p-4 border-t border-neutral-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              connectionStatus === 'connected' ? 'bg-success-500' : 
              connectionStatus === 'connecting' ? 'bg-warning-500 animate-pulse' : 
              'bg-error-500'
            }`}></div>
            <span className="text-sm text-neutral-600 capitalize">{connectionStatus}</span>
            {isFallbackMode && (
              <span className="text-xs bg-accent-100 text-accent-700 px-2 py-1 rounded-full">
                {videoUrl.includes('.mp4') ? 'Fallback Mode' : 'Demo Mode'}
              </span>
            )}
          </div>
          
          <div className="text-xs text-neutral-500 space-y-1">
            <div>Session: {sessionId.slice(-8)}</div>
            <div>Persona: {TavusService.personaId}</div>
          </div>
        </div>
      </div>
    </Card>
  );
};