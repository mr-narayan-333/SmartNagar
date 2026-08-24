import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

declare const process: {
  env: Record<string, string | undefined>;
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '';

const webStorage = {
  getItem: async (key: string) => {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage.getItem(key);
  },

  setItem: async (key: string, value: string) => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(key, value);
  },

  removeItem: async (key: string) => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.removeItem(key);
  },
};

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      storage: Platform.OS === 'web' ? webStorage : AsyncStorage,
      storageKey: 'smartnagar-auth',
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  }
);

export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string
) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
}

export async function signInWithEmail(
  email: string,
  password: string
) {
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOutFromApp() {
  return supabase.auth.signOut();
}

export async function getCurrentUser() {
  return supabase.auth.getUser();
}

export async function upsertProfile(
  userId: string,
  fullName: string,
  email: string
) {
  return supabase
    .from('profiles')
    .upsert(
      {
        id: userId,
        full_name: fullName,
        email,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'id',
      }
    );
}

export async function createIssueRecord(input: {
  reporterId: string;
  title: string;
  category: string;
  description: string;
  locationText: string;
  latitude?: number | null;
  longitude?: number | null;
  status?: string;
}) {
  const ticketId = `SN${Date.now().toString().slice(-8)}`;

  return supabase
    .from('civic_issues')
    .insert({
      ticket_id: ticketId,
      reporter_id: input.reporterId,
      title: input.title,
      category: input.category,
      description: input.description,
      location_text: input.locationText,
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
      status: input.status ?? 'Reported',
      created_at: new Date().toISOString(),
    })
    .select()
    .single();
}