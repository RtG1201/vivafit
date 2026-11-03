import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, spacing } from '@/theme';

export type CardTone = 'surface' | 'sage' | 'rose' | 'terracotta' | 'plum' | 'muted';

const TONES: Record<CardTone, { bg: string; border: string }> = {
  surface: { bg: colors.surface, border: colors.border },
  sage: { bg: colors.sageTint, border: colors.sageTint },
  rose: { bg: colors.roseTint, border: colors.roseTint },
  terracotta: { bg: colors.terracottaTint, border: colors.terracottaTint },
  plum: { bg: colors.plum, border: colors.plum },
  muted: { bg: colors.surfaceMuted, border: colors.surfaceMuted },
};

type CardProps = {
  children: ReactNode;
  tone?: CardTone;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
};

/** Cartão arredondado. Com `onPress`, vira um botão acessível. */
export function Card({ children, tone = 'surface', onPress, accessibilityLabel, style, padded = true }: CardProps) {
  const t = TONES[tone];
  const base = [styles.card, { backgroundColor: t.bg, borderColor: t.border }, padded && styles.padded, style];

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={({ pressed }) => [base, pressed && styles.pressed]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={base}>{children}</View>;
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, borderWidth: 1, overflow: 'hidden' },
  padded: { padding: spacing.lg, gap: spacing.sm },
  pressed: { opacity: 0.9 },
});
