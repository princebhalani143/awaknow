import React, { useState, useEffect } from 'react';
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
  Shield,
  LogOut
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

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser, signOut } = useAuthStore();
  const { subscription } = useSubscriptionStore();
  
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
      } catch (error) {
        console.error('Error in loadUserProfile:', error);
      }
    };
    
    loadUserProfile();
  }, [user, navigate]);
  
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
            <h1 className="text-3xl font-bold text-neutral-800">Your Profile</h1>
            <p className="text-neutral-600">Manage your account and settings</p>
          </div>
          <div className="w-10"></div>
        </motion.div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Profile Card */}
            <Card className="text-center p-6">
              <div className="relative mx-auto mb-4 w-24 h-24">
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
              
              <h3 className="text-lg font-semibold text-neutral-800 mb-1">
                {fullName || 'Your Name'}
              </h3>
              <p className="text-sm text-neutral-500 mb-4">
                {email || 'your.email@example.com'}
              </p>
              
              {subscription && (
                <div className="flex items-center justify-center space-x-2 mb-4">
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
                </div>
              )}
              
              <div className="text-xs text-neutral-500 mb-6">
                Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </div>
              
              {/* Navigation Links */}
              <div className="space-y-2">
                <Button
                  onClick={() => navigate('/subscription')}
                  variant="outline"
                  icon={Crown}
                  className="w-full justify-start"
                >
                  Subscription
                </Button>
                
                <Button
                  onClick={() => navigate('/billing-history')}
                  variant="outline"
                  icon={Receipt}
                  className="w-full justify-start"
                >
                  Billing History
                </Button>
                
                <Button
                  onClick={() => navigate('/analytics')}
                  variant="outline"
                  icon={BarChart3}
                  className="w-full justify-start"
                >
                  Analytics
                </Button>
                
                <Button
                  onClick={() => setShowPasswordChange(true)}
                  variant="outline"
                  icon={Lock}
                  className="w-full justify-start"
                >
                  Change Password
                </Button>
                
                <Button
                  onClick={() => setShowAccountDeletion(true)}
                  variant="outline"
                  icon={Trash2}
                  className="w-full justify-start text-error-600 hover:bg-error-50 hover:border-error-200"
                >
                  Delete Account
                </Button>
                
                <Button
                  onClick={async () => {
                    await signOut();
                    navigate('/');
                  }}
                  variant="outline"
                  icon={LogOut}
                  className="w-full justify-start text-error-600 hover:bg-error-50 hover:border-error-200"
                >
                  Sign Out
                </Button>
              </div>
            </Card>
            
            {/* Privacy Info */}
            <Card className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-success-600" />
                </div>
                <h3 className="font-medium text-neutral-800">Privacy & Security</h3>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Your personal information is protected with end-to-end encryption. We never share your data with third parties.
                Learn more in our <a href="/privacy-policy" className="text-primary-600 hover:underline">Privacy Policy</a>.
              </p>
            </Card>
          </motion.div>
          
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card>
              <h2 className="text-xl font-semibold text-neutral-800 mb-6">Edit Profile</h2>
              
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
      </div>
      
      {/* Password Change Modal */}
      {showPasswordChange && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-primary-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Lock className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">Change Password</h3>
              <p className="text-sm text-neutral-600">
                Enter your new password below
              </p>
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
          </div>
        </div>
      )}

      {/* Account Deletion Modal */}
      {showAccountDeletion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-error-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-error-600" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">Delete Account</h3>
              <p className="text-sm text-neutral-600">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
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
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};