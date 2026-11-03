/**
 * Variáveis de ambiente públicas (prefixo EXPO_PUBLIC_).
 * Os valores ficam em ".env.local" (fora do Git). Veja ".env.example".
 */
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() ?? '';
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ?? '';

function isValidUrl(value: string) {
  return /^https:\/\/[^\s/]+/.test(value);
}

export const env = {
  supabaseUrl,
  supabasePublishableKey,
  isSupabaseConfigured: isValidUrl(supabaseUrl) && supabasePublishableKey.length > 20,
} as const;
