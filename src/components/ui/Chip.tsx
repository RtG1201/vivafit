import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { colors, layout, radius, spacing } from '@/theme';
import { AppText } from './AppText';

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  /** "solid" para filtros principais, "soft" para filtros secundários. */
  tone?: 'solid' | 'soft';
};

export function Chip({ label, selected = false, onPress, tone = 'solid' }: ChipProps) {
  const solid = tone === 'solid';
  const bg = selected ? (solid ? colors.plum : colors.sageTint) : solid ? colors.surface : 'transparent';
  const border = selected ? (solid ? colors.plum : colors.sageDeep) : '#CDBFB8';
  const text = selected && solid ? 'textOnDark' : 'textStrong';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, { backgroundColor: bg, borderColor: border }, pressed && { opacity: 0.85 }]}
    >
      {selected && !solid ? <Ionicons name="checkmark" size={14} color={colors.textStrong} /> : null}
      <AppText variant="smallStrong" color={text}>
        {label}
      </AppText>
    </Pressable>
  );
}

type ChipOption<T extends string> = { value: T; label: string };

/** Linha de chips de seleção única com rolagem horizontal. */
export function ChipRow<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel,
}: {
  options: ChipOption<T>[];
  value: T;
  onChange: (v: T) => void;
  accessibilityLabel: string;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      accessibilityLabel={accessibilityLabel}
      contentContainerStyle={styles.row}
      style={styles.scroll}
    >
      {options.map((o) => (
        <Chip key={o.value} label={o.label} selected={o.value === value} onPress={() => onChange(o.value)} />
      ))}
    </ScrollView>
  );
}

/** Grupo de chips de seleção múltipla. Quebra linha ou, com `scroll`, rola na horizontal. */
export function ChipGroup({
  options,
  values,
  onToggle,
  scroll = false,
  accessibilityLabel,
}: {
  options: ChipOption<string>[];
  values: string[];
  onToggle: (v: string) => void;
  scroll?: boolean;
  accessibilityLabel?: string;
}) {
  const chips = options.map((o) => (
    <Chip key={o.value} tone="soft" label={o.label} selected={values.includes(o.value)} onPress={() => onToggle(o.value)} />
  ));
  if (scroll) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        accessibilityLabel={accessibilityLabel}
        contentContainerStyle={styles.row}
        style={styles.scroll}
      >
        {chips}
      </ScrollView>
    );
  }
  return (
    <View style={styles.wrap} accessibilityLabel={accessibilityLabel}>
      {chips}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 40,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scroll: { marginHorizontal: -layout.screenPadding, flexGrow: 0 },
  row: { gap: spacing.xs, paddingHorizontal: layout.screenPadding },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
});
