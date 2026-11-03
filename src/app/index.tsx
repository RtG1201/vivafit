import { Redirect } from 'expo-router';

import { useAuth } from '@/providers/AuthProvider';

/**
 * Rota "/" — não tem tela própria: envia para o Início (logada)
 * ou para as Boas-vindas (sem sessão). Evita a página "Unmatched Route".
 */
export default function IndexRedirect() {
  const { session } = useAuth();
  return <Redirect href={session ? '/inicio' : '/boas-vindas'} />;
}
