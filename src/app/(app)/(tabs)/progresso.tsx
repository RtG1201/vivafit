import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ScreenHeader, WeekStrip } from '@/components/cards';
import { AppText, Card, EmptyState, ErrorState, ListCard, LoadingState, ProgressBar, Screen, SectionHeader } from '@/components/ui';
import { useProgress } from '@/hooks/queries';
import { capitalizeFirst, formatShortDate, monthGrid, monthName, toISODate, WEEKDAY_SHORT, weekDates } from '@/lib/dates';
import { WEEKLY_ACTIVE_DAYS_GOAL } from '@/lib/gamification';
import { colors, radius, spacing } from '@/theme';

export default function ProgressScreen() {
  const p = useProgress();
  const [refreshing, setRefreshing] = useState(false);

  const now = new Date();
  const [month, setMonth] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const grid = useMemo(() => monthGrid(month.y, month.m), [month]);
  const today = toISODate(now);
  const monthActive = grid.filter((d) => d && p.activeDates.has(d)).length;
  const weekActive = weekDates().filter((d) => p.activeDates.has(d)).length;
  const isCurrentMonth = month.y === now.getFullYear() && month.m === now.getMonth();

  const shiftMonth = (delta: number) =>
    setMonth(({ y, m }) => {
      const d = new Date(y, m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });

  const onRefresh = async () => {
    setRefreshing(true);
    await p.refetch();
    setRefreshing(false);
  };

  return (
    <Screen refreshing={refreshing} onRefresh={onRefresh}>
      <ScreenHeader title="Seu progresso" subtitle="Constância no seu ritmo, sem comparação." />

      {p.error ? <ErrorState error={p.error} onRetry={p.refetch} /> : null}
      {p.isLoading ? <LoadingState /> : null}

      {!p.isLoading ? (
        <>
          {/* Sequência */}
          <Card tone="plum">
            <AppText variant="overline" color="sage">
              Sequência atual
            </AppText>
            <View style={styles.streakRow}>
              <AppText variant="stat" color="textOnDark">
                {p.streak}
              </AppText>
              <AppText variant="bodyStrong" color="textOnDark" style={styles.flex}>
                {p.streak === 1 ? 'dia ativo seguido' : 'dias ativos seguidos'}
              </AppText>
              <View style={styles.record}>
                <AppText variant="caption" color="textOnDark">
                  Recorde
                </AppText>
                <AppText variant="subheading" color="textOnDark">
                  {p.stats.longestStreak} {p.stats.longestStreak === 1 ? 'dia' : 'dias'}
                </AppText>
              </View>
            </View>
            <AppText variant="small" color="textOnDark" style={styles.soft}>
              Conta como dia ativo qualquer treino registrado ou hábito marcado.
            </AppText>
          </Card>

          {/* Semana */}
          <Card>
            <View style={styles.rowBetween}>
              <AppText variant="subheading">Esta semana</AppText>
              <AppText variant="smallStrong" color="sageDeep">
                {weekActive} de {WEEKLY_ACTIVE_DAYS_GOAL} dias
              </AppText>
            </View>
            <ProgressBar value={weekActive / WEEKLY_ACTIVE_DAYS_GOAL} />
            <WeekStrip activeDates={p.activeDates} />
          </Card>

          {/* Calendário */}
          <Card>
            <View style={styles.rowBetween}>
              <Pressable accessibilityRole="button" accessibilityLabel="Mês anterior" onPress={() => shiftMonth(-1)} style={styles.navBtn}>
                <Ionicons name="chevron-back" size={20} color={colors.plum} />
              </Pressable>
              <View style={styles.monthTitle}>
                <AppText variant="subheading">
                  {capitalizeFirst(monthName(month.m))} de {month.y}
                </AppText>
                <AppText variant="caption" color="sageDeep">
                  {monthActive === 1 ? '1 dia ativo' : `${monthActive} dias ativos`}
                </AppText>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Próximo mês"
                onPress={() => shiftMonth(1)}
                disabled={isCurrentMonth}
                style={[styles.navBtn, isCurrentMonth && styles.disabled]}
              >
                <Ionicons name="chevron-forward" size={20} color={colors.plum} />
              </Pressable>
            </View>
            <View style={styles.grid}>
              {WEEKDAY_SHORT.map((d) => (
                <View key={d} style={styles.cell}>
                  <AppText variant="caption" color="textMuted">
                    {d}
                  </AppText>
                </View>
              ))}
              {grid.map((iso, i) => {
                if (!iso) return <View key={`e${i}`} style={styles.cell} />;
                const active = p.activeDates.has(iso);
                const isToday = iso === today;
                const future = iso > today;
                const day = Number(iso.slice(8));
                return (
                  <View
                    key={iso}
                    style={styles.cell}
                    accessible
                    accessibilityLabel={`${day} de ${monthName(month.m)}${isToday ? ', hoje' : ''}${active ? ', dia ativo' : ''}`}
                  >
                    <View style={[styles.day, active && styles.dayActive, isToday && styles.dayToday]}>
                      <AppText variant="small" color={future ? 'borderStrong' : 'textStrong'} style={(active || isToday) && styles.bold}>
                        {day}
                      </AppText>
                    </View>
                  </View>
                );
              })}
            </View>
          </Card>

          {/* Conquistas */}
          <SectionHeader title="Conquistas" />
          <View style={styles.badges}>
            {p.achievements.map((a) => (
              <View
                key={a.id}
                style={[styles.badge, a.unlocked ? styles.badgeOn : styles.badgeOff]}
                accessible
                accessibilityLabel={`${a.title}. ${a.description}. ${a.unlocked ? 'Conquistada' : `${Math.round(a.progress * 100)}% concluído`}`}
              >
                <View style={[styles.badgeIcon, a.unlocked ? styles.badgeIconOn : styles.badgeIconOff]}>
                  <Ionicons name={a.unlocked ? 'ribbon' : 'ribbon-outline'} size={22} color={a.unlocked ? colors.plum : colors.borderStrong} />
                </View>
                <AppText variant="smallStrong" align="center">
                  {a.title}
                </AppText>
                <AppText variant="caption" color={a.unlocked ? 'sageDeep' : 'textMuted'} align="center">
                  {a.unlocked ? 'Conquistada' : a.description}
                </AppText>
                {!a.unlocked ? <ProgressBar value={a.progress} height={4} /> : null}
              </View>
            ))}
          </View>

          {/* Atividades */}
          <SectionHeader title="Atividades recentes" />
          {p.recentActivities.length === 0 ? (
            <EmptyState
              icon="walk-outline"
              title="Nenhuma atividade registrada"
              message="Abra um exercício em Treinos e toque em “Marcar como feito” para registrar."
            />
          ) : (
            <ListCard>
              {p.recentActivities.map((a) => (
                <View key={a.id} style={styles.activity}>
                  <View style={styles.dot} />
                  <AppText variant="bodyStrong" style={styles.flex} numberOfLines={1}>
                    {a.title}
                  </AppText>
                  <AppText variant="caption" color="textMuted">
                    {a.minutes} min · {formatShortDate(a.date)}
                  </AppText>
                </View>
              ))}
            </ListCard>
          )}
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  streakRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm },
  record: { alignItems: 'flex-end' },
  soft: { opacity: 0.85 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  monthTitle: { alignItems: 'center', flex: 1 },
  navBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceMuted },
  disabled: { opacity: 0.35 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.xs },
  cell: { width: `${100 / 7}%`, alignItems: 'center', justifyContent: 'center', paddingVertical: 3 },
  day: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  dayActive: { backgroundColor: colors.sage },
  dayToday: { borderWidth: 2, borderColor: colors.terracotta },
  bold: { fontFamily: 'DMSans_700Bold' },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  badge: {
    flexBasis: '30%',
    flexGrow: 1,
    alignItems: 'center',
    gap: 6,
    padding: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  badgeOn: { backgroundColor: colors.surface, borderColor: colors.border },
  badgeOff: { backgroundColor: colors.offWhite, borderColor: colors.border, borderStyle: 'dashed' },
  badgeIcon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  badgeIconOn: { backgroundColor: colors.sageTint, borderWidth: 2, borderColor: colors.sage },
  badgeIconOff: { backgroundColor: colors.surfaceMuted },
  activity: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 52, paddingHorizontal: spacing.md, backgroundColor: colors.surface },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.sage },
});
