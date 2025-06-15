import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Clock, Share2, Heart, Bookmark } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { TopBar } from '../components/Layout/TopBar';
import { Footer } from '../components/Layout/Footer';
import { useNavigate, useParams } from 'react-router-dom';

export const BlogPost: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock blog post data - in a real app, this would be fetched based on the ID
  const post = {
    id: 'understanding-emotional-intelligence',
    title: 'Understanding Emotional Intelligence in the Digital Age',
    content: `
      <p>In our increasingly digital world, the ability to understand and manage our emotions has become more crucial than ever. Emotional intelligence (EI) - the capacity to recognize, understand, and manage our own emotions while effectively recognizing and responding to others' emotions - is now recognized as a key predictor of success in both personal and professional relationships.</p>

      <h2>What is Emotional Intelligence?</h2>
      <p>Emotional intelligence consists of four core components:</p>
      <ul>
        <li><strong>Self-awareness:</strong> Understanding your own emotions and their impact</li>
        <li><strong>Self-management:</strong> Effectively managing your emotional responses</li>
        <li><strong>Social awareness:</strong> Recognizing and understanding others' emotions</li>
        <li><strong>Relationship management:</strong> Using emotional information to guide interactions</li>
      </ul>

      <h2>The Role of AI in Developing Emotional Intelligence</h2>
      <p>Artificial intelligence is revolutionizing how we understand and develop emotional intelligence. Through advanced algorithms and machine learning, AI can now:</p>
      <ul>
        <li>Analyze speech patterns, facial expressions, and text to identify emotional states</li>
        <li>Provide real-time feedback on emotional responses</li>
        <li>Offer personalized strategies for emotional regulation</li>
        <li>Track emotional patterns over time to identify growth areas</li>
      </ul>

      <h2>Practical Applications</h2>
      <p>AI-powered emotional intelligence tools are being used in various contexts:</p>
      <ul>
        <li><strong>Personal Development:</strong> Apps that help individuals track and improve their emotional responses</li>
        <li><strong>Workplace Training:</strong> Programs that enhance team communication and leadership skills</li>
        <li><strong>Mental Health:</strong> Therapeutic tools that provide emotional support and guidance</li>
        <li><strong>Education:</strong> Systems that help students develop social-emotional learning skills</li>
      </ul>

      <h2>The Future of Emotional Intelligence</h2>
      <p>As AI technology continues to advance, we can expect even more sophisticated tools for developing emotional intelligence. These may include:</p>
      <ul>
        <li>Virtual reality environments for practicing emotional scenarios</li>
        <li>Biometric monitoring for real-time emotional state assessment</li>
        <li>Personalized AI coaches that adapt to individual learning styles</li>
        <li>Integration with smart devices for continuous emotional wellness monitoring</li>
      </ul>

      <h2>Conclusion</h2>
      <p>The intersection of artificial intelligence and emotional intelligence represents a powerful opportunity to enhance human well-being. By leveraging AI's analytical capabilities with our innate capacity for emotional growth, we can develop more effective strategies for managing emotions, building relationships, and achieving personal fulfillment.</p>

      <p>As we continue to navigate an increasingly complex world, the development of emotional intelligence - supported by AI tools - will be essential for creating more empathetic, understanding, and connected communities.</p>
    `,
    author: 'Dr. Sarah Chen',
    date: '2024-12-15',
    readTime: 8,
    category: 'emotional-wellness',
    tags: ['emotional intelligence', 'AI', 'self-awareness'],
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col">
      <TopBar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl flex-1">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <Button
            onClick={() => navigate('/blog')}
            variant="ghost"
            icon={ArrowLeft}
            className="!p-2"
          />
          <div className="flex items-center space-x-2">
            <Button variant="ghost" icon={Share2} className="!p-2" />
            <Button variant="ghost" icon={Bookmark} className="!p-2" />
            <Button variant="ghost" icon={Heart} className="!p-2" />
          </div>
        </motion.div>

        {/* Article */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="overflow-hidden">
            {/* Hero Image */}
            <div className="aspect-video bg-gradient-to-br from-neutral-100 to-neutral-200 overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-8">
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600 mb-6">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime} min read</span>
                </span>
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium capitalize">
                  {post.category.replace('-', ' ')}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold text-neutral-800 mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Content */}
              <div 
                className="prose prose-lg max-w-none text-neutral-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Author Bio */}
              <div className="mt-12 p-6 bg-neutral-50 rounded-xl">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-800 mb-2">{post.author}</h4>
                    <p className="text-neutral-600 text-sm">
                      Dr. Sarah Chen is a leading researcher in emotional intelligence and AI applications 
                      in mental health. She has published over 50 papers on the intersection of technology 
                      and human psychology.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.article>

        {/* Related Articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <h3 className="text-2xl font-bold text-neutral-800 mb-6">Related Articles</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Card hover className="cursor-pointer" onClick={() => navigate('/blog/ai-powered-conflict-resolution')}>
              <div className="aspect-video bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl mb-4">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="AI Conflict Resolution"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <h4 className="font-semibold text-neutral-800 mb-2">How AI is Revolutionizing Conflict Resolution</h4>
              <p className="text-neutral-600 text-sm">Discover the science behind AI-mediated conversations...</p>
            </Card>

            <Card hover className="cursor-pointer" onClick={() => navigate('/blog/building-stronger-relationships')}>
              <div className="aspect-video bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl mb-4">
                <img
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Building Relationships"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <h4 className="font-semibold text-neutral-800 mb-2">Building Stronger Relationships Through Emotional Awareness</h4>
              <p className="text-neutral-600 text-sm">Learn practical strategies for improving your relationships...</p>
            </Card>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};