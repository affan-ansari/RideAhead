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
