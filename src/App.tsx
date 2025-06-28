import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { useAuthStore } from './stores/authStore';
import { Landing } from './pages/Landing';
import { About } from './pages/About';
import { Plans } from './pages/Plans';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { Auth } from './pages/Auth';
import { Home } from './pages/Home';
import { Reflect } from './pages/Reflect';
import { Resolve } from './pages/Resolve';
import { Session } from './pages/Session';
import { Subscription } from './pages/Subscription';
import { BillingHistory } from './pages/BillingHistory';
import { Analytics } from './pages/Analytics';
import { TavusTest } from './pages/TavusTest';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsConditions } from './pages/TermsConditions';
import { CookieConsent } from './components/UI/CookieConsent';
import { Profile } from './pages/Profile';
import { AccessibilityWidget } from './components/UI/AccessibilityWidget';

function App() {
  const { user, setUser, updateUserProfile, setLoading } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        if (session?.user && mounted) {
          // Get user profile data from public.users table
          const { data: profileData, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            console.error('Error fetching user profile:', profileError);
          }
          
          setUser({
            id: session.user.id,
            email: session.user.email,
            phone: session.user.phone,
            language: profileData?.language || 'en',
            subscription_tier: profileData?.subscription_tier || 'free',
            created_at: session.user.created_at || new Date().toISOString(),
            full_name: profileData?.full_name || '',
            avatar_url: profileData?.avatar_url || '',
          });
        } else if (mounted) {
          setUser(null);
        }
        
        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, session?.user?.id);

        try {
          if (event === 'SIGNED_OUT' || !session?.user) {
            setUser(null);
          } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            if (session?.user) {
              // Get user profile data from public.users table
              const { data: profileData, error: profileError } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single();
                
              if (profileError) {
                console.error('Error fetching user profile:', profileError);
              }
              
              setUser({
                id: session.user.id,
                email: session.user.email,
                phone: session.user.phone,
                language: profileData?.language || 'en',
                subscription_tier: profileData?.subscription_tier || 'free',
                created_at: session.user.created_at || new Date().toISOString(),
                full_name: profileData?.full_name || '',
                avatar_url: profileData?.avatar_url || '',
              });
            }
          } else if (event === 'USER_UPDATED') {
            if (session?.user) {
              // Update just the auth-related fields
              updateUserProfile({
                email: session.user.email,
                phone: session.user.phone,
              });
            }
          }
        } catch (error) {
          console.error('Error handling auth state change:', error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setUser, setLoading, updateUserProfile]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route 
          path="/home" 
          element={user ? <Home /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/reflect" 
          element={user ? <Reflect /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/resolve" 
          element={user ? <Resolve /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/session/:id" 
          element={user ? <Session /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/subscription" 
          element={user ? <Subscription /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/billing-history" 
          element={user ? <BillingHistory /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/analytics" 
          element={user ? <Analytics /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/tavus-test" 
          element={user ? <TavusTest /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/profile" 
          element={user ? <Profile /> : <Navigate to="/auth" />} 
        />
      </Routes>
      <CookieConsent />
      <AccessibilityWidget />
    </Router>
  );
}

export default App;