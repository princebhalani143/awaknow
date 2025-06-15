import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Brain, Users, ArrowRight, Crown, Zap, Star, Check, Shield, Play, Sparkles, X, ChevronLeft, ChevronRight, AlertTriangle, MessageCircle, Target, TrendingUp } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { TranslatedText } from '../components/UI/TranslatedText';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../components/Layout/TopBar';
import { Footer } from '../components/Layout/Footer';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const conflictSlides = [
    {
      id: 'internal',
      title: 'Internal Conflict',
      subtitle: 'Personal conflicts within oneself due to competing values, desires, or decisions',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
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
      subtitle: 'Conflicts between individuals due to differences in values, goals, communication styles, or personalities',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      techniques: [
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
      subtitle: 'Conflicts within organizations due to competing goals, limited resources, or structural issues',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      techniques: [
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
      subtitle: 'Conflicts between nations over territory, resources, ideology, or power dynamics',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      techniques: [
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
      subtitle: 'Conflicts over natural resources, land use, pollution, and environmental conservation',
      image: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      techniques: [
        'Sustainable resource management',
        'Stakeholder engagement',
        'Environmental impact assessments',
        'Policy and regulatory frameworks',
        'Community-based solutions'
      ]
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % conflictSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + conflictSlides.length) % conflictSlides.length);
  };

  const stats = [
    { value: 'Beta', label: 'Development Stage' },
    { value: '2024', label: 'Launch Year' },
    { value: '24/7', label: 'AI Availability' },
    { value: '100%', label: 'Private & Secure' },
  ];

  // Problems We're Solving Section
  const problems = [
    {
      icon: AlertTriangle,
      stat: '1 in 4 people',
      title: 'Mental Health Crisis',
      description: 'Over 1 billion people worldwide struggle with mental health challenges, with limited access to professional support.',
      color: 'from-error-500 to-error-600'
    },
    {
      icon: MessageCircle,
      stat: '67% of couples',
      title: 'Communication Breakdown',
      description: 'Poor communication and unresolved conflicts damage relationships, families, and workplace productivity.',
      color: 'from-warning-500 to-warning-600'
    },
    {
      icon: Heart,
      stat: '3 in 5 adults',
      title: 'Emotional Isolation',
      description: 'People lack safe spaces to process emotions and develop emotional intelligence skills.',
      color: 'from-secondary-500 to-secondary-600'
    }
  ];

  // How It Works Section
  const steps = [
    {
      number: '1',
      title: 'Choose Your Path',
      description: 'Select private reflection or guided conflict resolution',
      icon: Target,
      color: 'from-primary-500 to-primary-600'
    },
    {
      number: '2',
      title: 'Engage with AI',
      description: 'Have natural conversations with our empathetic AI companion',
      icon: Brain,
      color: 'from-secondary-500 to-secondary-600'
    },
    {
      number: '3',
      title: 'Receive Insights',
      description: 'Get personalized feedback and actionable recommendations',
      icon: Sparkles,
      color: 'from-accent-500 to-accent-600'
    },
    {
      number: '4',
      title: 'Track Progress',
      description: 'Monitor your emotional wellness journey over time',
      icon: TrendingUp,
      color: 'from-success-500 to-success-600'
    }
  ];

  const benefits = [
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Get personalized emotional insights and recommendations tailored to your unique patterns and needs.',
    },
    {
      icon: Shield,
      title: 'Complete Privacy',
      description: 'Your conversations are end-to-end encrypted. We never see your data, and you maintain full control.',
    },
    {
      icon: Heart,
      title: 'Emotional Growth',
      description: 'Track your emotional wellness journey with data-driven insights and measurable progress over time.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col">
      <TopBar />
      
      <div className="flex-1">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-neutral-800 mb-6 leading-tight">
              <TranslatedText>The Future of</TranslatedText>
              <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
                {' '}<TranslatedText>Emotional Wellness</TranslatedText>
              </span>
            </h1>
            <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              <TranslatedText>Experience revolutionary AI-powered conversations that understand your emotions, provide personalized insights, and guide you toward meaningful growth and healing.</TranslatedText>
            </p>

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
          </motion.div>
        </div>

        {/* Problems We're Solving Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-neutral-50 py-16 mb-16"
        >
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-neutral-800 mb-4">
                <TranslatedText>The Problems We're Solving</TranslatedText>
              </h2>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                <TranslatedText>Mental health and emotional wellness challenges affect billions of people worldwide</TranslatedText>
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {problems.map((problem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.2 }}
                >
                  <Card className="h-full text-center p-8 hover:shadow-medium transition-all duration-300">
                    <div className={`w-16 h-16 bg-gradient-to-br ${problem.color} rounded-2xl mx-auto mb-6 flex items-center justify-center`}>
                      <problem.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-neutral-800 mb-2">{problem.stat}</div>
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
          </div>
        </motion.div>

        {/* Full-Width Conflict Types Slider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="w-full bg-neutral-900 text-white py-16 mb-16"
        >
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                <TranslatedText>Types of Conflicts We Help Resolve</TranslatedText>
              </h2>
              <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
                <TranslatedText>Explore different conflict types and their resolution stages with AI-powered guidance</TranslatedText>
              </p>
            </div>

            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="grid lg:grid-cols-2 gap-12 items-center"
                >
                  {/* Content */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-3xl font-bold mb-4">{conflictSlides[currentSlide].title}</h3>
                      <p className="text-lg text-neutral-300 leading-relaxed">
                        {conflictSlides[currentSlide].subtitle}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xl font-semibold mb-4 text-accent-400">Resolution Techniques:</h4>
                      <ul className="space-y-3">
                        {conflictSlides[currentSlide].techniques.map((technique, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="flex items-start space-x-3"
                          >
                            <Check className="w-5 h-5 text-success-400 mt-0.5 flex-shrink-0" />
                            <span className="text-neutral-300">{technique}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      onClick={() => navigate('/auth')}
                      variant="accent"
                      size="lg"
                      icon={ArrowRight}
                      iconPosition="right"
                      className="mt-6"
                    >
                      <TranslatedText>Start Resolving Conflicts</TranslatedText>
                    </Button>
                  </div>

                  {/* Image */}
                  <div className="relative">
                    <div className="aspect-video rounded-2xl overflow-hidden">
                      <img
                        src={conflictSlides[currentSlide].image}
                        alt={conflictSlides[currentSlide].title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={prevSlide}
                  className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="flex space-x-2">
                  {conflictSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentSlide ? 'bg-accent-400' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextSlide}
                  className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* How It Works Section */}
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-neutral-800 mb-4">
                <TranslatedText>How It Works</TranslatedText>
              </h2>
              <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
                <TranslatedText>Simple steps to start your emotional wellness transformation</TranslatedText>
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                  className="relative"
                >
                  {/* Connection Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary-200 to-secondary-200 z-0" />
                  )}
                  
                  <Card className="text-center p-6 relative z-10 h-full hover:shadow-medium transition-all duration-300">
                    <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl mx-auto mb-4 flex items-center justify-center relative`}>
                      <step.icon className="w-8 h-8 text-white" />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-sm font-bold text-neutral-800">{step.number}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-800 mb-3">
                      <TranslatedText>{step.title}</TranslatedText>
                    </h3>
                    <p className="text-neutral-600 text-sm leading-relaxed">
                      <TranslatedText>{step.description}</TranslatedText>
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-neutral-800 mb-4">
                <TranslatedText>Why Choose AwakNow?</TranslatedText>
              </h2>
              <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
                <TranslatedText>Revolutionary technology that makes emotional wellness accessible, private, and effective</TranslatedText>
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.6 + index * 0.2 }}
                >
                  <Card className="h-full text-center p-8 hover:shadow-medium transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-br from-success-500 to-primary-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                      <benefit.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-800 mb-4">
                      <TranslatedText>{benefit.title}</TranslatedText>
                    </h3>
                    <p className="text-neutral-600 leading-relaxed">
                      <TranslatedText>{benefit.description}</TranslatedText>
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Ready to Begin CTA Section */}
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
                <h2 className="text-4xl font-bold mb-4">
                  <TranslatedText>Transform Your Life Today</TranslatedText>
                </h2>
                <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                  <TranslatedText>Join the future of emotional wellness with AI-powered insights, personalized guidance, and breakthrough conflict resolution tools.</TranslatedText>
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
      </div>

      <Footer />
    </div>
  );
};