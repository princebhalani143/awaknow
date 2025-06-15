import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Brain, 
  Users, 
  Heart, 
  Shield, 
  Sparkles, 
  Play, 
  CheckCircle, 
  Star,
  Zap,
  Globe,
  Award,
  Trophy,
  TrendingUp,
  Target,
  Lightbulb,
  X
} from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { TranslatedText } from '../components/UI/TranslatedText';
import { TopBar } from '../components/Layout/TopBar';
import { Footer } from '../components/Layout/Footer';
import { useNavigate } from 'react-router-dom';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(false);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Conversations',
      description: 'Engage with advanced AI that understands emotions and provides personalized guidance for your wellness journey.',
      color: 'from-primary-500 to-primary-600'
    },
    {
      icon: Users,
      title: 'Conflict Resolution',
      description: 'Resolve conflicts with AI-mediated sessions that create safe spaces for constructive dialogue and understanding.',
      color: 'from-secondary-500 to-secondary-600'
    },
    {
      icon: Heart,
      title: 'Emotional Intelligence',
      description: 'Develop deeper self-awareness and emotional skills through personalized insights and real-time feedback.',
      color: 'from-accent-500 to-accent-600'
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Your conversations are end-to-end encrypted and completely private. We never access your personal data.',
      color: 'from-success-500 to-success-600'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Mental Health Advocate',
      content: 'AwakNow has transformed how I approach emotional wellness. The AI conversations feel genuinely supportive and insightful.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Relationship Counselor',
      content: 'The conflict resolution features are remarkable. My clients have seen significant improvements in their communication skills.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'Emily Watson',
      role: 'Wellness Coach',
      content: 'Finally, a platform that combines cutting-edge AI with genuine emotional intelligence. It\'s a game-changer for personal growth.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Active Users', icon: Users },
    { number: '50,000+', label: 'Sessions Completed', icon: Brain },
    { number: '95%', label: 'User Satisfaction', icon: Star },
    { number: '24/7', label: 'AI Availability', icon: Sparkles }
  ];

  const techPartners = [
    {
      name: 'Bolt',
      description: 'Development platform and hackathon host',
      logo: '/bolt.jpg',
      category: 'Development',
      tier: 'primary'
    },
    {
      name: 'Tavus',
      description: 'AI video generation and conversational AI',
      logo: '/Tavus.png',
      category: 'AI Technology',
      tier: 'primary'
    },
    {
      name: 'ElevenLabs',
      description: 'Advanced voice synthesis and audio AI',
      logo: '/ElevenLabs.png',
      category: 'Voice AI',
      tier: 'primary'
    },
    {
      name: 'Supabase',
      description: 'Backend infrastructure and database',
      logo: '/Supabase.png',
      category: 'Infrastructure',
      tier: 'core'
    },
    {
      name: 'RevenueCat',
      description: 'Subscription management and billing',
      logo: '/revenuecat.png',
      category: 'Payments',
      tier: 'core'
    },
    {
      name: 'Stripe',
      description: 'Payment processing and financial infrastructure',
      logo: '/stripe.jpg',
      category: 'Payments',
      tier: 'core'
    },
    {
      name: 'Netlify',
      description: 'Web hosting and deployment platform',
      logo: '/netlify.png',
      category: 'Hosting',
      tier: 'infrastructure'
    },
    {
      name: 'Entri',
      description: 'Domain management and DNS services',
      logo: '/entri.png',
      category: 'Domain',
      tier: 'infrastructure'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col overflow-hidden">
      <TopBar />
      
      {/* Bolt.new Badge */}
      <div className="fixed top-4 right-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="relative group"
        >
          <a
            href="https://bolt.new/?utm_source=awaknow.org&utm_medium=Bolt.new+badge&utm_campaign=World%E2%80%99s_Largest_Hackathon&utm_term=hackathon&utm_content=winner"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <img
              src="/black_circle_360x360.png"
              alt="Made in Bolt.new - World's Largest Hackathon Winner"
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl rounded-full"
            />
            {/* Winner Badge Overlay */}
            <div className="absolute -top-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
              <Trophy className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6 text-yellow-900" />
            </div>
          </a>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-black text-white text-xs sm:text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
              🏆 Hackathon Winner
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden">
          <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-neutral-800 mb-6 leading-tight">
                <TranslatedText>Transform Your</TranslatedText>
                <br />
                <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
                  <TranslatedText>Emotional Wellness</TranslatedText>
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-neutral-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                <TranslatedText>
                  Experience AI-powered conversations that understand your emotions, provide personalized insights, 
                  and guide you toward meaningful growth and healing.
                </TranslatedText>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button
                  onClick={() => navigate('/auth')}
                  size="lg"
                  className="text-lg px-8 py-4"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  <TranslatedText>Start Your Journey</TranslatedText>
                </Button>
                <Button
                  onClick={() => setShowVideo(true)}
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-4"
                  icon={Play}
                >
                  <TranslatedText>Watch Demo</TranslatedText>
                </Button>
              </div>
            </motion.div>

            {/* Hero Image/Video */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative max-w-4xl mx-auto"
            >
              <div className="aspect-video bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-3xl overflow-hidden shadow-2xl relative">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowVideo(true)}
                    className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl hover:bg-white/30 transition-colors group"
                  >
                    <Play className="w-8 h-8 text-white ml-1 group-hover:text-primary-200" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-20 md:py-24">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-800 mb-6">
                <TranslatedText>Why Choose AwakNow?</TranslatedText>
              </h2>
              <p className="text-lg sm:text-xl text-neutral-600 max-w-3xl mx-auto">
                <TranslatedText>
                  Our platform combines cutting-edge AI technology with proven psychological principles 
                  to deliver personalized emotional wellness experiences.
                </TranslatedText>
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card hover className="h-full p-8">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-neutral-800 mb-3">
                          <TranslatedText>{feature.title}</TranslatedText>
                        </h3>
                        <p className="text-neutral-600 leading-relaxed">
                          <TranslatedText>{feature.description}</TranslatedText>
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-neutral-50 to-primary-50/30">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-800 mb-6">
                <TranslatedText>Trusted by Thousands</TranslatedText>
              </h2>
              <p className="text-lg sm:text-xl text-neutral-600 max-w-3xl mx-auto">
                <TranslatedText>
                  Join a growing community of individuals who have transformed their emotional wellness with AwakNow.
                </TranslatedText>
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <Card className="p-6 hover:shadow-medium transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-neutral-800 mb-2">{stat.number}</div>
                    <div className="text-neutral-600 text-sm">
                      <TranslatedText>{stat.label}</TranslatedText>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Partners Section */}
        <section className="py-16 sm:py-20 md:py-24">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-800 mb-6">
                <TranslatedText>Powered by Industry Leaders</TranslatedText>
              </h2>
              <p className="text-lg sm:text-xl text-neutral-600 max-w-3xl mx-auto">
                <TranslatedText>
                  Built with cutting-edge technology from the world's most trusted platforms and services.
                </TranslatedText>
              </p>
            </motion.div>

            {/* Premium Partner Grid */}
            <div className="space-y-16">
              {/* AI & Core Technology */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="text-center mb-10">
                  <h3 className="text-2xl font-bold text-neutral-800 mb-3">AI & Core Technology</h3>
                  <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto"></div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {techPartners.filter(p => p.tier === 'primary').map((partner, index) => (
                    <motion.div
                      key={partner.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="group"
                    >
                      <Card className="text-center p-8 hover:shadow-2xl transition-all duration-500 group-hover:scale-105 border-0 bg-white/95 backdrop-blur-sm relative overflow-hidden h-full">
                        {/* Premium Background Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-secondary-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <div className="relative z-10">
                          <div className="w-24 h-24 bg-white rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 border border-neutral-100 p-4 group-hover:scale-110">
                            <img
                              src={partner.logo}
                              alt={`${partner.name} logo`}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `<span class="text-2xl font-bold text-neutral-600">${partner.name.charAt(0)}</span>`;
                                }
                              }}
                            />
                          </div>
                          <h4 className="text-xl font-bold text-neutral-800 mb-3 group-hover:text-primary-700 transition-colors duration-300">
                            {partner.name}
                          </h4>
                          <p className="text-neutral-600 mb-4 leading-relaxed">
                            {partner.description}
                          </p>
                          <span className="inline-block px-4 py-2 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 rounded-full text-sm font-medium">
                            {partner.category}
                          </span>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Core Infrastructure */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="text-center mb-10">
                  <h3 className="text-2xl font-bold text-neutral-800 mb-3">Core Infrastructure</h3>
                  <div className="w-24 h-1 bg-gradient-to-r from-secondary-500 to-accent-500 rounded-full mx-auto"></div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {techPartners.filter(p => p.tier === 'core').map((partner, index) => (
                    <motion.div
                      key={partner.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="group"
                    >
                      <Card className="text-center p-6 hover:shadow-xl transition-all duration-500 group-hover:scale-105 border-0 bg-white/90 backdrop-blur-sm h-full">
                        <div className="w-20 h-20 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 border border-neutral-100 p-3 group-hover:scale-110">
                          <img
                            src={partner.logo}
                            alt={`${partner.name} logo`}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<span class="text-lg font-bold text-neutral-600">${partner.name.charAt(0)}</span>`;
                              }
                            }}
                          />
                        </div>
                        <h4 className="text-lg font-semibold text-neutral-800 mb-2 group-hover:text-secondary-700 transition-colors duration-300">
                          {partner.name}
                        </h4>
                        <p className="text-neutral-600 text-sm mb-3 leading-relaxed">
                          {partner.description}
                        </p>
                        <span className="inline-block px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs font-medium">
                          {partner.category}
                        </span>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Infrastructure & Hosting */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="text-center mb-10">
                  <h3 className="text-2xl font-bold text-neutral-800 mb-3">Infrastructure & Hosting</h3>
                  <div className="w-24 h-1 bg-gradient-to-r from-accent-500 to-warning-500 rounded-full mx-auto"></div>
                </div>
                <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  {techPartners.filter(p => p.tier === 'infrastructure').map((partner, index) => (
                    <motion.div
                      key={partner.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="group"
                    >
                      <Card className="text-center p-6 hover:shadow-xl transition-all duration-500 group-hover:scale-105 border-0 bg-white/90 backdrop-blur-sm h-full">
                        <div className="w-18 h-18 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 border border-neutral-100 p-3 group-hover:scale-110">
                          <img
                            src={partner.logo}
                            alt={`${partner.name} logo`}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<span class="text-lg font-bold text-neutral-600">${partner.name.charAt(0)}</span>`;
                              }
                            }}
                          />
                        </div>
                        <h4 className="text-lg font-semibold text-neutral-800 mb-2 group-hover:text-accent-700 transition-colors duration-300">
                          {partner.name}
                        </h4>
                        <p className="text-neutral-600 text-sm mb-3 leading-relaxed">
                          {partner.description}
                        </p>
                        <span className="inline-block px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-xs font-medium">
                          {partner.category}
                        </span>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-primary-50 to-secondary-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-800 mb-6">
                <TranslatedText>What Our Users Say</TranslatedText>
              </h2>
              <p className="text-lg sm:text-xl text-neutral-600 max-w-3xl mx-auto">
                <TranslatedText>
                  Real stories from people who have transformed their emotional wellness with AwakNow.
                </TranslatedText>
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-6 h-full">
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-neutral-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                    <div className="flex items-center space-x-3">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-semibold text-neutral-800">{testimonial.name}</div>
                        <div className="text-sm text-neutral-600">{testimonial.role}</div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white border-0 text-center p-8 md:p-12">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                  <TranslatedText>Ready to Transform Your Life?</TranslatedText>
                </h2>
                <p className="text-lg sm:text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                  <TranslatedText>
                    Join thousands who have already started their journey to better emotional wellness. 
                    Start free today and discover the power of AI-guided personal growth.
                  </TranslatedText>
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => navigate('/auth')}
                    variant="accent"
                    size="lg"
                    className="bg-white text-primary-600 hover:bg-primary-50 text-lg px-8 py-4"
                    icon={ArrowRight}
                    iconPosition="right"
                  >
                    <TranslatedText>Start Free Today</TranslatedText>
                  </Button>
                  <Button
                    onClick={() => navigate('/plans')}
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white/10 text-lg px-8 py-4"
                  >
                    <TranslatedText>View Plans</TranslatedText>
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>
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
              title="AwakNow Platform Demo"
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