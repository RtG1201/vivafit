import { requireSupabase } from '@/lib/supabase';

/** Traduz mensagens comuns do Supabase Auth para português. */
export function authErrorMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error ?? '');
  const msg = raw.toLowerCase();
  if (msg.includes('invalid login credentials')) return 'E-mail ou senha incorretos.';
  if (msg.includes('email not confirmed')) return 'Confirme seu e-mail pelo link que enviamos antes de entrar.';
  if (msg.includes('user already registered')) return 'Já existe uma conta com este e-mail. Tente entrar.';
  if (msg.includes('password should be at least')) return 'A senha precisa ter pelo menos 8 caracteres.';
  if (msg.includes('rate limit') || msg.includes('too many')) return 'Muitas tentativas seguidas. Aguarde um pouco e tente de novo.';
  if (msg.includes('network') || msg.includes('fetch')) return 'Sem conexão com o servidor. Verifique sua internet.';
  if (msg.includes('não foi configurado')) return raw;
  return 'Não foi possível concluir agora. Tente novamente em instantes.';
}

export async function signInWithEmail(email: string, password: string) {
  const { error } = await requireSupabase().auth.signInWithPassword({ email: email.trim(), password });
  if (error) throw error;
}

/**
 * Cria a conta. O gatilho do banco cria o perfil e os hábitos iniciais.
 * Retorna `needsConfirmation` quando o projeto exige confirmação por e-mail.
 */
export async function signUpWithEmail(name: string, email: string, password: string) {
  const { data, error } = await requireSupabase().auth.signUp({
    email: email.trim(),
    password,
    options: { data: { name: name.trim() } },
  });
  if (error) throw error;
  return { needsConfirmation: !data.session };
}

/**
 * Exclui a conta e todos os dados da usuária (função delete_own_account no banco)
 * e encerra a sessão neste aparelho.
 */
export async function deleteOwnAccount() {
  const db = requireSupabase();
  const { error } = await db.rpc('delete_own_account');
  if (error) throw error;
  // A conta já não existe no servidor: limpa só a sessão local.
  await db.auth.signOut({ scope: 'local' });
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}
