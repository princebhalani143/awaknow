import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, Eye, EyeOff, Brain, Lock, User, Zap, Shield, Key } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { Input } from '../components/UI/Input';
import { TopBar } from '../components/Layout/TopBar';
import { Footer } from '../components/Layout/Footer';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

type AuthMode = 'login' | 'register' | 'forgot-password' | 'verify-email' | 'demo-gate';

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [demoAnswer, setDemoAnswer] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Secret demo access question and answer
  const DEMO_QUESTION = "What is the primary emotion that drives personal growth?";
  const DEMO_ANSWER = "curiosity"; // Keep this secret - only for internal use

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });
      if (error) throw error;
      setMode('verify-email');
      setMessage('Please check your email for verification link');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setMessage('Password reset email sent! Check your inbox.');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = () => {
    if (demoAnswer.toLowerCase().trim() === DEMO_ANSWER.toLowerCase()) {
      handleDemoLogin();
    } else {
      setError('Incorrect answer. Please try again.');
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');

    try {
      // Demo credentials
      const { error } = await supabase.auth.signInWithPassword({
        email: 'demo@awaknow.org',
        password: 'demo123456',
      });
      
      if (error) {
        // If demo user doesn't exist, create it
        const { error: signUpError } = await supabase.auth.signUp({
          email: 'demo@awaknow.org',
          password: 'demo123456',
          options: {
            data: {
              full_name: 'Demo User',
            }
          }
        });
        
        if (signUpError) throw signUpError;
        
        // Try to sign in again
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: 'demo@awaknow.org',
          password: 'demo123456',
        });
        
        if (signInError) throw signInError;
      }
      
      // After successful login, upgrade demo user to Resolve Together plan
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('user_subscriptions')
          .update({
            plan_id: 'awaknow_pro',
            plan_name: 'Resolve Together',
            tavus_minutes_limit: 500,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);
      }
      
      navigate('/home');
    } catch (err: any) {
      setError('Demo login failed. Please try manual login.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setDemoAnswer('');
    setError('');
    setMessage('');
    setShowPassword(false);
  };

  const switchMode = (newMode: AuthMode) => {
    resetForm();
    setMode(newMode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col">
      <TopBar />
      
      <div className="container mx-auto px-4 py-12 max-w-md flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="text-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-neutral-800 mb-2">
                {mode === 'login' && 'Sign In to AwakNow'}
                {mode === 'register' && 'Start Your Wellness Journey'}
                {mode === 'forgot-password' && 'Reset Password'}
                {mode === 'verify-email' && 'Check Your Email'}
                {mode === 'demo-gate' && 'Demo Access'}
              </h1>
              <p className="text-neutral-600">
                {mode === 'login' && 'Access your personalized emotional wellness platform'}
                {mode === 'register' && 'Create your account and begin exploring emotional wellness with AI'}
                {mode === 'forgot-password' && 'Enter your email to receive a password reset link'}
                {mode === 'verify-email' && 'We sent a verification link to your email address'}
                {mode === 'demo-gate' && 'Answer the question below to access the demo account with full Resolve Together features'}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {mode === 'login' && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={setEmail}
                    icon={Mail}
                    error={error}
                  />

                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={setPassword}
                      icon={Lock}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <Button
                    onClick={handleLogin}
                    loading={loading}
                    disabled={!email || !password}
                    className="w-full"
                    icon={ArrowRight}
                    iconPosition="right"
                  >
                    Sign In
                  </Button>

                  <div className="text-center">
                    <button
                      onClick={() => switchMode('forgot-password')}
                      className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="flex items-center space-x-4 text-neutral-400">
                    <div className="flex-1 h-px bg-neutral-200"></div>
                    <span className="text-sm">or</span>
                    <div className="flex-1 h-px bg-neutral-200"></div>
                  </div>

                  <Button
                    onClick={() => switchMode('demo-gate')}
                    loading={loading}
                    variant="secondary"
                    className="w-full"
                    icon={Zap}
                    iconPosition="left"
                  >
                    Try Demo Account (Full Access)
                  </Button>

                  <p className="text-sm text-neutral-600">
                    Don't have an account?{' '}
                    <button
                      onClick={() => switchMode('register')}
                      className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    >
                      Sign up
                    </button>
                  </p>
                </motion.div>
              )}

              {mode === 'demo-gate' && (
                <motion.div
                  key="demo-gate"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-warning-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <Key className="w-8 h-8 text-white" />
                  </div>

                  <div className="p-4 bg-accent-50 rounded-lg border border-accent-200">
                    <h4 className="font-medium text-accent-800 mb-2">Demo Access Question</h4>
                    <p className="text-sm text-accent-700">
                      {DEMO_QUESTION}
                    </p>
                  </div>

                  <div className="p-4 bg-success-50 rounded-lg border border-success-200">
                    <h4 className="font-medium text-success-800 mb-2">Demo Account Features</h4>
                    <ul className="text-sm text-success-700 space-y-1">
                      <li>• Full Resolve Together plan access</li>
                      <li>• 15000 AI video minutes</li>
                      <li>• Unlimited solo sessions</li>
                      <li>• Group conflict resolution</li>
                      <li>• All premium features unlocked</li>
                    </ul>
                  </div>

                  <Input
                    type="text"
                    placeholder="Enter your answer"
                    value={demoAnswer}
                    onChange={setDemoAnswer}
                    icon={Shield}
                    error={error}
                  />

                  <Button
                    onClick={handleDemoAccess}
                    loading={loading}
                    disabled={!demoAnswer.trim()}
                    className="w-full"
                    icon={ArrowRight}
                    iconPosition="right"
                  >
                    Access Demo (Full Features)
                  </Button>

                  <button
                    onClick={() => switchMode('login')}
                    className="text-sm text-neutral-600 hover:text-neutral-800 transition-colors"
                  >
                    Back to sign in
                  </button>
                </motion.div>
              )}

              {mode === 'register' && (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={setName}
                    icon={User}
                    error={error}
                  />

                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={setEmail}
                    icon={Mail}
                  />

                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={password}
                      onChange={setPassword}
                      icon={Lock}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="text-left">
                    <p className="text-xs text-neutral-500 mb-2">Password requirements:</p>
                    <ul className="text-xs text-neutral-500 space-y-1">
                      <li className={`flex items-center space-x-2 ${password.length >= 6 ? 'text-success-600' : ''}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${password.length >= 6 ? 'bg-success-500' : 'bg-neutral-300'}`}></div>
                        <span>At least 6 characters</span>
                      </li>
                    </ul>
                  </div>

                  <Button
                    onClick={handleRegister}
                    loading={loading}
                    disabled={!email || !password || !name.trim()}
                    className="w-full"
                    icon={User}
                    iconPosition="right"
                  >
                    Create Account
                  </Button>

                  <div className="text-xs text-neutral-600 leading-relaxed">
                    By signing up, you agree to our{' '}
                    <button
                      onClick={() => navigate('/privacy-policy')}
                      className="text-primary-600 hover:text-primary-700 underline"
                    >
                      Privacy Policy
                    </button>
                    {' '}and{' '}
                    <button
                      onClick={() => navigate('/terms-conditions')}
                      className="text-primary-600 hover:text-primary-700 underline"
                    >
                      Terms & Conditions
                    </button>
                    .
                  </div>

                  <p className="text-sm text-neutral-600">
                    Already have an account?{' '}
                    <button
                      onClick={() => switchMode('login')}
                      className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    >
                      Sign in
                    </button>
                  </p>
                </motion.div>
              )}

              {mode === 'forgot-password' && (
                <motion.div
                  key="forgot-password"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={setEmail}
                    icon={Mail}
                    error={error}
                  />

                  {message && (
                    <div className="p-3 bg-success-50 rounded-lg text-success-800 text-sm">
                      {message}
                    </div>
                  )}

                  <Button
                    onClick={handleForgotPassword}
                    loading={loading}
                    disabled={!email}
                    className="w-full"
                    icon={Mail}
                    iconPosition="right"
                  >
                    Send Reset Link
                  </Button>

                  <button
                    onClick={() => switchMode('login')}
                    className="text-sm text-neutral-600 hover:text-neutral-800 transition-colors"
                  >
                    Back to sign in
                  </button>
                </motion.div>
              )}

              {mode === 'verify-email' && (
                <motion.div
                  key="verify-email"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-2xl mx-auto flex items-center justify-center mb-4">
                    <Mail className="w-8 h-8 text-primary-600" />
                  </div>

                  {message && (
                    <div className="p-3 bg-primary-50 rounded-lg text-primary-800 text-sm">
                      {message}
                    </div>
                  )}

                  <div className="text-sm text-neutral-600 space-y-2">
                    <p>We sent a verification link to:</p>
                    <p className="font-medium text-neutral-800">{email}</p>
                    <p>Click the link in your email to verify your account and start using AwakNow.</p>
                  </div>

                  <Button
                    onClick={() => switchMode('login')}
                    variant="outline"
                    className="w-full"
                  >
                    Back to Sign In
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};