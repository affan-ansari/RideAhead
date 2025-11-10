import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import {
  checkAuthStatus,
  onAuthStateChange,
  getCurrentUser,
} from '../services/auth';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial auth status
    const initAuth = async () => {
      setLoading(true);
      const isLoggedIn = await checkAuthStatus();
      setIsAuthenticated(isLoggedIn);

      if (isLoggedIn) {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      }

      setLoading(false);
    };

    initAuth();

    // Listen for auth changes
    const subscription = onAuthStateChange((isLoggedIn, authUser) => {
      setIsAuthenticated(isLoggedIn);
      setUser(authUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { isAuthenticated, user, loading };
}
