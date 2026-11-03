import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { AppText, IconCircle } from '@/components/ui';
import { colors, layout, spacing } from '@/theme';
import type { Habit } from '@/types/database';

type IconName = ComponentProps<typeof Ionicons>['name'];

/** Ícone aproximado pelo nome do hábito (os hábitos vêm do banco). */
function iconFor(name: string): { icon: IconName; bg: string } {
  const n = name.toLowerCase();
  if (n.includes('água') || n.includes('agua')) return { icon: 'water-outline', bg: colors.sageTint };
  if (n.includes('dorm') || n.includes('sono')) return { icon: 'moon-outline', bg: '#ECE6F0' };
  if (n.includes('camin') || n.includes('passo')) return { icon: 'walk-outline', bg: colors.terracottaTint };
  if (n.includes('fruta')) return { icon: 'nutrition-outline', bg: colors.roseTint };
  return { icon: 'leaf-outline', bg: colors.sageTint };
}

export function HabitRow({
  habit,
  done,
  pending,
  onToggle,
}: {
  habit: Habit;
  done: boolean;
  pending?: boolean;
  onToggle: () => void;
}) {
  const { icon, bg } = iconFor(habit.name);
  const goal = habit.target > 1 ? `Meta: ${habit.target} ${habit.unit}` : `Meta: 1 ${habit.unit}`;

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: done, busy: pending }}
      accessibilityLabel={`${habit.name}. ${goal}`}
      onPress={onToggle}
      disabled={pending}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}
    >
      <IconCircle name={icon} bg={bg} size={40} />
      <View style={styles.text}>
        <AppText variant="bodyStrong">{habit.name}</AppText>
        <AppText variant="caption" color="textMuted">
          {goal}
        </AppText>
      </View>
      <View style={[styles.box, done && styles.boxDone]}>
        {pending ? (
          <ActivityIndicator size="small" color={colors.plum} />
        ) : done ? (
          <Ionicons name="checkmark" size={18} color={colors.textStrong} />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 68,
    backgroundColor: colors.surface,
  },
  text: { flex: 1, gap: 2 },
  box: {
    width: layout.minTouchTarget - 16,
    height: layout.minTouchTarget - 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxDone: { backgroundColor: colors.sage, borderColor: colors.sage },
});
