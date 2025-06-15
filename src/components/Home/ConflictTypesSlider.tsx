import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Users, User, Building, Globe, Leaf, ArrowRight } from 'lucide-react';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import { useNavigate } from 'react-router-dom';

interface ConflictType {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgImage: string;
  techniques: string[];
}

export const ConflictTypesSlider: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const conflictTypes: ConflictType[] = [
    {
      id: 'internal',
      title: 'Internal Conflict',
      description: 'Personal conflicts within oneself due to competing values, desires, or decisions.',
      icon: User,
      color: 'from-primary-500 to-primary-600',
      bgImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      techniques: [
        'Self-reflection and awareness',
        'Clarifying personal values',
        'Decision-making frameworks',
        'Mindfulness and emotional regulation'
      ]
    },
    {
      id: 'interpersonal',
      title: 'Interpersonal Conflict',
      description: 'Conflicts between individuals due to differences in values, goals, or communication styles.',
      icon: Users,
      color: 'from-secondary-500 to-secondary-600',
      bgImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      techniques: [
        'Open communication between parties',
        'Identify underlying interests',
        'Generate possible solutions',
        'Agree on resolution and follow through'
      ]
    },
    {
      id: 'workplace',
      title: 'Workplace Conflict',
      description: 'Professional conflicts due to competing goals, limited resources, or structural issues.',
      icon: Building,
      color: 'from-accent-500 to-accent-600',
      bgImage: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      techniques: [
        'Clarify roles and responsibilities',
        'Improve communication channels',
        'Establish fair resource allocation',
        'Create resolution procedures'
      ]
    },
    {
      id: 'family',
      title: 'Family Conflict',
      description: 'Conflicts within families over decisions, values, or generational differences.',
      icon: Globe,
      color: 'from-warning-500 to-warning-600',
      bgImage: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      techniques: [
        'Family meetings and discussions',
        'Active listening techniques',
        'Compromise and negotiation',
        'Professional family counseling'
      ]
    },
    {
      id: 'community',
      title: 'Community Conflict',
      description: 'Conflicts over community resources, policies, or neighborhood issues.',
      icon: Leaf,
      color: 'from-success-500 to-success-600',
      bgImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      techniques: [
        'Community dialogue sessions',
        'Stakeholder engagement',
        'Collaborative problem-solving',
        'Mediation and facilitation'
      ]
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % conflictTypes.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [conflictTypes.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % conflictTypes.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + conflictTypes.length) % conflictTypes.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentConflict = conflictTypes[currentSlide];
  const IconComponent = currentConflict.icon;

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-neutral-900 to-neutral-800 text-white border-0">
      <div className="relative h-[400px] md:h-[500px]">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
          style={{
            backgroundImage: `url('${currentConflict.bgImage}')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        
        {/* Content */}
        <div className="relative h-full flex items-center p-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center w-full">
            {/* Left Content */}
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${currentConflict.color} rounded-xl flex items-center justify-center`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <span className="text-accent-400 text-sm font-medium uppercase tracking-wide">
                  Conflict Resolution
                </span>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold leading-tight">
                {currentConflict.title}
              </h3>
              
              <p className="text-neutral-300 text-lg leading-relaxed">
                {currentConflict.description}
              </p>

              <div className="flex space-x-4">
                <Button
                  onClick={() => navigate('/resolve')}
                  variant="accent"
                  size="lg"
                  icon={ArrowRight}
                  iconPosition="right"
                  className="bg-accent-500 hover:bg-accent-600"
                >
                  Start Resolution
                </Button>
                <Button
                  onClick={() => navigate('/blog')}
                  variant="ghost"
                  size="lg"
                  className="text-white border-white/20 hover:bg-white/10"
                >
                  Learn More
                </Button>
              </div>
            </motion.div>

            {/* Right Content - Resolution Techniques */}
            <motion.div
              key={`techniques-${currentSlide}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-black/30 backdrop-blur-sm rounded-2xl p-6"
            >
              <h4 className="text-xl font-semibold mb-4 text-accent-400">
                Resolution Techniques:
              </h4>
              <ul className="space-y-3">
                {currentConflict.techniques.map((technique, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-2 h-2 bg-accent-400 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-neutral-200 text-sm leading-relaxed">{technique}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors z-10"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors z-10"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {conflictTypes.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-accent-400' : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};