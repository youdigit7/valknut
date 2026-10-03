import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { UserProfile, ShippingAddress } from '../types/ecommerce';

export interface AuthResponse {
  success: boolean;
  user?: UserProfile;
  message?: string;
}

const LOCAL_STORAGE_USER_KEY = 'valknut_user';
const LOCAL_STORAGE_SESSION_KEY = 'valknut_auth_session';

/**
 * Maps Supabase User and Profile row into UserProfile interface
 */
function formatUserProfile(supabaseUser: any, profileData?: any): UserProfile {
  const meta = supabaseUser.user_metadata || {};
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: profileData?.full_name || meta.full_name || meta.name || supabaseUser.email?.split('@')[0] || 'VALKNUT Member',
    phone: profileData?.phone || meta.phone || '+94770000000',
    address: profileData?.address || meta.address || undefined,
    isAdmin: Boolean(
      supabaseUser.email?.toLowerCase().includes('admin') || 
      supabaseUser.email?.toLowerCase().includes('valknut') ||
      profileData?.is_admin
    )
  };
}

/**
 * Register a new customer via Supabase Auth (or local simulated fallback)
 */
export async function registerCustomer(
  email: string,
  password: string,
  fullName: string,
  phone: string = '+94770000000'
): Promise<AuthResponse> {
  const trimmedEmail = email.trim().toLowerCase();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            full_name: fullName,
            phone
          }
        }
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (data.user) {
        // Upsert user profile in public.profiles table
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: fullName,
          phone,
          updated_at: new Date().toISOString()
        });

        const profile = formatUserProfile(data.user, { full_name: fullName, phone });
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
        return { success: true, user: profile, message: 'Registration successful.' };
      }
    } catch (err: any) {
      console.warn('Supabase auth error, using fallback:', err);
    }
  }

  // Fallback / Offline registration
  const fallbackUser: UserProfile = {
    id: `u-${Date.now()}`,
    email: trimmedEmail,
    name: fullName,
    phone,
    isAdmin: trimmedEmail.includes('admin') || trimmedEmail.includes('valknut')
  };

  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(fallbackUser));
  localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify({ token: `sim-${Date.now()}`, email: trimmedEmail }));

  return { success: true, user: fallbackUser, message: 'Account created successfully.' };
}

/**
 * Login customer via Supabase Auth (or local fallback)
 */
export async function loginCustomer(email: string, password: string): Promise<AuthResponse> {
  const trimmedEmail = email.trim().toLowerCase();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (data.user) {
        // Fetch profile details
        const { data: profileRow } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const profile = formatUserProfile(data.user, profileRow);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
        return { success: true, user: profile, message: `Welcome back, ${profile.name}` };
      }
    } catch (err: any) {
      console.warn('Supabase signin error, using fallback:', err);
    }
  }

  // Fallback / Offline login
  const fallbackUser: UserProfile = {
    id: `u-${Date.now()}`,
    email: trimmedEmail,
    name: trimmedEmail.split('@')[0].toUpperCase() + ' (VALKNUT VIP)',
    phone: '+94771234567',
    isAdmin: trimmedEmail.includes('admin') || trimmedEmail.includes('valknut')
  };

  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(fallbackUser));
  localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify({ token: `sim-${Date.now()}`, email: trimmedEmail }));

  return { success: true, user: fallbackUser, message: `Signed in as ${fallbackUser.name}` };
}

/**
 * Logout customer session
 */
export async function logoutCustomer(): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase signout error:', err);
    }
  }

  localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
}

/**
 * Send password reset email
 */
export async function requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
  const trimmedEmail = email.trim().toLowerCase();

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo: `${window.location.origin}/#/account/reset-password`
      });

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, message: `Password reset instructions sent to ${trimmedEmail}.` };
    } catch (err: any) {
      console.warn('Password reset error:', err);
    }
  }

  return { 
    success: true, 
    message: `Password reset instructions sent to ${trimmedEmail}. (Simulated in offline mode)` 
  };
}

/**
 * Update Customer Profile & Address
 */
export async function updateCustomerProfile(
  userId: string,
  updates: {
    name?: string;
    phone?: string;
    address?: ShippingAddress;
  }
): Promise<UserProfile | null> {
  let updatedUser: UserProfile | null = null;

  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    const existing: UserProfile = saved ? JSON.parse(saved) : { id: userId, email: '', name: '', phone: '' };

    updatedUser = {
      ...existing,
      name: updates.name || existing.name,
      phone: updates.phone || existing.phone,
      address: updates.address || existing.address
    };

    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updatedUser));

    // Push to Supabase if active
    if (isSupabaseConfigured && supabase && userId) {
      await supabase.from('profiles').upsert({
        id: userId,
        full_name: updatedUser.name,
        phone: updatedUser.phone,
        address: updatedUser.address,
        updated_at: new Date().toISOString()
      });
    }
  } catch (e) {
    console.warn('Error saving profile:', e);
  }

  return updatedUser;
}

/**
 * Listen to auth state changes from Supabase
 */
export function subscribeToAuthChanges(callback: (user: UserProfile | null) => void) {
  if (isSupabaseConfigured && supabase) {
    const client = supabase;
    const { data: authListener } = client.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profileRow } = await client
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        const profile = formatUserProfile(session.user, profileRow);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
        callback(profile);
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
        callback(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }

  return () => {};
}
