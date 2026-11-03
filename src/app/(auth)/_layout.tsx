import { Stack } from 'expo-router';

import { colors, fonts } from '@/theme';

export default function AuthLayout() {
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
      <Stack.Screen name="boas-vindas" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: '' }} />
      <Stack.Screen name="cadastro" options={{ title: '' }} />
    </Stack>
  );
}
