import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, ArrowRight, Check, Brain } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { Input } from '../components/UI/Input';
import { TopBar } from '../components/Layout/TopBar';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async () => {
    setLoading(true);
    setError('');

    try {
      if (method === 'email') {
        const { error } = await supabase.auth.signInWithOtp({
          email: contact,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          phone: contact,
        });
        if (error) throw error;
      }
      setStep('verify');
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.verifyOtp({
        [method]: contact,
        token: otp,
        type: method === 'email' ? 'email' : 'sms',
      });
      
      if (error) throw error;
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <TopBar />
      
      <div className="container mx-auto px-4 py-12 max-w-md">
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
                {step === 'input' ? 'Welcome to AwakNow' : 'Verify Your Account'}
              </h1>
              <p className="text-neutral-600">
                {step === 'input' 
                  ? 'Enter your details to get started with your emotional wellness journey'
                  : `We sent a verification code to your ${method}`
                }
              </p>
            </div>

            {step === 'input' ? (
              <div className="space-y-6">
                {/* Method Selection */}
                <div className="flex space-x-2 p-2 bg-neutral-100 rounded-xl">
                  <button
                    onClick={() => setMethod('email')}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-colors ${
                      method === 'email' 
                        ? 'bg-white shadow-soft text-primary-600' 
                        : 'text-neutral-600 hover:text-neutral-800'
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    <span className="font-medium">Email</span>
                  </button>
                  <button
                    onClick={() => setMethod('phone')}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-colors ${
                      method === 'phone' 
                        ? 'bg-white shadow-soft text-primary-600' 
                        : 'text-neutral-600 hover:text-neutral-800'
                    }`}
                  >
                    <Phone className="w-4 h-4" />
                    <span className="font-medium">Phone</span>
                  </button>
                </div>

                <Input
                  type={method}
                  placeholder={method === 'email' ? 'Enter your email' : 'Enter your phone number'}
                  value={contact}
                  onChange={setContact}
                  icon={method === 'email' ? Mail : Phone}
                  error={error}
                />

                <Button
                  onClick={handleSendOTP}
                  loading={loading}
                  disabled={!contact}
                  className="w-full"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Send Verification Code
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="w-16 h-16 bg-success-100 rounded-2xl mx-auto flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-success-600" />
                </div>

                <Input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={setOtp}
                  error={error}
                  className="text-center"
                />

                <Button
                  onClick={handleVerifyOTP}
                  loading={loading}
                  disabled={otp.length !== 6}
                  className="w-full"
                >
                  Verify & Continue
                </Button>

                <button
                  onClick={() => setStep('input')}
                  className="text-sm text-neutral-600 hover:text-neutral-800 transition-colors"
                >
                  Back to {method} entry
                </button>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};