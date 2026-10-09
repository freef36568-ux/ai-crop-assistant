import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key'
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function getGeminiApiKey(): string {
  try {
    const raw = localStorage.getItem('cropwise_app_settings');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.customGeminiApiKey && parsed.customGeminiApiKey.trim().length > 5) {
        return parsed.customGeminiApiKey.trim();
      }
    }
  } catch {
    // Ignore localStorage parse errors
  }
  const envKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  if (envKey && envKey !== 'your-gemini-api-key') {
    return envKey.trim();
  }
  return '';
}

export const geminiApiKey = getGeminiApiKey();

export const isGeminiConfigured = Boolean(getGeminiApiKey());

export async function checkSupabaseConnection(): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    return !error;
  } catch {
    return false;
  }
}
