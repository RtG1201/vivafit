/**
 * Variáveis de ambiente públicas (prefixo EXPO_PUBLIC_).
 * Os valores ficam em ".env.local" (fora do Git). Veja ".env.example".
 */
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() ?? '';
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ?? '';
const privacyPolicyUrl = process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL?.trim() ?? '';

function isValidUrl(value: string) {
  return /^https:\/\/[^\s/]+/.test(value);
}

export const env = {
  supabaseUrl,
  supabasePublishableKey,
  isSupabaseConfigured: isValidUrl(supabaseUrl) && supabasePublishableKey.length > 20,
  /** Página pública da Política de Privacidade (obrigatória nas lojas). Vazio = link escondido. */
  privacyPolicyUrl: isValidUrl(privacyPolicyUrl) ? privacyPolicyUrl : '',
} as const;
