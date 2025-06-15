import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Brain, Users, ArrowRight, Crown, Zap, Star, Check, Shield, Play, Sparkles, X, ChevronLeft, ChevronRight, AlertTriangle, MessageCircle, Target, TrendingUp, Lightbulb, Globe, Award } from 'lucide-react';
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
    { value: 'Beta', label: 'Current Stage' },
    { value: '2025', label: 'Launch Year' },
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
      color: 'from-error-500 to-error-600',
      bgColor: 'bg-error-50'
    },
    {
      icon: MessageCircle,
      stat: '67% of couples',
      title: 'Communication Breakdown',
      description: 'Poor communication and unresolved conflicts damage relationships, families, and workplace productivity.',
      color: 'from-warning-500 to-warning-600',
      bgColor: 'bg-warning-50'
    },
    {
      icon: Heart,
      stat: '3 in 5 adults',
      title: 'Emotional Isolation',
      description: 'People lack safe spaces to process emotions and develop emotional intelligence skills.',
      color: 'from-secondary-500 to-secondary-600',
      bgColor: 'bg-secondary-50'
    }
  ];

  // How It Works Section - Redesigned without numbers
  const steps = [
    {
      title: 'Choose Your Path',
      description: 'Select private reflection or guided conflict resolution based on your current needs',
      icon: Target,
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-50'
    },
    {
      title: 'Engage with AI',
      description: 'Have natural, empathetic conversations with our advanced AI companion that understands context',
      icon: Brain,
      color: 'from-secondary-500 to-secondary-600',
      bgColor: 'bg-secondary-50'
    },
    {
      title: 'Receive Insights',
      description: 'Get personalized feedback, actionable recommendations, and deep emotional analysis',
      icon: Sparkles,
      color: 'from-accent-500 to-accent-600',
      bgColor: 'bg-accent-50'
    },
    {
      title: 'Track Progress',
      description: 'Monitor your emotional wellness journey with detailed analytics and growth metrics',
      icon: TrendingUp,
      color: 'from-success-500 to-success-600',
      bgColor: 'bg-success-50'
    }
  ];

  const benefits = [
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Get personalized emotional insights and recommendations tailored to your unique patterns and needs.',
      color: 'from-primary-500 to-primary-600'
    },
    {
      icon: Shield,
      title: 'Complete Privacy',
      description: 'Your conversations are end-to-end encrypted. We never see your data, and you maintain full control.',
      color: 'from-success-500 to-success-600'
    },
    {
      icon: Heart,
      title: 'Emotional Growth',
      description: 'Track your emotional wellness journey with data-driven insights and measurable progress over time.',
      color: 'from-accent-500 to-accent-600'
    },
  ];

  // Enhanced Technology Partners with proper infinite scroll
  const techPartners = [
    {
      name: 'Bolt',
      description: 'Development platform and hackathon host',
      logo: '/bolt.jpg',
      category: 'Development'
    },
    {
      name: 'Tavus',
      description: 'AI video generation and conversational AI',
      logo: '/Tavus.png',
      category: 'AI Technology'
    },
    {
      name: 'ElevenLabs',
      description: 'Advanced voice synthesis and audio AI',
      logo: '/ElevenLabs.png',
      category: 'Voice AI'
    },
    {
      name: 'Supabase',
      description: 'Backend infrastructure and database',
      logo: '/Supabase.png',
      category: 'Infrastructure'
    },
    {
      name: 'RevenueCat',
      description: 'Subscription management and billing',
      logo: '/revenuecat.png',
      category: 'Payments'
    },
    {
      name: 'Stripe',
      description: 'Payment processing and financial infrastructure',
      logo: '/stripe.jpg',
      category: 'Payments'
    },
    {
      name: 'Netlify',
      description: 'Web hosting and deployment platform',
      logo: '/netlify.png',
      category: 'Hosting'
    },
    {
      name: 'Entri',
      description: 'Domain management and DNS services',
      logo: '/entri.png',
      category: 'Domain'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col overflow-hidden">
      <TopBar />
      
      <div className="flex-1">
        {/* Hero Section - Premium Design with Consistent Fonts */}
        <section className="relative min-h-screen flex items-center justify-center bg-white">
          {/* Bolt.new Hackathon Winner Badge - Fixed Position and Responsive */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute top-24 right-4 md:top-28 md:right-6 lg:top-32 lg:right-8 z-30"
          >
            <a
              href="https://bolt.new/?utm_source=awaknow.org&utm_medium=Bolt.new+badge&utm_campaign=World%E2%80%99s_Largest_Hackathon&utm_term=hackathon&utm_content=winner"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:scale-110 transition-transform duration-300 group"
              aria-label="Winner of World's Largest Hackathon by Bolt.new"
            >
              <div className="relative">
                {/* Badge Image - Responsive Sizing */}
                <img
                  src="/black_circle_360x360.png"
                  alt="Powered by Bolt.new - Winner of World's Largest Hackathon"
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300"
                />
                
                {/* Glow Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
                
                {/* Winner Badge Overlay - Responsive */}
                <div className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 md:-top-2 md:-right-2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-gradient-to-r from-accent-500 to-warning-500 rounded-full flex items-center justify-center shadow-lg">
                  <Award className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-white" />
                </div>
              </div>
              
              {/* Tooltip - Responsive */}
              <div className="absolute top-full right-0 mt-2 px-2 py-1 sm:px-3 sm:py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                🏆 Hackathon Winner
              </div>
            </a>
          </motion.div>

          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-gradient-to-br from-primary-200/30 to-secondary-200/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-gradient-to-br from-accent-200/20 to-primary-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 sm:w-[600px] sm:h-[600px] md:w-[800px] md:h-[800px] bg-gradient-to-br from-secondary-100/10 to-accent-100/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
          </div>

          <div className="container mx-auto px-4 py-12 max-w-6xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-center mb-16"
            >
              {/* Premium Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-flex items-center space-x-2 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full mb-6 sm:mb-8"
              >
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                <span className="text-primary-700 font-medium text-sm sm:text-base">The Future of Emotional Wellness</span>
              </motion.div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-800 mb-6 sm:mb-8 leading-tight px-4">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Transform Your
                </motion.span>
                <br />
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent"
                >
                  Inner World
                </motion.span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-lg sm:text-xl text-neutral-600 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4"
              >
                Experience revolutionary AI-powered conversations that understand your emotions, 
                provide personalized insights, and guide you toward meaningful growth and healing.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 px-4"
              >
                <Button
                  onClick={() => navigate('/auth')}
                  size="lg"
                  icon={ArrowRight}
                  iconPosition="right"
                  className="text-base sm:text-lg px-8 sm:px-12 py-3 sm:py-4 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  Begin Your Journey
                </Button>
                <Button
                  onClick={() => setShowVideo(true)}
                  variant="outline"
                  size="lg"
                  icon={Play}
                  className="text-base sm:text-lg px-8 sm:px-12 py-3 sm:py-4 border-2 hover:bg-white/80 backdrop-blur-sm"
                >
                  Watch Demo
                </Button>
              </motion.div>

              {/* Trust Indicators - Responsive Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-3xl mx-auto px-4"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                    className="text-center group"
                  >
                    <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-neutral-600 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Problems We're Solving Section - Responsive */}
        <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-neutral-50 to-primary-50/30">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-800 mb-4 sm:mb-6 px-4">
                The Crisis We're
                <span className="bg-gradient-to-r from-error-600 to-warning-600 bg-clip-text text-transparent"> Solving</span>
              </h2>
              <p className="text-base sm:text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed px-4">
                Mental health and emotional wellness challenges affect billions of people worldwide, 
                creating an urgent need for accessible, effective solutions.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {problems.map((problem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="group"
                >
                  <Card className="h-full text-center p-6 sm:p-8 hover:shadow-xl transition-all duration-500 group-hover:scale-105 border-0 bg-white/80 backdrop-blur-sm">
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${problem.color} rounded-3xl mx-auto mb-4 sm:mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                      <problem.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-neutral-800 mb-3">{problem.stat}</div>
                    <h3 className="text-lg sm:text-xl font-semibold text-neutral-800 mb-4">
                      {problem.title}
                    </h3>
                    <p className="text-neutral-600 leading-relaxed text-sm sm:text-base">
                      {problem.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Full-Width Conflict Types Slider - Responsive */}
        <section className="w-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white py-16 sm:py-20 md:py-24 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div 
              className="w-full h-full bg-repeat"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}
            />
          </div>

          <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 px-4">
                Conflicts We Help
                <span className="bg-gradient-to-r from-accent-400 to-primary-400 bg-clip-text text-transparent"> Resolve</span>
              </h2>
              <p className="text-base sm:text-lg text-neutral-300 max-w-3xl mx-auto leading-relaxed px-4">
                Explore different conflict types and their resolution stages with AI-powered guidance
              </p>
            </motion.div>

            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center"
                >
                  {/* Content */}
                  <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
                        {conflictSlides[currentSlide].title}
                      </h3>
                      <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
                        {conflictSlides[currentSlide].subtitle}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-accent-400">Resolution Techniques:</h4>
                      <ul className="space-y-3 sm:space-y-4">
                        {conflictSlides[currentSlide].techniques.map((technique, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="flex items-start space-x-3 sm:space-x-4"
                          >
                            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-accent-500 to-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                            </div>
                            <span className="text-neutral-300 text-sm sm:text-base">{technique}</span>
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
                      className="mt-6 sm:mt-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                    >
                      Start Resolving Conflicts
                    </Button>
                  </div>

                  {/* Image */}
                  <div className="relative order-1 lg:order-2">
                    <div className="aspect-video rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                      <img
                        src={conflictSlides[currentSlide].image}
                        alt={conflictSlides[currentSlide].title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Enhanced Navigation - Responsive */}
              <div className="flex items-center justify-between mt-8 sm:mt-12">
                <button
                  onClick={prevSlide}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </button>

                <div className="flex space-x-2 sm:space-x-3">
                  {conflictSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
                        index === currentSlide 
                          ? 'bg-accent-400 scale-125' 
                          : 'bg-white/30 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextSlide}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section - Responsive */}
        <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-white to-secondary-50/30">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-800 mb-4 sm:mb-6 px-4">
                Your Journey to
                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"> Wellness</span>
              </h2>
              <p className="text-base sm:text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed px-4">
                A seamless, intuitive process designed to guide you through emotional transformation
              </p>
            </motion.div>

            {/* Flow Design - Responsive */}
            <div className="relative">
              {/* Connection Lines - Hidden on mobile */}
              <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary-200 via-secondary-200 to-accent-200 rounded-full transform -translate-y-1/2 z-0"></div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="group"
                  >
                    <Card className="text-center p-6 sm:p-8 h-full hover:shadow-xl transition-all duration-500 group-hover:scale-105 border-0 bg-white/90 backdrop-blur-sm relative overflow-hidden">
                      {/* Background Gradient */}
                      <div className={`absolute inset-0 ${step.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                      
                      <div className="relative z-10">
                        <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${step.color} rounded-3xl mx-auto mb-4 sm:mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                          <step.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-neutral-800 mb-3 sm:mb-4 group-hover:text-primary-700 transition-colors duration-300">
                          {step.title}
                        </h3>
                        <p className="text-neutral-600 leading-relaxed text-sm sm:text-base group-hover:text-neutral-700 transition-colors duration-300">
                          {step.description}
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section - Responsive */}
        <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-primary-50/50 to-neutral-100">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-800 mb-4 sm:mb-6 px-4">
                Why Choose
                <span className="bg-gradient-to-r from-success-600 to-primary-600 bg-clip-text text-transparent"> AwakNow?</span>
              </h2>
              <p className="text-base sm:text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed px-4">
                Revolutionary technology that makes emotional wellness accessible, private, and effective
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="group"
                >
                  <Card className="h-full text-center p-6 sm:p-8 hover:shadow-xl transition-all duration-500 group-hover:scale-105 border-0 bg-white/90 backdrop-blur-sm relative overflow-hidden">
                    {/* Animated Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                    
                    <div className="relative z-10">
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${benefit.color} rounded-3xl mx-auto mb-4 sm:mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                        <benefit.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-neutral-800 mb-3 sm:mb-4">
                        {benefit.title}
                      </h3>
                      <p className="text-neutral-600 leading-relaxed text-sm sm:text-base">
                        {benefit.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Partners Section - Enhanced with Premium Design */}
        <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-neutral-50 to-primary-50/30">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-800 mb-4 sm:mb-6 px-4">
                Our Technology
                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"> Partners</span>
              </h2>
              <p className="text-base sm:text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed px-4">
                Powered by industry-leading technologies and trusted partners who share our vision
              </p>
            </motion.div>

            <Card className="p-6 sm:p-8 overflow-hidden bg-white/90 backdrop-blur-sm">
              {/* Infinite Scrolling Container - Enhanced */}
              <div className="relative">
                {/* Gradient Overlays - Responsive */}
                <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 md:w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 md:w-20 bg-gradient-to-l from-white to-transparent z-10"></div>
                
                {/* Scrolling Content - Smooth Infinite Loop */}
                <div className="flex animate-scroll">
                  {/* First Set */}
                  <div className="flex space-x-8 sm:space-x-12 md:space-x-16 min-w-max">
                    {techPartners.map((partner, index) => (
                      <motion.div
                        key={`first-${index}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="flex-shrink-0 text-center group hover:scale-110 transition-transform duration-300"
                      >
                        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-white rounded-2xl sm:rounded-3xl mx-auto mb-3 sm:mb-4 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300 border border-neutral-100 p-3 sm:p-4">
                          <img
                            src={partner.logo}
                            alt={`${partner.name} logo`}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              // Fallback to text if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<span class="text-lg sm:text-xl md:text-2xl font-bold text-neutral-600">${partner.name.charAt(0)}</span>`;
                              }
                            }}
                          />
                        </div>
                        <h4 className="font-semibold text-neutral-800 text-xs sm:text-sm mb-1">{partner.name}</h4>
                        <p className="text-xs text-neutral-600 mb-1 leading-tight max-w-[100px] sm:max-w-[120px] mx-auto">{partner.description}</p>
                        <span className="text-xs text-primary-600 font-medium px-2 py-1 bg-primary-50 rounded-full">
                          {partner.category}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Duplicate Set for Seamless Loop */}
                  <div className="flex space-x-8 sm:space-x-12 md:space-x-16 min-w-max ml-8 sm:ml-12 md:ml-16">
                    {techPartners.map((partner, index) => (
                      <div
                        key={`second-${index}`}
                        className="flex-shrink-0 text-center group hover:scale-110 transition-transform duration-300"
                      >
                        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-white rounded-2xl sm:rounded-3xl mx-auto mb-3 sm:mb-4 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300 border border-neutral-100 p-3 sm:p-4">
                          <img
                            src={partner.logo}
                            alt={`${partner.name} logo`}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              // Fallback to text if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<span class="text-lg sm:text-xl md:text-2xl font-bold text-neutral-600">${partner.name.charAt(0)}</span>`;
                              }
                            }}
                          />
                        </div>
                        <h4 className="font-semibold text-neutral-800 text-xs sm:text-sm mb-1">{partner.name}</h4>
                        <p className="text-xs text-neutral-600 mb-1 leading-tight max-w-[100px] sm:max-w-[120px] mx-auto">{partner.description}</p>
                        <span className="text-xs text-primary-600 font-medium px-2 py-1 bg-primary-50 rounded-full">
                          {partner.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Partnership Stats - Responsive */}
              <div className="mt-8 sm:mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-primary-600 mb-1">{techPartners.length}</div>
                  <div className="text-xs sm:text-sm text-neutral-600">Technology Partners</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-secondary-600 mb-1">100%</div>
                  <div className="text-xs sm:text-sm text-neutral-600">Uptime Guarantee</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-accent-600 mb-1">24/7</div>
                  <div className="text-xs sm:text-sm text-neutral-600">AI Availability</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-success-600 mb-1">Enterprise</div>
                  <div className="text-xs sm:text-sm text-neutral-600">Grade Security</div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Ready to Begin CTA Section - Responsive */}
        <section className="py-16 sm:py-20 md:py-24 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card className="bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 text-white border-0 overflow-hidden relative">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>
                
                <div className="relative z-10 text-center py-12 sm:py-16 px-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4 sm:mb-6"
                  >
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-accent-200" />
                    <span className="text-accent-200 text-base sm:text-lg font-medium uppercase tracking-wide">Ready to Begin?</span>
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-accent-200" />
                  </motion.div>
                  
                  <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6">
                    Transform Your Life
                    <span className="block bg-gradient-to-r from-accent-200 to-white bg-clip-text text-transparent">
                      Starting Today
                    </span>
                  </h2>
                  
                  <p className="text-lg sm:text-xl text-primary-100 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
                    Join the future of emotional wellness with AI-powered insights, personalized guidance, 
                    and breakthrough conflict resolution tools.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                    <Button
                      onClick={() => navigate('/auth')}
                      variant="accent"
                      size="lg"
                      icon={ArrowRight}
                      iconPosition="right"
                      className="bg-white text-primary-600 hover:bg-primary-50 text-base sm:text-lg px-8 sm:px-12 py-3 sm:py-4 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                    >
                      Start Free Today
                    </Button>
                    <Button
                      onClick={() => navigate('/plans')}
                      variant="outline"
                      size="lg"
                      className="border-2 border-white text-white hover:bg-white/10 text-base sm:text-lg px-8 sm:px-12 py-3 sm:py-4 backdrop-blur-sm"
                    >
                      View All Plans
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Trust Message - Responsive */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center mt-8 sm:mt-12"
            >
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 text-neutral-600 px-4">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-success-500 flex-shrink-0" />
                <p className="text-sm sm:text-base text-center sm:text-left">
                  Your data is private, encrypted, and yours alone; even we can't see it. You can cancel anytime, no questions asked.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Video Modal - Enhanced and Responsive */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            onClick={() => setShowVideo(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative w-full max-w-6xl aspect-video bg-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowVideo(false)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 backdrop-blur-sm"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              
              {/* Embedded Video */}
              <iframe
                src="https://www.youtube.com/embed/ZcdwGRnV1Fs?autoplay=1&rel=0&modestbranding=1"
                title="AwakNow Demo - Transform Your Emotional Wellness"
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};