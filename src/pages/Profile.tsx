import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Save, 
  Camera, 
  Loader, 
  CheckCircle, 
  AlertCircle,
  Globe,
  Lock,
  Trash2,
  Receipt,
  Crown,
  BarChart3,
  LogOut,
  CreditCard,
  Calendar,
  Clock,
  Settings,
  Edit,
  X
} from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { Input } from '../components/UI/Input';
import { TopBar } from '../components/Layout/TopBar';
import { Footer } from '../components/Layout/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import { supportedLanguages } from '../utils/i18n';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { UsageMeter } from '../components/Subscription/UsageMeter';
import { PlanCard } from '../components/Subscription/PlanCard';
import { SUBSCRIPTION_PLANS } from '../config/subscriptionPlans';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser, signOut } = useAuthStore();
  const { subscription, limits, loading: subscriptionLoading, loadSubscription, getCurrentPlan } = useSubscriptionStore();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState('en');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Account deletion state
  const [showAccountDeletion, setShowAccountDeletion] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');

  // Active tab state
  const [activeTab, setActiveTab] = useState<'profile' | 'subscription' | 'billing' | 'analytics'>('profile');
  
  // Refs for scrolling to sections
  const profileRef = useRef<HTMLDivElement>(null);
  const subscriptionRef = useRef<HTMLDivElement>(null);
  const billingRef = useRef<HTMLDivElement>(null);
  const analyticsRef = useRef<HTMLDivElement>(null);

  // Load user data
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    const loadUserProfile = async () => {
      try {
        // Get user data from public.users table
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error loading user profile:', error);
          return;
        }
        
        if (data) {
          setFullName(data.full_name || '');
          setEmail(user.email || '');
          setPhone(user.phone || '');
          setLanguage(data.language || 'en');
          setAvatarUrl(data.avatar_url || '');
        }

        // Load subscription data
        if (user.id) {
          loadSubscription(user.id);
        }
      } catch (error) {
        console.error('Error in loadUserProfile:', error);
      }
    };
    
    loadUserProfile();
  }, [user, navigate, loadSubscription]);

  // Handle tab changes with scrolling
  useEffect(() => {
    const scrollToActiveTab = () => {
      if (activeTab === 'profile' && profileRef.current) {
        profileRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (activeTab === 'subscription' && subscriptionRef.current) {
        subscriptionRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (activeTab === 'billing' && billingRef.current) {
        billingRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (activeTab === 'analytics' && analyticsRef.current) {
        analyticsRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };

    scrollToActiveTab();
  }, [activeTab]);
  
  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Image size must be less than 5MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setErrorMessage('File must be an image');
        return;
      }
      
      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      setErrorMessage('');
    }
  };
  
  // Upload avatar to storage
  const uploadAvatar = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('user-avatars')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data } = supabase.storage
        .from('user-avatars')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return null;
    }
  };
  
  // Save profile changes
  const handleSaveProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    setSaveStatus('idle');
    setErrorMessage('');
    
    try {
      let newAvatarUrl = avatarUrl;
      
      // Upload new avatar if selected
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar(avatarFile);
        if (uploadedUrl) {
          newAvatarUrl = uploadedUrl;
        }
      }
      
      // Update user profile in database
      const { error: updateError } = await supabase
        .from('users')
        .update({
          full_name: fullName,
          language,
          avatar_url: newAvatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (updateError) {
        throw updateError;
      }
      
      // Update auth metadata if email changed
      if (email !== user.email) {
        const { error: authError } = await supabase.auth.updateUser({
          email: email
        });
        
        if (authError) {
          throw authError;
        }
      }
      
      // Update local user state
      setUser({
        ...user,
        email,
        phone,
        language
      });
      
      setSaveStatus('success');
      
      // Reset status after delay
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
      
    } catch (error: any) {
      console.error('Error saving profile:', error);
      setSaveStatus('error');
      setErrorMessage(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle password change
  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordStatus('error');
      setPasswordMessage('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordStatus('error');
      setPasswordMessage('Password must be at least 6 characters');
      return;
    }

    setPasswordLoading(true);
    setPasswordStatus('idle');
    setPasswordMessage('');
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      setPasswordStatus('success');
      setPasswordMessage('Password updated successfully');
      setNewPassword('');
      setConfirmPassword('');
      
      setTimeout(() => {
        setShowPasswordChange(false);
        setPasswordStatus('idle');
        setPasswordMessage('');
      }, 2000);
    } catch (error: any) {
      setPasswordStatus('error');
      setPasswordMessage(error.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle account deletion
  const handleAccountDeletion = async () => {
    if (deleteConfirmation !== 'DELETE') {
      setDeleteMessage('Please type DELETE to confirm');
      return;
    }

    if (!user?.email) {
      setDeleteMessage('Unable to identify user email');
      return;
    }

    setDeleteLoading(true);
    setDeleteMessage('');
    
    try {
      // Add email to blocked list (prevent re-registration for free plans)
      await supabase.from('blocked_emails').insert({
        email: user.email,
        blocked_at: new Date().toISOString(),
        reason: 'user_requested_deletion'
      });

      // Delete user data (RLS policies will handle cascade deletion)
      const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
      
      if (deleteError) {
        // If admin deletion fails, try user deletion
        const { error: userDeleteError } = await supabase.auth.signOut();
        if (userDeleteError) throw userDeleteError;
      }

      // Sign out and redirect
      await signOut();
      navigate('/');
    } catch (error: any) {
      setDeleteMessage(error.message || 'Failed to delete account');
    } finally {
      setDeleteLoading(false);
    }
  };
  
  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    // Strip all non-numeric characters
    const phoneNumber = value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (phoneNumber.length <= 3) {
      return phoneNumber;
    } else if (phoneNumber.length <= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
  };

  // Get current plan
  const currentPlan = getCurrentPlan();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col">
      <TopBar />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl flex-1">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <Button
            onClick={() => navigate('/home')}
            variant="ghost"
            icon={ArrowLeft}
            className="!p-2"
          />
          <div className="text-center">
            <h1 className="text-3xl font-bold text-neutral-800">Account Settings</h1>
            <p className="text-neutral-600">Manage your profile, subscription, and preferences</p>
          </div>
          <div className="w-10"></div>
        </motion.div>

        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                  {avatarPreview || avatarUrl ? (
                    <img 
                      src={avatarPreview || avatarUrl} 
                      alt={fullName || 'User'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-primary-300" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-primary-600 transition-colors">
                  <Camera className="w-4 h-4 text-white" />
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
              
              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-neutral-800">
                  {fullName || 'Welcome!'}
                </h2>
                <p className="text-neutral-600">{email || user?.email}</p>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
                  {subscription && (
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      subscription.plan_id === 'awaknow_free' 
                        ? 'bg-neutral-100 text-neutral-700' 
                        : 'bg-gradient-to-r from-accent-100 to-primary-100 text-primary-700'
                    }`}>
                      {subscription.plan_id !== 'awaknow_free' && (
                        <Crown className="w-3 h-3 inline-block mr-1" />
                      )}
                      {subscription.plan_name} Plan
                    </div>
                  )}
                  
                  <div className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm">
                    Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  onClick={() => setShowPasswordChange(true)}
                  variant="outline"
                  size="sm"
                  icon={Lock}
                >
                  Change Password
                </Button>
                
                <Button
                  onClick={async () => {
                    await signOut();
                    navigate('/');
                  }}
                  variant="outline"
                  size="sm"
                  icon={LogOut}
                  className="text-error-600 hover:bg-error-50 hover:border-error-200"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
        
        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex overflow-x-auto space-x-2 p-1 bg-white rounded-xl shadow-sm border border-neutral-200">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center space-x-2 ${
                activeTab === 'profile' 
                  ? 'bg-primary-500 text-white' 
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>
            
            <button
              onClick={() => setActiveTab('subscription')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center space-x-2 ${
                activeTab === 'subscription' 
                  ? 'bg-secondary-500 text-white' 
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Crown className="w-4 h-4" />
              <span>Subscription</span>
            </button>
            
            <button
              onClick={() => setActiveTab('billing')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center space-x-2 ${
                activeTab === 'billing' 
                  ? 'bg-accent-500 text-white' 
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>Billing</span>
            </button>
            
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center space-x-2 ${
                activeTab === 'analytics' 
                  ? 'bg-success-500 text-white' 
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </button>
          </div>
        </motion.div>
        
        {/* Profile Section */}
        <div ref={profileRef}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12"
          >
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center mr-4">
                <User className="w-5 h-5 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-800">Profile Information</h2>
            </div>
            
            <Card>
              <div className="space-y-6">
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={setFullName}
                  icon={User}
                />
                
                <Input
                  label="Email Address"
                  placeholder="Enter your email"
                  value={email}
                  onChange={setEmail}
                  type="email"
                  icon={Mail}
                />
                
                <Input
                  label="Phone Number (Optional)"
                  placeholder="(123) 456-7890"
                  value={phone}
                  onChange={(value) => setPhone(formatPhoneNumber(value))}
                  type="tel"
                  icon={Phone}
                />
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-700">
                    Preferred Language
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe className="h-5 w-5 text-neutral-400" />
                    </div>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="block w-full rounded-xl border border-neutral-300 pl-10 pr-4 py-3 placeholder-neutral-500 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                    >
                      {supportedLanguages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name} ({lang.nativeName})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {errorMessage && (
                  <div className="p-3 bg-error-50 border border-error-200 rounded-lg flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-error-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-error-700">{errorMessage}</span>
                  </div>
                )}
                
                {saveStatus === 'success' && (
                  <div className="p-3 bg-success-50 border border-success-200 rounded-lg flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-success-700">Profile updated successfully!</span>
                  </div>
                )}
                
                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    loading={loading}
                    icon={loading ? Loader : Save}
                    size="lg"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
        
        {/* Subscription Section */}
        <div ref={subscriptionRef}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center mr-4">
                <Crown className="w-5 h-5 text-secondary-600" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-800">Subscription</h2>
            </div>
            
            {/* Current Subscription Card */}
            {subscription && (
              <Card className="mb-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-neutral-800">{subscription.plan_name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          subscription.status === 'active' 
                            ? 'bg-success-100 text-success-700' 
                            : 'bg-warning-100 text-warning-700'
                        }`}>
                          {subscription.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-neutral-600 mt-1">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>Renews: {new Date(subscription.current_period_end).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            {subscription.plan_id.includes('annual') ? 'Annual' : 'Monthly'} billing
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => navigate('/subscription')}
                    variant="outline"
                    size="sm"
                    icon={Edit}
                  >
                    Manage Plan
                  </Button>
                </div>
              </Card>
            )}
            
            {/* Usage Meter */}
            {subscription && limits && (
                <UsageMeter limits={limits} subscription={subscription} />
            )}
            
            {/* Available Plans */}
            <div className="space-y-4 mb-4">
              <h3 className="text-lg font-semibold text-neutral-800">Available Plans</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    isCurrentPlan={currentPlan?.id === plan.id}
                    isPopular={plan.name === 'reflect_plus'}
                    onSelectPlan={() => navigate('/subscription')}
                    loading={false}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Billing Section */}
        <div ref={billingRef}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-12"
          >
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center mr-4">
                <Receipt className="w-5 h-5 text-accent-600" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-800">Billing & Payment</h2>
            </div>
            
            {/* Payment Methods */}
            <Card className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-neutral-800">Payment Methods</h3>
                <Button variant="outline" size="sm">
                  Add Method
                </Button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-neutral-500" />
                    <div>
                      <div className="font-medium text-neutral-800">
                        Visa ending in 4242
                      </div>
                      <div className="text-sm text-neutral-600">
                        Expires 12/26
                        <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
                          Default
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            </Card>
            
            {/* Billing History */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-neutral-800">Recent Transactions</h3>
                <Button 
                  onClick={() => navigate('/billing-history')}
                  variant="outline" 
                  size="sm"
                >
                  View All
                </Button>
              </div>
              
              {subscription?.plan_id !== 'awaknow_free' ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Receipt className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <div className="font-medium text-neutral-800">
                          {subscription?.plan_name} Subscription
                        </div>
                        <div className="text-sm text-neutral-600">
                          {new Date(subscription?.current_period_start || '').toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-neutral-800">
                        ${subscription?.plan_id === 'awaknow_growth' ? '9.99' : '19.99'}
                      </div>
                      <div className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium text-success-600 bg-success-50">
                        <CheckCircle className="w-3 h-3" />
                        <span>Paid</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-neutral-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Receipt className="w-8 h-8 text-neutral-400" />
                  </div>
                  <h4 className="text-lg font-medium text-neutral-800 mb-2">No Billing History</h4>
                  <p className="text-neutral-600 mb-4">
                    You're currently on the free plan. Upgrade to see billing history.
                  </p>
                  <Button
                    onClick={() => navigate('/subscription')}
                    icon={Crown}
                  >
                    Upgrade Plan
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
        
        {/* Analytics Section */}
        <div ref={analyticsRef}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-success-100 rounded-xl flex items-center justify-center mr-4">
                <BarChart3 className="w-5 h-5 text-success-600" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-800">Analytics & Insights</h2>
            </div>
            
            <Card className="text-center p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-success-500 to-primary-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <BarChart3 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-4">
                View Your Wellness Analytics
              </h3>
              <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                Track your emotional wellness journey, session history, and AI-generated insights in our comprehensive analytics dashboard.
              </p>
              <Button
                onClick={() => navigate('/analytics')}
                size="lg"
                icon={BarChart3}
              >
                View Analytics Dashboard
              </Button>
            </Card>
          </motion.div>
        </div>
        
        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mb-8"
        >
          <Card className="border-error-200 bg-error-50">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-error-100 rounded-xl flex items-center justify-center mr-4">
                <Settings className="w-5 h-5 text-error-600" />
              </div>
              <h2 className="text-xl font-bold text-error-800">Danger Zone</h2>
            </div>
            
            <div className="p-4 bg-white rounded-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-medium text-neutral-800 mb-1">Delete Account</h3>
                  <p className="text-sm text-neutral-600">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>
                <Button
                  onClick={() => setShowAccountDeletion(true)}
                  variant="outline"
                  className="text-error-600 border-error-300 hover:bg-error-50"
                  icon={Trash2}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
      
      {/* Password Change Modal */}
      {showPasswordChange && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Lock className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-800">Change Password</h3>
              </div>
              <button
                onClick={() => {
                  setShowPasswordChange(false);
                  setNewPassword('');
                  setConfirmPassword('');
                  setPasswordMessage('');
                  setPasswordStatus('idle');
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Confirm new password"
                />
              </div>

              {passwordMessage && (
                <div className={`p-3 rounded-lg text-sm ${
                  passwordStatus === 'success' 
                    ? 'bg-success-50 text-success-800' 
                    : 'bg-error-50 text-error-800'
                }`}>
                  {passwordMessage}
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowPasswordChange(false);
                    setNewPassword('');
                    setConfirmPassword('');
                    setPasswordMessage('');
                    setPasswordStatus('idle');
                  }}
                  className="flex-1 px-4 py-2 border border-neutral-300 rounded-xl text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  disabled={passwordLoading || !newPassword || !confirmPassword}
                  className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Account Deletion Modal */}
      {showAccountDeletion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-error-100 rounded-xl flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-error-600" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-800">Delete Account</h3>
              </div>
              <button
                onClick={() => {
                  setShowAccountDeletion(false);
                  setDeleteConfirmation('');
                  setDeleteMessage('');
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-error-50 rounded-lg border border-error-200">
                <h4 className="font-medium text-error-800 mb-2">What will be deleted:</h4>
                <ul className="text-sm text-error-700 space-y-1">
                  <li>• All your sessions and conversations</li>
                  <li>• Personal insights and analytics</li>
                  <li>• Account settings and preferences</li>
                  <li>• Subscription and billing history</li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Type "DELETE" to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-error-500 focus:border-transparent"
                  placeholder="Type DELETE"
                />
              </div>

              {deleteMessage && (
                <div className="p-3 bg-error-50 text-error-800 rounded-lg text-sm">
                  {deleteMessage}
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowAccountDeletion(false);
                    setDeleteConfirmation('');
                    setDeleteMessage('');
                  }}
                  className="flex-1 px-4 py-2 border border-neutral-300 rounded-xl text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAccountDeletion}
                  disabled={deleteLoading || deleteConfirmation !== 'DELETE'}
                  className="flex-1 px-4 py-2 bg-error-500 text-white rounded-xl hover:bg-error-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {deleteLoading ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};