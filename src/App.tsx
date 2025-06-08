import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { useAuthStore } from './stores/authStore';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { Home } from './pages/Home';
import { Reflect } from './pages/Reflect';
import { Resolve } from './pages/Resolve';
import { Session } from './pages/Session';

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
        <Route path="/auth" element={<Auth />} />
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
      </Routes>
    </Router>
  );
}

export default App;