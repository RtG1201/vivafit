import { Redirect, Stack, useSegments } from 'expo-router';

import { useProfile } from '@/hooks/queries';
import { colors, fonts } from '@/theme';

/** Área logada: abas + telas de detalhe empilhadas por cima. */
export default function AppLayout() {
  const profile = useProfile();
  const segments = useSegments();
  const onOnboarding = (segments as string[]).includes('questionario');

  // Primeiro acesso: leva ao questionário até ser respondido ou pulado (ambos marcam `onboarded`).
  if (profile.data && !profile.data.onboarded && !onOnboarding) {
    return <Redirect href="/questionario" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.plum,
        headerTitleStyle: { fontFamily: fonts.bodySemiBold },
        headerBackButtonDisplayMode: 'minimal',
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="receita/[id]" options={{ title: 'Receita' }} />
      <Stack.Screen name="treino/[id]" options={{ title: 'Exercício' }} />
      <Stack.Screen name="questionario" options={{ headerShown: false, gestureEnabled: false }} />
    </Stack>
  );
}
