import { Stack } from 'expo-router';

import { colors, fonts } from '@/theme';

/** Área logada: abas + telas de detalhe empilhadas por cima. */
export default function AppLayout() {
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
    </Stack>
  );
}
