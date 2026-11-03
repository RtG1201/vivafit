import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, layout, radius, spacing } from '@/theme';
import { AppText } from './AppText';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

export type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: ComponentProps<typeof Ionicons>['name'];
  loading?: boolean;
  disabled?: boolean;
  size?: 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
};

const VARIANTS: Record<Variant, { bg: string; border: string; text: keyof typeof colors }> = {
  primary: { bg: colors.terracotta, border: colors.terracotta, text: 'textStrong' },
  secondary: { bg: 'transparent', border: colors.plum, text: 'text' },
  ghost: { bg: 'transparent', border: 'transparent', text: 'text' },
  danger: { bg: 'transparent', border: colors.danger, text: 'danger' },
};

/** Botão padrão. O primário usa terracota com texto ameixa-escuro (contraste 4.7:1). */
export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  size = 'lg',
  style,
  accessibilityHint,
}: ButtonProps) {
  const v = VARIANTS[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      onPress={onPress}
      disabled={isDisabled}
      hitSlop={4}
      style={({ pressed }) => [
        styles.base,
        size === 'lg' ? styles.lg : styles.md,
        { backgroundColor: v.bg, borderColor: v.border },
        variant === 'ghost' && styles.ghost,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors[v.text]} />
      ) : (
        <View style={styles.content}>
          {icon ? <Ionicons name={icon} size={18} color={colors[v.text]} /> : null}
          <AppText variant="bodyStrong" color={v.text} numberOfLines={1}>
            {label}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  lg: { minHeight: 54 },
  md: { minHeight: layout.minTouchTarget },
  ghost: { paddingHorizontal: spacing.xs },
  content: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.5 },
});
