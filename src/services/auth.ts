import { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

export async function signInWithEmail({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ loggedIn: boolean; message: string }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    // Login failed
    if (error) {
      return { loggedIn: false, message: error.message };
    }

    // Login successful
    if (data?.session && data?.user) {
      return { loggedIn: true, message: 'SUCCESS' };
    }
  } catch (e) {
    // Login failed
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return { loggedIn: false, message: msg };
  }
  return { loggedIn: false, message: 'Unknown' };
}

export async function signUpWithEmail({
  email,
  password,
  displayName,
  phoneNumber,
}: {
  email: string;
  password: string;
  displayName: string;
  phoneNumber: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          display_name: displayName,
          phone_number: phoneNumber,
        },
      },
    });

    // Signup failed
    if (error) {
      return { success: false, message: error.message };
    }

    // Signup successful
    if (data?.user) {
      return {
        success: true,
        message:
          'Account created successfully. Please check your email to verify your account.',
      };
    }
  } catch (e) {
    // Signup failed
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return { success: false, message: msg };
  }
  return { success: false, message: 'Unknown error occurred' };
}

export async function signOut(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Signed out successfully' };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return { success: false, message: msg };
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error('Error getting current user:', error.message);
      return null;
    }

    return user;
  } catch (e) {
    console.error('Error checking auth status:', e);
    return null;
  }
}

export async function checkAuthStatus(): Promise<boolean> {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error('Error checking auth status:', error.message);
      return false;
    }

    return session !== null;
  } catch (e) {
    console.error('Error checking auth status:', e);
    return false;
  }
}

export function onAuthStateChange(
  callback: (isAuthenticated: boolean, user: User | null) => void,
) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    const isAuthenticated = session !== null;
    const user = session?.user ?? null;
    callback(isAuthenticated, user);
  });

  return subscription;
}
