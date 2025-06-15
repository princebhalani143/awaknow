import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Heart, Users, Shield, Target, Zap, ArrowRight, CheckCircle, Star, Award, Globe, Lightbulb, TrendingUp, Trophy, Rocket } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { TopBar } from '../components/Layout/TopBar';
import { Footer } from '../components/Layout/Footer';
import { useNavigate } from 'react-router-dom';

export const About: React.FC = () => {
  const navigate = useNavigate();

  const missionValues = [
    {
      icon: Heart,
      title: 'Empathy-Driven',
      description: 'We believe technology should understand and respond to human emotions with genuine care and compassion.',
    },
    {
      icon: Shield,
      title: 'Privacy-First',
      description: 'Your emotional data is sacred. We use end-to-end encryption and never access your personal conversations.',
    },
    {
      icon: Globe,
      title: 'Accessible to All',
      description: 'Mental wellness should not be a privilege. We make emotional support available to everyone, everywhere.',
    },
    {
      icon: Lightbulb,
      title: 'Innovation-Focused',
      description: 'We continuously push the boundaries of AI and psychology to create breakthrough wellness solutions.',
    },
  ];

  const journey = [
    {
      year: 'May 2025',
      title: 'The Vision',
      description: 'Prince Bhalani recognized the global mental health crisis and envisioned AI as a solution for accessible emotional wellness.',
      icon: Lightbulb,
      color: 'from-primary-500 to-primary-600'
    },
    {
      year: 'June 2025',
      title: 'Development Begins',
      description: 'Started building AwakNow with a focus on AI-powered emotional intelligence and conflict resolution using cutting-edge technology stack.',
      icon: Rocket,
      color: 'from-secondary-500 to-secondary-600'
    },
    {
      year: 'July 2025',
      title: 'Submitted for Bolt Hackathon',
      description: 'Successfully submitted our innovative AI-powered emotional wellness platform to the world\'s largest hackathon by bolt.new, showcasing our breakthrough approach to mental health technology.',
      icon: Star,
      color: 'from-accent-500 to-accent-600'
    },
    {
      year: 'July 2025',
      title: 'Hackathon Victory',
      description: 'Won the world\'s largest hackathon by bolt.new, validating our innovative approach to AI-powered emotional wellness and securing recognition from the global tech community.',
      icon: Trophy,
      color: 'from-success-500 to-success-600'
    },
    {
      year: 'August 2025',
      title: 'Expansion & Innovation',
      description: 'Leveraging hackathon victory funding to expand our team, enhance AI capabilities, integrate professional-grade APIs, and develop advanced features for deeper emotional intelligence.',
      icon: TrendingUp,
      color: 'from-warning-500 to-warning-600'
    },
    {
      year: 'September 2025',
      title: 'Global Launch',
      description: 'Official worldwide launch with multi-language support, cultural adaptation, partnerships with global wellness organizations, and full-scale deployment of our emotional wellness platform.',
      icon: Globe,
      color: 'from-primary-600 to-secondary-600'
    },
  ];

  const teamValues = [
    'Emotional intelligence as a core life skill',
    'Technology serving human connection, not replacing it',
    'Mental health support should be stigma-free',
    'Data privacy is a fundamental human right',
    'Continuous learning and personal growth',
    'Inclusive design for diverse communities',
  ];

  const achievements = [
    { icon: Trophy, title: 'Hackathon Champion', description: 'Won world\'s largest hackathon by bolt.new in July 2025' },
    { icon: TrendingUp, title: 'Beta Platform', description: 'Successfully launched beta with core AI features' },
    { icon: Shield, title: 'Privacy Certified', description: 'HIPAA-compliant with end-to-end encryption' },
    { icon: Brain, title: 'AI Innovation', description: 'Advanced emotion recognition and response algorithms' },
  ];

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
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-800 mb-6 leading-tight">
            About
            <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
              {' '}AwakNow
            </span>
          </h1>
          <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to democratize emotional wellness through AI-powered technology that understands, 
            supports, and guides human emotional growth with unprecedented privacy and personalization.
          </p>
        </motion.div>

        {/* Mission & Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">Our Mission & Values</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Guided by principles that put human wellbeing and privacy at the center of everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {missionValues.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <Card className="h-full text-center p-6 hover:shadow-medium transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-3">{value.title}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Our Journey */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">Our Journey</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              From vision to reality: building the future of emotional wellness technology
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary-500 to-secondary-500 rounded-full hidden lg:block"></div>
            
            <div className="space-y-8">
              {journey.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                  className={`flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex-col lg:flex-row`}
                >
                  <div className={`w-full lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-8 lg:text-right' : 'lg:pl-8 lg:text-left'} text-center lg:text-left mb-4 lg:mb-0`}>
                    <Card className="p-6 hover:shadow-medium transition-all duration-300">
                      <div className={`flex items-center ${index % 2 === 0 ? 'lg:justify-end' : 'lg:justify-start'} justify-center space-x-3 mb-4`}>
                        <div className={`w-10 h-10 bg-gradient-to-br ${milestone.color} rounded-xl flex items-center justify-center`}>
                          <milestone.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-primary-600 font-bold text-lg">{milestone.year}</div>
                      </div>
                      <h4 className="text-xl font-semibold text-neutral-800 mb-3">{milestone.title}</h4>
                      <p className="text-neutral-600 leading-relaxed">{milestone.description}</p>
                    </Card>
                  </div>
                  
                  {/* Timeline dot - hidden on mobile */}
                  <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full border-4 border-white shadow-lg z-10 hidden lg:block"></div>
                  
                  <div className="w-full lg:w-1/2 hidden lg:block"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">Our Achievements</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Milestones we've reached in our mission to transform emotional wellness
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
              >
                <Card className="text-center p-6 h-full hover:shadow-medium transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-primary-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <achievement.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-neutral-800 mb-2">{achievement.title}</h4>
                  <p className="text-neutral-600 text-sm">{achievement.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Founder Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mb-16"
        >
          <Card className="overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Founder Image */}
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl overflow-hidden">
                  <img
                    src="/prince-bhalani.jpeg"
                    alt="Prince Bhalani, Founder of AwakNow"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex items-center space-x-2 mb-4">
                  <Award className="w-6 h-6 text-accent-500" />
                  <span className="text-accent-600 font-medium">Founder & Visionary</span>
                </div>
                
                <h3 className="text-2xl font-bold text-neutral-800 mb-4">Prince Bhalani</h3>
                
                <p className="text-neutral-600 mb-6 leading-relaxed">
                  Prince Bhalani is a visionary entrepreneur passionate about leveraging technology to solve 
                  real-world problems. With a deep understanding of both technology and human psychology, 
                  he founded AwakNow to democratize access to emotional wellness tools and make mental health 
                  support available to everyone, regardless of location or economic status.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-accent-500" />
                    <span className="text-sm text-neutral-700">Technology & Innovation Expert</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-accent-500" />
                    <span className="text-sm text-neutral-700">Mental Health Advocate</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-accent-500" />
                    <span className="text-sm text-neutral-700">AI & Psychology Researcher</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-success-500" />
                    <span className="text-sm text-neutral-700">Hackathon Champion (bolt.new 2025)</span>
                  </div>
                </div>

                <blockquote className="border-l-4 border-primary-500 pl-4 italic text-neutral-700 mb-6">
                  "Our mission is to make emotional wellness accessible to everyone, everywhere. 
                  Technology should serve humanity's deepest needs - and there's nothing more 
                  fundamental than our emotional well-being."
                </blockquote>

                <Button
                  onClick={() => window.open('https://linkedin.com/in/princebhalani', '_blank')}
                  variant="outline"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Connect on LinkedIn
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* What We Believe */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">What We Believe</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Our core beliefs that drive every decision and feature we build
            </p>
          </div>

          <Card className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {teamValues.map((belief, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.8 + index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                  <span className="text-neutral-700">{belief}</span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Technology Partners - Enhanced with Auto-Scrolling Infinite Slider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.0 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">Our Technology Partners</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Powered by industry-leading technologies and trusted partners who share our vision
            </p>
          </div>

          <Card className="p-8 overflow-hidden">
            {/* Infinite Scrolling Container */}
            <div className="relative">
              {/* Gradient Overlays */}
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10"></div>
              
              {/* Scrolling Content */}
              <div className="flex animate-scroll">
                {/* First Set */}
                <div className="flex space-x-12 min-w-max">
                  {techPartners.map((partner, index) => (
                    <motion.div
                      key={`first-${index}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 2.2 + index * 0.1 }}
                      className="flex-shrink-0 text-center group hover:scale-110 transition-transform duration-300"
                    >
                      <div className="w-24 h-24 bg-white rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300 border border-neutral-100 p-3">
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
                              parent.innerHTML = `<span class="text-2xl font-bold text-neutral-600">${partner.name.charAt(0)}</span>`;
                            }
                          }}
                        />
                      </div>
                      <h4 className="font-semibold text-neutral-800 text-sm mb-1">{partner.name}</h4>
                      <p className="text-xs text-neutral-600 mb-1 leading-tight max-w-[120px] mx-auto">{partner.description}</p>
                      <span className="text-xs text-primary-600 font-medium px-2 py-1 bg-primary-50 rounded-full">
                        {partner.category}
                      </span>
                    </motion.div>
                  ))}
                </div>
                
                {/* Duplicate Set for Seamless Loop */}
                <div className="flex space-x-12 min-w-max ml-12">
                  {techPartners.map((partner, index) => (
                    <div
                      key={`second-${index}`}
                      className="flex-shrink-0 text-center group hover:scale-110 transition-transform duration-300"
                    >
                      <div className="w-24 h-24 bg-white rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300 border border-neutral-100 p-3">
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
                              parent.innerHTML = `<span class="text-2xl font-bold text-neutral-600">${partner.name.charAt(0)}</span>`;
                            }
                          }}
                        />
                      </div>
                      <h4 className="font-semibold text-neutral-800 text-sm mb-1">{partner.name}</h4>
                      <p className="text-xs text-neutral-600 mb-1 leading-tight max-w-[120px] mx-auto">{partner.description}</p>
                      <span className="text-xs text-primary-600 font-medium px-2 py-1 bg-primary-50 rounded-full">
                        {partner.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Partnership Stats */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-primary-600 mb-1">{techPartners.length}</div>
                <div className="text-sm text-neutral-600">Technology Partners</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary-600 mb-1">100%</div>
                <div className="text-sm text-neutral-600">Uptime Guarantee</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent-600 mb-1">24/7</div>
                <div className="text-sm text-neutral-600">AI Availability</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-success-600 mb-1">Enterprise</div>
                <div className="text-sm text-neutral-600">Grade Security</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.4 }}
        >
          <Card className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white border-0 text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Be part of the emotional wellness revolution. Help us build a world where everyone has access 
              to the tools they need for emotional growth and mental well-being.
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
                Start Your Journey
              </Button>
              <Button
                onClick={() => navigate('/plans')}
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                View Plans
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};