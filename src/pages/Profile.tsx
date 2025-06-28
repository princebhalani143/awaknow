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
  Globe
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

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  
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
      
      <div className="container mx-auto px-4 py-8 max-w-4xl flex-1">
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
            <p className="text-neutral-600">Manage your personal information</p>
          </div>
          <div className="w-10"></div>
        </motion.div>
        
        {/* Profile Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Avatar Section */}
              <div className="md:col-span-1">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                      {avatarPreview || avatarUrl ? (
                        <img 
                          src={avatarPreview || avatarUrl} 
                          alt={fullName || 'User'} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-16 h-16 text-primary-300" />
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
                  
                  <div className="w-full p-4 bg-primary-50 rounded-xl">
                    <h4 className="font-medium text-primary-800 mb-2 text-sm">Profile Visibility</h4>
                    <p className="text-xs text-primary-600 mb-3">
                      Your profile information is private and only visible to you. We never share your personal data with third parties.
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-600">Member since:</span>
                      <span className="font-medium text-neutral-800">
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Form Fields */}
              <div className="md:col-span-2 space-y-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">Personal Information</h3>
                
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
            </div>
          </Card>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};