import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Users, User, Building, Globe, Leaf } from 'lucide-react';
import { Button } from '../UI/Button';
import { useNavigate } from 'react-router-dom';

interface ConflictType {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgImage: string;
  techniques?: string[];
  stages?: string[];
  approaches?: string[];
  mechanisms?: string[];
  strategies?: string[];
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
        'Seeking guidance or counseling',
        'Mindfulness and emotional regulation'
      ]
    },
    {
      id: 'interpersonal',
      title: 'Interpersonal Conflict',
      description: 'Conflicts between individuals due to differences in values, goals, communication styles, or personalities.',
      icon: Users,
      color: 'from-secondary-500 to-secondary-600',
      bgImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      stages: [
        'Acknowledge the conflict exists',
        'Open communication between parties',
        'Identify underlying interests',
        'Generate possible solutions',
        'Agree on a resolution and follow through'
      ]
    },
    {
      id: 'organizational',
      title: 'Organizational Conflict',
      description: 'Conflicts within organizations due to competing goals, limited resources, or structural issues.',
      icon: Building,
      color: 'from-accent-500 to-accent-600',
      bgImage: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      approaches: [
        'Clarify roles and responsibilities',
        'Improve communication channels',
        'Establish fair resource allocation',
        'Create conflict resolution procedures',
        'Promote collaborative culture'
      ]
    },
    {
      id: 'international',
      title: 'International Conflict',
      description: 'Conflicts between nations over territory, resources, ideology, or power dynamics.',
      icon: Globe,
      color: 'from-warning-500 to-warning-600',
      bgImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      mechanisms: [
        'Diplomatic negotiations',
        'International mediation',
        'Peace treaties and agreements',
        'Economic cooperation',
        'International law and institutions'
      ]
    },
    {
      id: 'environmental',
      title: 'Environmental Conflict',
      description: 'Conflicts over natural resources, land use, pollution, and environmental conservation.',
      icon: Leaf,
      color: 'from-success-500 to-success-600',
      bgImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      strategies: [
        'Sustainable resource management',
        'Stakeholder engagement',
        'Environmental impact assessments',
        'Policy and regulatory frameworks',
        'Community-based solutions'
      ]
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % conflictTypes.length);
    }, 6000); // Auto-advance every 6 seconds

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

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
          Types of Conflicts
        </h2>
        <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
          Explore different conflict types and their resolution stages
        </p>
      </div>

      <div className="relative w-full">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 text-white">
          <div className="relative h-[500px] md:h-[600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url('${conflictTypes[currentSlide].bgImage}')`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
                
                {/* Content */}
                <div className="relative h-full flex items-center">
                  <div className="container mx-auto px-8">
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                      {/* Left Content */}
                      <div className="space-y-6">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 bg-gradient-to-br ${conflictTypes[currentSlide].color} rounded-xl flex items-center justify-center`}>
                            {(() => {
                              const IconComponent = conflictTypes[currentSlide].icon;
                              return <IconComponent className="w-6 h-6 text-white" />;
                            })()}
                          </div>
                          <span className="text-accent-400 text-sm font-medium uppercase tracking-wide">
                            Conflict Resolution
                          </span>
                        </div>
                        
                        <h3 className="text-3xl md:text-4xl font-bold leading-tight">
                          {conflictTypes[currentSlide].title}
                        </h3>
                        
                        <p className="text-neutral-300 text-lg leading-relaxed">
                          {conflictTypes[currentSlide].description}
                        </p>

                        <div className="flex space-x-4">
                          <Button
                            onClick={() => navigate('/resolve')}
                            variant="accent"
                            size="lg"
                            icon={Users}
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
                      </div>

                      {/* Right Content - Resolution Methods */}
                      <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6">
                        <h4 className="text-xl font-semibold mb-4 text-accent-400">
                          {conflictTypes[currentSlide].techniques ? 'Resolution Techniques:' :
                           conflictTypes[currentSlide].stages ? 'Resolution Stages:' :
                           conflictTypes[currentSlide].approaches ? 'Resolution Approaches:' :
                           conflictTypes[currentSlide].mechanisms ? 'Resolution Mechanisms:' :
                           'Resolution Strategies:'}
                        </h4>
                        <ul className="space-y-3">
                          {(conflictTypes[currentSlide].techniques || 
                            conflictTypes[currentSlide].stages || 
                            conflictTypes[currentSlide].approaches || 
                            conflictTypes[currentSlide].mechanisms || 
                            conflictTypes[currentSlide].strategies || []).map((item, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="flex items-start space-x-3"
                            >
                              <div className="w-2 h-2 bg-accent-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-neutral-200 text-sm leading-relaxed">{item}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
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
        </div>
      </div>
    </div>
  );
};