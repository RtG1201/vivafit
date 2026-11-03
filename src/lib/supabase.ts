// Cria um `localStorage` persistente (via expo-sqlite) onde o Supabase guarda a sessão.
import 'expo-sqlite/localStorage/install';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';

import type { Database } from '@/types/database';
import { env } from './env';

/**
 * Cliente único do Supabase. Fica `null` enquanto as variáveis de ambiente não
 * forem preenchidas — as telas mostram um aviso em vez de quebrar.
 */
export const supabase: SupabaseClient<Database> | null = env.isSupabaseConfigured
  ? createClient<Database>(env.supabaseUrl, env.supabasePublishableKey, {
      auth: {
        storage: localStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

/** Retorna o cliente ou lança um erro amigável se o Supabase não estiver configurado. */
export function requireSupabase(): SupabaseClient<Database> {
  if (!supabase) {
    throw new Error('O Supabase ainda não foi configurado neste aparelho. Veja o arquivo .env.example.');
  }
  return supabase;
}

// Renova o token só com o app em primeiro plano (recomendação do Supabase para mobile).
if (supabase) {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}
