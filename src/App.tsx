import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { useAuthStore } from './stores/authStore';
import { Landing } from './pages/Landing';
import { About } from './pages/About';
import { Plans } from './pages/Plans';
import { Auth } from './pages/Auth';
import { Home } from './pages/Home';
import { Reflect } from './pages/Reflect';
import { Resolve } from './pages/Resolve';
import { Session } from './pages/Session';
import { Subscription } from './pages/Subscription';
import { BillingHistory } from './pages/BillingHistory';
import { Analytics } from './pages/Analytics';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsConditions } from './pages/TermsConditions';
import { CookieConsent } from './components/UI/CookieConsent';

function App() {
  const { user, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          phone: session.user.phone,
          language: 'en',
          subscription_tier: 'free',
          created_at: session.user.created_at || new Date().toISOString(),
        });
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            phone: session.user.phone,
            language: 'en',
            subscription_tier: 'free',
            created_at: session.user.created_at || new Date().toISOString(),
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [setUser, setLoading]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/plans" element={<Plans />} />
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
      </Routes>
      <CookieConsent />
    </Router>
  );
}

export default App;