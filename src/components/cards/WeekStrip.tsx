import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { toISODate, WEEKDAY_SHORT, weekDates } from '@/lib/dates';
import { colors, spacing } from '@/theme';

/** Sete círculos de segunda a domingo marcando os dias ativos da semana atual. */
export function WeekStrip({ activeDates }: { activeDates: Set<string> }) {
  const today = toISODate(new Date());
  const week = weekDates();

  return (
    <View style={styles.row}>
      {week.map((iso, i) => {
        const active = activeDates.has(iso);
        const isToday = iso === today;
        const future = iso > today;
        const label = isToday ? 'Hoje' : WEEKDAY_SHORT[i];
        return (
          <View
            key={iso}
            style={styles.day}
            accessible
            accessibilityLabel={`${WEEKDAY_SHORT[i]}${isToday ? ', hoje' : ''}: ${active ? 'dia ativo' : future ? 'ainda por vir' : 'sem atividade'}`}
          >
            <AppText variant="caption" color={isToday ? 'textStrong' : 'textMuted'} style={isToday && styles.bold}>
              {label}
            </AppText>
            <View
              style={[
                styles.dot,
                active && styles.active,
                future && styles.future,
                isToday && styles.today,
              ]}
            >
              {active ? <Ionicons name="checkmark" size={16} color={colors.textStrong} /> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 4 },
  day: { flex: 1, alignItems: 'center', gap: spacing.xs },
  bold: { fontFamily: 'DMSans_700Bold' },
  dot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: { backgroundColor: colors.sage },
  future: { backgroundColor: 'transparent', borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#B9AAB0' },
  today: { borderWidth: 2, borderStyle: 'solid', borderColor: colors.terracotta },
});
