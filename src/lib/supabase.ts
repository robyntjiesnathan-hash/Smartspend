import { createClient, SupabaseClient, Session, User } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Use literal property access so Expo/Metro can substitute these at build time.
// The cast below is only to satisfy TypeScript — the _value_ is still accessed
// via a string literal that the Metro transform can rewrite.
/* eslint-disable @typescript-eslint/no-explicit-any */
const SUPABASE_URL = ((process.env as any).EXPO_PUBLIC_SUPABASE_URL as string | undefined || '').trim();
const SUPABASE_ANON_KEY = ((process.env as any).EXPO_PUBLIC_SUPABASE_ANON_KEY as string | undefined || '').trim();

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!_client) {
    _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storage: Platform.OS === 'web' ? undefined : (AsyncStorage as any),
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: Platform.OS === 'web',
      },
    });
  }
  return _client;
}

export type { Session, User };
