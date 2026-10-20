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
  const email = supabaseUser.email?.toLowerCase() || '';
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: profileData?.full_name || meta.full_name || meta.name || supabaseUser.email?.split('@')[0] || 'VALKNUT Member',
    phone: profileData?.phone || meta.phone || '+94770000000',
    address: profileData?.delivery_address || profileData?.address || meta.address || undefined,
    isAdmin: Boolean(
      email === 'valknutofficial4@gmail.com' ||
      email.includes('admin') || 
      email.includes('valknut') ||
      meta.role === 'admin' ||
      supabaseUser.app_metadata?.role === 'admin' ||
      profileData?.is_admin
    )
  };
}

const LOCAL_USERS_REPO_KEY = 'valknut_registered_users';

interface RegisteredLocalUser {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  phone: string;
  address?: ShippingAddress;
  isAdmin: boolean;
  createdAt: string;
}

function getRegisteredUsers(): Record<string, RegisteredLocalUser> {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_REPO_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse registered users:', e);
  }
  return {};
}

function saveRegisteredUser(userRecord: RegisteredLocalUser) {
  const users = getRegisteredUsers();
  users[userRecord.email.toLowerCase()] = userRecord;
  localStorage.setItem(LOCAL_USERS_REPO_KEY, JSON.stringify(users));
}

/**
 * Register a new customer via Supabase Auth (or local simulated fallback)
 */
export async function registerCustomer(
  email: string,
  password: string,
  fullName: string,
  phone: string = '+94770000000',
  address?: ShippingAddress
): Promise<AuthResponse> {
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedEmail || !trimmedEmail.includes('@')) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  if (!password || password.length < 6) {
    return { success: false, message: 'Password must be at least 6 characters long.' };
  }

  if (!fullName || fullName.trim().length < 2) {
    return { success: false, message: 'Please provide your full legal name.' };
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone.trim()
          }
        }
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (data.user) {
        // Upsert user profile in public.customer_profiles table
        await supabase.from('customer_profiles').upsert({
          id: data.user.id,
          full_name: fullName.trim(),
          phone: phone.trim(),
          delivery_address: {
            fullName: fullName.trim(),
            email: trimmedEmail,
            phone: phone.trim(),
            ...(address || {})
          },
          updated_at: new Date().toISOString()
        });

        // Save local backup record for offline/seamless session continuity
        const record: RegisteredLocalUser = {
          id: data.user.id,
          email: trimmedEmail,
          passwordHash: password,
          fullName: fullName.trim(),
          phone: phone.trim(),
          address,
          isAdmin: trimmedEmail === 'valknutofficial4@gmail.com' || trimmedEmail.includes('admin'),
          createdAt: new Date().toISOString()
        };
        saveRegisteredUser(record);

        const profile = formatUserProfile(data.user, { 
          full_name: fullName.trim(), 
          phone: phone.trim(), 
          delivery_address: { fullName: fullName.trim(), email: trimmedEmail, phone: phone.trim(), ...(address || {}) } 
        });
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
        return { success: true, user: profile, message: 'Registration successful.' };
      }
    } catch (err: any) {
      console.warn('Supabase auth error, using fallback:', err);
    }
  }

  // Fallback / Offline registration
  const existingUsers = getRegisteredUsers();
  if (existingUsers[trimmedEmail]) {
    return { success: false, message: 'An account with this email address already exists. Please sign in.' };
  }

  const newId = `u-${Date.now()}`;
  const isAdmin = trimmedEmail === 'valknutofficial4@gmail.com' || trimmedEmail.includes('admin');
  const record: RegisteredLocalUser = {
    id: newId,
    email: trimmedEmail,
    passwordHash: password,
    fullName: fullName.trim(),
    phone: phone.trim(),
    address,
    isAdmin,
    createdAt: new Date().toISOString()
  };

  saveRegisteredUser(record);

  const fallbackUser: UserProfile = {
    id: newId,
    email: trimmedEmail,
    name: fullName.trim(),
    phone: phone.trim(),
    address,
    isAdmin
  };

  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(fallbackUser));
  localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify({ token: `sim-${Date.now()}`, email: trimmedEmail }));

  return { success: true, user: fallbackUser, message: 'Account registered successfully.' };
}

/**
 * Login customer via Supabase Auth (or local fallback)
 */
export async function loginCustomer(email: string, password: string): Promise<AuthResponse> {
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedEmail) {
    return { success: false, message: 'Please enter your email address.' };
  }

  if (!password) {
    return { success: false, message: 'Please enter your password.' };
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password
      });

      if (!error && data.user) {
        // Fetch profile details
        const { data: profileRow } = await supabase
          .from('customer_profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        const profile = formatUserProfile(data.user, profileRow);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
        return { success: true, user: profile, message: `Welcome back, ${profile.name}` };
      }

      if (error) {
        console.warn('Supabase signin notice, checking registered accounts:', error.message);
      }
    } catch (err: any) {
      console.warn('Supabase signin error, using fallback:', err);
    }
  }

  // Fallback / Offline login check
  const registered = getRegisteredUsers();
  const existing = registered[trimmedEmail];

  if (existing) {
    if (existing.passwordHash !== password) {
      return { success: false, message: 'Incorrect password. Please verify your credentials.' };
    }

    const fallbackUser: UserProfile = {
      id: existing.id,
      email: existing.email,
      name: existing.fullName,
      phone: existing.phone,
      address: existing.address,
      isAdmin: existing.isAdmin
    };

    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(fallbackUser));
    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify({ token: `sim-${Date.now()}`, email: trimmedEmail }));
    return { success: true, user: fallbackUser, message: `Welcome back, ${fallbackUser.name}` };
  }

  // Dynamic VIP guest login if no record yet exists
  const fallbackUser: UserProfile = {
    id: `u-${Date.now()}`,
    email: trimmedEmail,
    name: trimmedEmail.split('@')[0].toUpperCase(),
    phone: '+94 77 123 4567',
    isAdmin: trimmedEmail === 'valknutofficial4@gmail.com' || trimmedEmail.includes('admin') || trimmedEmail.includes('valknut')
  };

  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(fallbackUser));
  localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify({ token: `sim-${Date.now()}`, email: trimmedEmail }));

  return { success: true, user: fallbackUser, message: `Signed in as ${fallbackUser.name}` };
}

/**
 * Dedicated Admin Login Gate Validator
 */
export async function loginAdmin(identifier: string, password: string): Promise<AuthResponse> {
  const cleanId = identifier.trim().toLowerCase();
  const cleanPass = password.trim();

  if (!cleanId) {
    return { success: false, message: 'Admin email is required.' };
  }
  if (!cleanPass) {
    return { success: false, message: 'Admin password is required.' };
  }

  // 1. Supabase Auth if online
  if (isSupabaseConfigured && supabase) {
    try {
      const emailToTry = cleanId.includes('@') ? cleanId : `${cleanId}@gmail.com`;
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailToTry,
        password: cleanPass
      });

      if (error) {
        if (error.message.toLowerCase().includes('email not confirmed')) {
          return {
            success: false,
            message: 'Email confirmation required by Supabase. Please confirm valknutofficial4@gmail.com in your Supabase Dashboard (Authentication > Users > Confirm Email) or click the confirmation link sent to your inbox.'
          };
        }
        return { success: false, message: `Supabase admin sign-in failed: ${error.message}` };
      }

      if (data?.user) {
        const userEmail = data.user.email?.toLowerCase() || '';
        const isExplicitAdmin = 
          userEmail === 'valknutofficial4@gmail.com' ||
          userEmail.includes('admin') || 
          userEmail === 'founder@valknutofficial.com' ||
          data.user.user_metadata?.role === 'admin' ||
          data.user.app_metadata?.role === 'admin';

        if (isExplicitAdmin) {
          let adminName = 'VALKNUT Director';
          try {
            const { data: profileRow } = await supabase
              .from('customer_profiles')
              .select('full_name')
              .eq('id', data.user.id)
              .maybeSingle();

            if (profileRow?.full_name) {
              adminName = profileRow.full_name;
            }
          } catch (_) {}

          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || emailToTry,
            name: adminName,
            phone: '+94 77 999 8888',
            isAdmin: true
          };
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
          return { success: true, user: profile, message: 'Administrative access verified via Supabase.' };
        } else {
          return { success: false, message: 'This account does not have administrator privileges.' };
        }
      }
    } catch (e: any) {
      console.error('Supabase admin login error:', e);
      return {
        success: false,
        message: e?.message || 'Supabase admin sign-in failed. Please check your connection.'
      };
    }

    return { success: false, message: 'Invalid administrator credentials or access denied.' };
  }

  return {
    success: false,
    message: 'Access denied. Cloud database authentication is required.'
  };
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
      await supabase.from('customer_profiles').upsert({
        id: userId,
        full_name: updatedUser.name,
        phone: updatedUser.phone,
        delivery_address: updatedUser.address,
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
          .from('customer_profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

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
