import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Brain, Users, ArrowRight, Crown, Zap, Star, Check, Shield, Play, Sparkles, X } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { TranslatedText } from '../components/UI/TranslatedText';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../components/Layout/TopBar';
import { Footer } from '../components/Layout/Footer';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(false);

  const problems = [
    {
      icon: Brain,
      title: 'Mental Health Crisis',
      description: 'Over 1 billion people worldwide suffer from mental health disorders, with limited access to professional help.',
      stat: '1 in 4 people',
    },
    {
      icon: Users,
      title: 'Relationship Conflicts',
      description: 'Poor communication and unresolved conflicts destroy relationships, families, and workplace productivity.',
      stat: '67% of couples',
    },
    {
      icon: Heart,
      title: 'Emotional Isolation',
      description: 'People struggle with emotional awareness and lack safe spaces to process their feelings.',
      stat: '3 in 5 adults',
    },
  ];

  const solutions = [
    {
      icon: Zap,
      title: 'AI-Powered Conversations',
      description: 'Advanced AI that understands emotions, provides empathetic responses, and guides meaningful conversations.',
    },
    {
      icon: Shield,
      title: 'Safe & Private Environment',
      description: 'End-to-end encrypted sessions where you can explore emotions without judgment or privacy concerns.',
    },
    {
      icon: Brain,
      title: 'Personalized Insights',
      description: 'Data-driven insights about your emotional patterns, growth opportunities, and wellness journey.',
    },
  ];

  const howItWorks = [
    { step: '1', title: 'Choose Your Path', description: 'Select private reflection or guided conflict resolution' },
    { step: '2', title: 'Engage with AI', description: 'Have natural conversations with our empathetic AI companion' },
    { step: '3', title: 'Receive Insights', description: 'Get personalized feedback and actionable recommendations' },
    { step: '4', title: 'Track Progress', description: 'Monitor your emotional wellness journey over time' },
  ];

  const stats = [
    { value: '10,000+', label: 'Users Helped' },
    { value: '95%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'AI Availability' },
    { value: '100%', label: 'Private & Secure' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col">
      <TopBar />
      
      <div className="container mx-auto px-4 py-12 max-w-6xl flex-1">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-neutral-800 mb-6 leading-tight">
              <TranslatedText>Transform Your</TranslatedText>
              <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
                {' '}<TranslatedText>Emotional Wellness</TranslatedText>
              </span>
            </h1>
            <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              <TranslatedText>Experience the future of emotional wellness with AI-powered conversations, personalized insights, and conflict resolution tools designed to help you thrive.</TranslatedText>
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                onClick={() => navigate('/auth')}
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                className="text-lg px-12 py-4"
              >
                <TranslatedText>Start Your Journey</TranslatedText>
              </Button>
              <Button
                onClick={() => navigate('/about')}
                variant="outline"
                size="lg"
                className="text-lg px-12 py-4"
              >
                <TranslatedText>Learn More</TranslatedText>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{stat.value}</div>
                  <div className="text-sm text-neutral-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Hero Video/Demo */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative mx-auto max-w-4xl"
          >
            <Card className="overflow-hidden bg-gradient-to-br from-neutral-900 to-neutral-800 border-0">
              <div className="aspect-video relative">
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`
                  }}
                />
                
                {/* Overlay Content */}
                <div className="relative h-full flex items-center justify-center bg-gradient-to-br from-primary-500/20 to-secondary-500/20">
                  <div className="text-center space-y-6">
                    {/* Play Button - Properly centered */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowVideo(true)}
                      className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-large hover:bg-white/30 transition-colors group"
                    >
                      <Play className="w-8 h-8 text-white ml-1 group-hover:text-accent-200" />
                    </motion.button>
                    
                    <div className="space-y-2">
                      <h3 className="text-2xl font-semibold text-white">
                        <TranslatedText>See AwakNow in Action</TranslatedText>
                      </h3>
                      <p className="text-white/80 max-w-md mx-auto">
                        <TranslatedText>Watch how AI-powered conversations can transform your emotional wellness journey</TranslatedText>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                  2:34
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* Problem Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">
              <TranslatedText>The Global Challenge</TranslatedText>
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              <TranslatedText>Millions struggle with emotional wellness challenges that affect every aspect of life</TranslatedText>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {problems.map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
              >
                <Card className="h-full text-center p-8 hover:shadow-medium transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-error-500 to-warning-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                    <problem.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-error-600 mb-2">{problem.stat}</div>
                  <h3 className="text-xl font-semibold text-neutral-800 mb-4">
                    <TranslatedText>{problem.title}</TranslatedText>
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    <TranslatedText>{problem.description}</TranslatedText>
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Solution Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">
              <TranslatedText>Our AI-Powered Solution</TranslatedText>
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              <TranslatedText>Revolutionary technology that makes emotional wellness accessible, private, and effective</TranslatedText>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
              >
                <Card className="h-full text-center p-8 hover:shadow-medium transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-success-500 to-primary-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                    <solution.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-800 mb-4">
                    <TranslatedText>{solution.title}</TranslatedText>
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    <TranslatedText>{solution.description}</TranslatedText>
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">
              <TranslatedText>Simple Steps to Wellness</TranslatedText>
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              <TranslatedText>Get started in minutes and begin your transformation journey today</TranslatedText>
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {howItWorks.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.6 + index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 text-white rounded-full mx-auto mb-4 flex items-center justify-center text-lg font-bold">
                  {item.step}
                </div>
                <h4 className="font-semibold text-neutral-800 mb-2">
                  <TranslatedText>{item.title}</TranslatedText>
                </h4>
                <p className="text-neutral-600 text-sm">
                  <TranslatedText>{item.description}</TranslatedText>
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white border-0 overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div 
                className="w-full h-full bg-repeat"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
              />
            </div>
            
            <div className="relative">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Sparkles className="w-6 h-6 text-accent-200" />
                <span className="text-accent-200 text-sm font-medium uppercase tracking-wide">Ready to Begin?</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">
                <TranslatedText>Transform Your Life Today</TranslatedText>
              </h2>
              <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                <TranslatedText>Join thousands who have already started their journey to better emotional health and stronger relationships.</TranslatedText>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('/auth')}
                  variant="accent"
                  size="lg"
                  icon={ArrowRight}
                  iconPosition="right"
                  className="bg-white text-primary-600 hover:bg-primary-50"
                >
                  <TranslatedText>Start Free Today</TranslatedText>
                </Button>
                <Button
                  onClick={() => navigate('/plans')}
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  <TranslatedText>View All Plans</TranslatedText>
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Trust Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.0 }}
          className="text-center mt-8"
        >
          <div className="flex items-center justify-center space-x-2 text-neutral-600">
            <Shield className="w-5 h-5 text-success-500" />
            <p className="text-sm">
              <TranslatedText>Your data is private, encrypted, and yours alone; even we can't see it. You can cancel anytime, no questions asked.</TranslatedText>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowVideo(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Embedded Video */}
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1"
              title="AwakNow Demo Video"
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </div>
  );
};