import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { ClubSubscriber } from '../types/ecommerce';

const LOCAL_STORAGE_KEY = 'valknut_newsletter_subscribers';

/**
 * Reads local cached subscribers from browser storage
 */
function getLocalSubscribers(): ClubSubscriber[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading local subscribers:', err);
    return [];
  }
}

/**
 * Saves subscriber list to browser storage
 */
function saveLocalSubscribers(list: ClubSubscriber[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Error saving local subscribers:', err);
  }
}

/**
 * Subscribes an email to the VIP early access club.
 * Persists in Supabase (if available) and always syncs to local storage.
 */
export async function subscribeToClub(
  email: string,
  source: 'footer' | 'homepage' = 'footer'
): Promise<{ success: boolean; message: string; alreadySubscribed?: boolean }> {
  const normalizedEmail = email.trim().toLowerCase();

  // Basic email pattern validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
    return {
      success: false,
      message: 'Please enter a valid email address.'
    };
  }

  // 1. Check local storage cache
  const localList = getLocalSubscribers();
  const existingLocal = localList.find((s) => s.email.toLowerCase() === normalizedEmail);
  const now = new Date().toISOString();

  let isAlreadySubscribed = Boolean(existingLocal);

  if (!existingLocal) {
    const newEntry: ClubSubscriber = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `sub_${Date.now()}`,
      email: normalizedEmail,
      source,
      createdAt: now
    };
    localList.unshift(newEntry);
    saveLocalSubscribers(localList);
  }

  // 2. Persist to Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('newsletter_subscribers').insert([
        {
          email: normalizedEmail,
          source
        }
      ]);

      if (error) {
        // Postgres unique violation code 23505
        if (
          error.code === '23505' ||
          error.message?.toLowerCase().includes('duplicate key') ||
          error.message?.toLowerCase().includes('unique')
        ) {
          return {
            success: true,
            alreadySubscribed: true,
            message: 'You are already on the VIP drop list!'
          };
        }
        console.warn('Supabase newsletter subscription note:', error.message);
      }
    } catch (err) {
      console.warn('Supabase newsletter connection note:', err);
    }
  }

  if (isAlreadySubscribed) {
    return {
      success: true,
      alreadySubscribed: true,
      message: 'You are already on the VIP drop list!'
    };
  }

  return {
    success: true,
    message: 'Welcome to the inner circle. Your VIP early access is reserved.'
  };
}

/**
 * Fetches all VIP club subscribers for the Admin Dashboard.
 * Merges Supabase records with local storage so no subscribers are lost.
 */
export async function getNewsletterSubscribers(): Promise<ClubSubscriber[]> {
  const mapByEmail = new Map<string, ClubSubscriber>();

  // 1. Seed from local storage
  const localList = getLocalSubscribers();
  localList.forEach((sub) => {
    mapByEmail.set(sub.email.toLowerCase(), sub);
  });

  // 2. Fetch from Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        data.forEach((row: any) => {
          mapByEmail.set(row.email.toLowerCase(), {
            id: row.id || `remote_${row.email}`,
            email: row.email,
            source: row.source || 'footer',
            createdAt: row.created_at || new Date().toISOString()
          });
        });
      }
    } catch (err) {
      console.warn('Could not fetch subscribers from Supabase:', err);
    }
  }

  const combined = Array.from(mapByEmail.values());
  // Sort latest first
  combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Also keep local storage synchronized
  saveLocalSubscribers(combined);

  return combined;
}

/**
 * Deletes a subscriber by ID and email
 */
export async function deleteNewsletterSubscriber(id: string, email: string): Promise<boolean> {
  const normalizedEmail = email.toLowerCase();

  // 1. Remove from local storage
  const localList = getLocalSubscribers().filter(
    (s) => s.email.toLowerCase() !== normalizedEmail && s.id !== id
  );
  saveLocalSubscribers(localList);

  // 2. Remove from Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('newsletter_subscribers')
        .delete()
        .or(`id.eq.${id},email.eq.${normalizedEmail}`);
    } catch (err) {
      console.warn('Error deleting subscriber from Supabase:', err);
    }
  }

  return true;
}
