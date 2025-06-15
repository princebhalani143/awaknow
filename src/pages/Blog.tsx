import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Search, Tag, Clock, Heart, Brain, Users, Lightbulb } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { Input } from '../components/UI/Input';
import { TopBar } from '../components/Layout/TopBar';
import { Footer } from '../components/Layout/Footer';
import { useNavigate } from 'react-router-dom';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: number;
  category: string;
  tags: string[];
  image: string;
  featured: boolean;
}

export const Blog: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Posts', icon: Tag },
    { id: 'emotional-wellness', name: 'Emotional Wellness', icon: Heart },
    { id: 'ai-insights', name: 'AI & Psychology', icon: Brain },
    { id: 'relationships', name: 'Relationships', icon: Users },
    { id: 'personal-growth', name: 'Personal Growth', icon: Lightbulb },
  ];

  const blogPosts: BlogPost[] = [
    {
      id: 'understanding-emotional-intelligence',
      title: 'Understanding Emotional Intelligence in the Digital Age',
      excerpt: 'Explore how AI can help us better understand and develop our emotional intelligence through personalized insights and real-time feedback.',
      content: 'Full article content would go here...',
      author: 'Dr. Sarah Chen',
      date: '2024-12-15',
      readTime: 8,
      category: 'emotional-wellness',
      tags: ['emotional intelligence', 'AI', 'self-awareness'],
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: true,
    },
    {
      id: 'ai-powered-conflict-resolution',
      title: 'How AI is Revolutionizing Conflict Resolution',
      excerpt: 'Discover the science behind AI-mediated conversations and how technology can help us communicate more effectively during conflicts.',
      content: 'Full article content would go here...',
      author: 'Prince Bhalani',
      date: '2024-12-10',
      readTime: 6,
      category: 'ai-insights',
      tags: ['conflict resolution', 'AI mediation', 'communication'],
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: true,
    },
    {
      id: 'building-stronger-relationships',
      title: 'Building Stronger Relationships Through Emotional Awareness',
      excerpt: 'Learn practical strategies for improving your relationships by developing greater emotional awareness and empathy.',
      content: 'Full article content would go here...',
      author: 'Dr. Michael Rodriguez',
      date: '2024-12-05',
      readTime: 10,
      category: 'relationships',
      tags: ['relationships', 'empathy', 'communication skills'],
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false,
    },
    {
      id: 'mindfulness-in-daily-life',
      title: 'Integrating Mindfulness into Your Daily Routine',
      excerpt: 'Simple, science-backed techniques to bring mindfulness into your everyday life for better emotional regulation and stress management.',
      content: 'Full article content would go here...',
      author: 'Dr. Lisa Thompson',
      date: '2024-12-01',
      readTime: 7,
      category: 'personal-growth',
      tags: ['mindfulness', 'stress management', 'daily habits'],
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false,
    },
    {
      id: 'future-of-mental-health-tech',
      title: 'The Future of Mental Health Technology',
      excerpt: 'Exploring emerging trends in mental health technology and how AI-powered tools are making emotional wellness more accessible.',
      content: 'Full article content would go here...',
      author: 'Dr. James Park',
      date: '2024-11-25',
      readTime: 9,
      category: 'ai-insights',
      tags: ['mental health', 'technology', 'accessibility'],
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false,
    },
    {
      id: 'emotional-regulation-techniques',
      title: '5 Evidence-Based Emotional Regulation Techniques',
      excerpt: 'Master these proven techniques for managing difficult emotions and maintaining emotional balance in challenging situations.',
      content: 'Full article content would go here...',
      author: 'Dr. Emily Watson',
      date: '2024-11-20',
      readTime: 5,
      category: 'emotional-wellness',
      tags: ['emotional regulation', 'coping strategies', 'mental health'],
      image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false,
    },
    {
      id: 'digital-wellness-boundaries',
      title: 'Setting Digital Wellness Boundaries in a Connected World',
      excerpt: 'Learn how to maintain healthy relationships with technology while using digital tools to enhance your emotional well-being.',
      content: 'Full article content would go here...',
      author: 'Dr. Alex Kim',
      date: '2024-11-15',
      readTime: 6,
      category: 'personal-growth',
      tags: ['digital wellness', 'boundaries', 'technology balance'],
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false,
    },
    {
      id: 'workplace-emotional-intelligence',
      title: 'Emotional Intelligence in the Modern Workplace',
      excerpt: 'Discover how developing emotional intelligence can transform your professional relationships and career success.',
      content: 'Full article content would go here...',
      author: 'Dr. Maria Santos',
      date: '2024-11-10',
      readTime: 8,
      category: 'relationships',
      tags: ['workplace', 'professional development', 'leadership'],
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false,
    },
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col">
      <TopBar />
      
      <div className="container mx-auto px-4 py-12 max-w-6xl flex-1">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-800 mb-6 leading-tight">
            Wellness
            <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
              {' '}Insights
            </span>
          </h1>
          <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Expert insights, research-backed strategies, and practical tips for emotional wellness, 
            AI-powered personal growth, and building stronger relationships.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search articles, topics, or tags..."
                  value={searchTerm}
                  onChange={setSearchTerm}
                  icon={Search}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-primary-500 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    <category.icon className="w-4 h-4" />
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-neutral-800 mb-6">Featured Articles</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                >
                  <Card hover className="h-full cursor-pointer group" onClick={() => navigate(`/blog/${post.id}`)}>
                    <div className="aspect-video bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl overflow-hidden mb-4">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-4 text-sm text-neutral-600">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(post.date).toLocaleDateString()}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{post.readTime} min read</span>
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-neutral-800 group-hover:text-primary-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-neutral-600 leading-relaxed">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-neutral-500" />
                          <span className="text-sm text-neutral-600">{post.author}</span>
                        </div>
                        <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
                          Read More
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Regular Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">Latest Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
              >
                <Card hover className="h-full cursor-pointer group" onClick={() => navigate(`/blog/${post.id}`)}>
                  <div className="aspect-video bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl overflow-hidden mb-4">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4 text-sm text-neutral-600">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime} min read</span>
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-800 group-hover:text-primary-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-neutral-600 text-sm leading-relaxed">{post.excerpt}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="w-3 h-3 text-neutral-500" />
                        <span className="text-xs text-neutral-600">{post.author}</span>
                      </div>
                      <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
                        Read
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white border-0 text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated with Wellness Insights</h3>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              Get the latest articles, research findings, and practical tips delivered to your inbox weekly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl text-neutral-800 focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
              <Button
                variant="accent"
                className="bg-white text-primary-600 hover:bg-primary-50"
              >
                Subscribe
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};