import { Ionicons } from '@expo/vector-icons';
import { Link, type Href } from 'expo-router';
import type { ComponentProps, ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, layout, radius, spacing } from '@/theme';
import { AppText } from './AppText';

type IconName = ComponentProps<typeof Ionicons>['name'];

/** Título de seção com link opcional à direita. */
export function SectionHeader({ title, actionLabel, href }: { title: string; actionLabel?: string; href?: Href }) {
  return (
    <View style={styles.sectionHeader}>
      <AppText variant="subheading" accessibilityRole="header">
        {title}
      </AppText>
      {actionLabel && href ? (
        <Link href={href} asChild>
          <Pressable accessibilityRole="link" hitSlop={8} style={styles.sectionAction}>
            <AppText variant="smallStrong" style={styles.underline}>
              {actionLabel}
            </AppText>
          </Pressable>
        </Link>
      ) : null}
    </View>
  );
}

/** Rótulo curto em caixa alta (kicker). */
export function Overline({ children, color = 'sageDeep' }: { children: ReactNode; color?: keyof typeof colors }) {
  return (
    <AppText variant="overline" color={color}>
      {children}
    </AppText>
  );
}

type BadgeTone = 'sage' | 'rose' | 'terracotta' | 'muted';
const BADGE: Record<BadgeTone, { bg: string; text: keyof typeof colors }> = {
  sage: { bg: colors.sageTint, text: 'textStrong' },
  rose: { bg: colors.roseTint, text: 'roseDeep' },
  terracotta: { bg: colors.terracottaTint, text: 'terracottaDeep' },
  muted: { bg: colors.surfaceMuted, text: 'text' },
};

export function Badge({ label, tone = 'muted', icon }: { label: string; tone?: BadgeTone; icon?: IconName }) {
  const t = BADGE[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }]}>
      {icon ? <Ionicons name={icon} size={12} color={colors[t.text]} /> : null}
      <AppText variant="caption" color={t.text} style={styles.badgeText}>
        {label}
      </AppText>
    </View>
  );
}

/** Ícone dentro de um círculo colorido (decorativo). */
export function IconCircle({ name, bg = colors.sageTint, color = colors.plum, size = 40 }: {
  name: IconName;
  bg?: string;
  color?: string;
  size?: number;
}) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}
    >
      <Ionicons name={name} size={Math.round(size * 0.46)} color={color} />
    </View>
  );
}

export function ProgressBar({ value, color = colors.sage, track = colors.border, height = 8 }: {
  value: number; // 0..1
  color?: string;
  track?: string;
  height?: number;
}) {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(pct * 100) }}
      style={{ height, borderRadius: height, backgroundColor: track, overflow: 'hidden' }}
    >
      <View style={{ width: `${pct * 100}%`, height, borderRadius: height, backgroundColor: color }} />
    </View>
  );
}

/** Indicador de nível em 3 barras + texto (não depende só de cor). */
export function LevelBars({ step, label }: { step: 1 | 2 | 3; label: string }) {
  return (
    <View style={styles.level} accessibilityLabel={`Nível ${label}`}>
      <View style={styles.levelBars}>
        {[6, 10, 14].map((h, i) => (
          <View key={h} style={{ width: 4, height: h, borderRadius: 2, backgroundColor: i < step ? colors.plum : '#E3D7D0' }} />
        ))}
      </View>
      <AppText variant="caption" color="textMuted">
        {label}
      </AppText>
    </View>
  );
}

/** Lista com divisórias finas dentro de um cartão. */
export function ListCard({ children }: { children: ReactNode }) {
  return <View style={styles.listCard}>{children}</View>;
}

const styles = StyleSheet.create({
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.xs },
  sectionAction: { minHeight: layout.minTouchTarget, justifyContent: 'center' },
  underline: { textDecorationLine: 'underline' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { fontFamily: 'DMSans_700Bold' },
  level: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  levelBars: { flexDirection: 'row', alignItems: 'flex-end', gap: 2, height: 14 },
  listCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.divider,
    overflow: 'hidden',
    gap: 1,
  },
});
