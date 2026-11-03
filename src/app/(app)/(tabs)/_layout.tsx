import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router/js-tabs';
import type { ComponentProps } from 'react';
import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts } from '@/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

const TABS: { name: string; title: string; icon: IconName; iconActive: IconName }[] = [
  { name: 'inicio', title: 'Início', icon: 'home-outline', iconActive: 'home' },
  { name: 'alimentacao', title: 'Alimentação', icon: 'restaurant-outline', iconActive: 'restaurant' },
  { name: 'treinos', title: 'Treinos', icon: 'barbell-outline', iconActive: 'barbell' },
  { name: 'progresso', title: 'Progresso', icon: 'stats-chart-outline', iconActive: 'stats-chart' },
  { name: 'perfil', title: 'Perfil', icon: 'person-outline', iconActive: 'person' },
];

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.textStrong,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarActiveBackgroundColor: 'transparent',
        tabBarLabelPosition: 'below-icon',
        tabBarItemStyle: { paddingHorizontal: 0 },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          // Altura própria (ícone + rótulo) somada à área segura do aparelho.
          height: 74 + insets.bottom,
          paddingTop: 6,
          paddingBottom: insets.bottom + 6,
        },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      {TABS.map((t) => (
        <Tabs.Screen
          key={t.name}
          name={t.name}
          options={{
            title: t.title,
            tabBarAccessibilityLabel: t.title,
            tabBarLabel: ({ focused, color }) => (
              <Text
                numberOfLines={1}
                allowFontScaling={false}
                style={{ fontFamily: focused ? fonts.bodySemiBold : fonts.bodyMedium, fontSize: 11, lineHeight: 14, letterSpacing: -0.1, color: String(color), marginTop: 2 }}
              >
                {t.title}
              </Text>
            ),
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? t.iconActive : t.icon} size={size ?? 22} color={focused ? colors.sageDeep : String(color)} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
