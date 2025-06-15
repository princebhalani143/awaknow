import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Heart, Users, Shield, Target, Zap, ArrowRight, CheckCircle, Star, Award } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { TopBar } from '../components/Layout/TopBar';
import { Footer } from '../components/Layout/Footer';
import { useNavigate } from 'react-router-dom';

export const About: React.FC = () => {
  const navigate = useNavigate();

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
      icon: Target,
      title: 'Personalized Insights',
      description: 'Data-driven insights about your emotional patterns, growth opportunities, and wellness journey.',
    },
  ];

  const features = [
    'Real-time emotion analysis',
    'Personalized AI responses',
    'Conflict mediation tools',
    'Progress tracking',
    'Privacy protection',
    'Multi-language support',
  ];

  const stats = [
    { value: '10,000+', label: 'Users Helped' },
    { value: '95%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'Availability' },
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
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-800 mb-6 leading-tight">
            Transforming Emotional
            <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
              {' '}Wellness
            </span>
          </h1>
          <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            AwakNow combines cutting-edge AI technology with proven psychological principles to create 
            a revolutionary platform for emotional wellness and conflict resolution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/auth')}
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
              className="text-lg px-8 py-4"
            >
              Start Your Journey
            </Button>
            <Button
              onClick={() => navigate('/plans')}
              variant="outline"
              size="lg"
              className="text-lg px-8 py-4"
            >
              View Plans
            </Button>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="text-center p-6">
              <div className="text-3xl font-bold text-primary-600 mb-2">{stat.value}</div>
              <div className="text-sm text-neutral-600">{stat.label}</div>
            </Card>
          ))}
        </motion.div>

        {/* Problem Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">The Problems We're Solving</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Mental health and emotional wellness challenges affect billions of people worldwide
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
                  <div className="w-16 h-16 bg-gradient-to-br from-error-500 to-warning-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                    <problem.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-error-600 mb-2">{problem.stat}</div>
                  <h3 className="text-xl font-semibold text-neutral-800 mb-4">{problem.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{problem.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Solution Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">Our Revolutionary Solution</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              AI-powered emotional wellness that's accessible, private, and effective
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 + index * 0.2 }}
              >
                <Card className="h-full text-center p-8 hover:shadow-medium transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-success-500 to-primary-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                    <solution.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-800 mb-4">{solution.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{solution.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mb-16"
        >
          <Card className="overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Content */}
              <div className="p-8">
                <h2 className="text-3xl font-bold text-neutral-800 mb-6">How AwakNow Works</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <div>
                      <h4 className="font-semibold text-neutral-800 mb-2">Choose Your Session Type</h4>
                      <p className="text-neutral-600">Select between private reflection or guided conflict resolution</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-secondary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <div>
                      <h4 className="font-semibold text-neutral-800 mb-2">Engage with AI</h4>
                      <p className="text-neutral-600">Have natural conversations with our empathetic AI companion</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <div>
                      <h4 className="font-semibold text-neutral-800 mb-2">Receive Insights</h4>
                      <p className="text-neutral-600">Get personalized insights and actionable recommendations</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-success-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <div>
                      <h4 className="font-semibold text-neutral-800 mb-2">Track Progress</h4>
                      <p className="text-neutral-600">Monitor your emotional wellness journey over time</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="font-semibold text-neutral-800 mb-4">Key Features:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-success-500" />
                        <span className="text-sm text-neutral-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Image */}
              <div className="relative">
                <div 
                  className="h-full bg-cover bg-center bg-no-repeat min-h-[400px] lg:min-h-full"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-500/20"></div>
                </div>
              </div>
            </div>
          </Card>
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
                  he founded AwakNow to democratize access to emotional wellness tools.
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

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          <Card className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white border-0 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Emotional Wellness?</h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands who have already started their journey to better emotional health and stronger relationships.
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
                Start Free Today
              </Button>
              <Button
                onClick={() => navigate('/plans')}
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                View Pricing
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};