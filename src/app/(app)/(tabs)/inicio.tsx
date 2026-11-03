import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { HabitRow, WeekStrip } from '@/components/cards';
import {
  AppText,
  Button,
  Card,
  EmptyState,
  ErrorState,
  ListCard,
  LoadingState,
  Overline,
  ProgressBar,
  Screen,
  SectionHeader,
} from '@/components/ui';
import { useAnnouncement, useExercises, useProfile, useProgress, useToggleHabit } from '@/hooks/queries';
import { formatLongDate, greetingFor, weekDates } from '@/lib/dates';
import { motivationalMessage, WEEKLY_ACTIVE_DAYS_GOAL } from '@/lib/gamification';
import { equipmentLabel, LEVELS } from '@/lib/labels';
import { fitsEquipment, isBeginner } from '@/lib/onboarding';
import { useAuth } from '@/providers/AuthProvider';
import { colors, spacing } from '@/theme';
import type { Exercise, Profile } from '@/types/database';

/** Sugere um exercício compatível com o tempo, o nível e os equipamentos do perfil. */
function pickSuggestion(exercises: Exercise[], profile: Profile | null | undefined): Exercise | null {
  if (!exercises.length) return null;
  const minutes = profile?.minutes_available ?? null;
  const beginner = isBeginner(profile?.activity_level);
  const owned = profile?.equipment ?? [];
  const pool = exercises.filter(
    (e) =>
      (!beginner || e.level === 'iniciante') &&
      (minutes == null || e.duration_minutes <= minutes) &&
      fitsEquipment(e, owned),
  );
  const list = pool.length ? pool : exercises;
  const dayIndex = Math.floor(Date.now() / 86_400_000) % list.length;
  return list[dayIndex];
}

function firstName(profile: Profile | null | undefined, email?: string | null) {
  const n = profile?.name?.trim();
  if (n) return n.split(' ')[0];
  return email ? email.split('@')[0] : '';
}

export default function DashboardScreen() {
  const { user } = useAuth();
  const profile = useProfile();
  const progress = useProgress();
  const exercises = useExercises();
  const announcement = useAnnouncement();
  const toggle = useToggleHabit();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const suggestion = useMemo(() => pickSuggestion(exercises.data ?? [], profile.data), [exercises.data, profile.data]);
  const name = firstName(profile.data, user?.email);
  const habitsDone = progress.habits.filter((h) => progress.todayHabitIds.has(h.id)).length;
  const weekActive = weekDates().filter((d) => progress.activeDates.has(d)).length;

  const refreshing = profile.isRefetching || exercises.isRefetching;
  const onRefresh = () => {
    profile.refetch();
    exercises.refetch();
    announcement.refetch();
    progress.refetch();
  };

  return (
    <Screen refreshing={refreshing} onRefresh={onRefresh}>
      <View style={styles.header}>
        <AppText variant="caption" color="textMuted">
          {formatLongDate()}
        </AppText>
        <AppText variant="title" accessibilityRole="header">
          {name ? `${greetingFor()}, ${name}` : greetingFor()}
        </AppText>
      </View>

      {progress.error ? <ErrorState error={progress.error} onRetry={progress.refetch} /> : null}

      {/* Resumo do dia */}
      <Card>
        <AppText variant="subheading">Resumo de hoje</AppText>
        {progress.isLoading ? (
          <LoadingState />
        ) : (
          <>
            <View style={styles.statsRow}>
              <Stat value={`${habitsDone}/${progress.habits.length}`} label="hábitos feitos" />
              <Stat value={`${progress.todayMinutes}`} label="min de atividade" />
              <Stat value={`${progress.streak}`} label={progress.streak === 1 ? 'dia seguido' : 'dias seguidos'} />
            </View>
            <ProgressBar value={progress.habits.length ? habitsDone / progress.habits.length : 0} />
          </>
        )}
      </Card>

      {/* Treino sugerido */}
      <Card tone="sage">
        <Overline>Treino sugerido</Overline>
        {exercises.isLoading ? (
          <LoadingState />
        ) : exercises.error ? (
          <ErrorState error={exercises.error} onRetry={exercises.refetch} />
        ) : suggestion ? (
          <>
            <AppText variant="heading">{suggestion.name}</AppText>
            <View style={styles.pills}>
              <Pill icon="time-outline" label={`${suggestion.duration_minutes} min`} />
              <Pill label={LEVELS[suggestion.level]?.label ?? suggestion.level} />
              <Pill label={equipmentLabel(suggestion.equipment)} />
            </View>
            {suggestion.description ? (
              <AppText variant="small">{suggestion.description}</AppText>
            ) : null}
            <Button
              label="Ver passo a passo"
              icon="play"
              onPress={() => router.push({ pathname: '/treino/[id]', params: { id: suggestion.id } })}
            />
          </>
        ) : (
          <AppText variant="small">Ainda não há exercícios publicados.</AppText>
        )}
      </Card>

      {/* Hábitos */}
      <SectionHeader title="Hábitos de hoje" />
      {progress.isLoading ? (
        <LoadingState />
      ) : progress.habits.length === 0 ? (
        <EmptyState
          icon="water-outline"
          title="Nenhum hábito por aqui"
          message="Os hábitos iniciais são criados junto com a sua conta. Se não aparecerem, puxe a tela para atualizar."
        />
      ) : (
        <ListCard>
          {progress.habits.map((h) => (
            <HabitRow
              key={h.id}
              habit={h}
              done={progress.todayHabitIds.has(h.id)}
              pending={pendingId === h.id}
              onToggle={() => {
                setPendingId(h.id);
                toggle.mutate(
                  { habit: h, done: !progress.todayHabitIds.has(h.id) },
                  { onSettled: () => setPendingId(null) },
                );
              }}
            />
          ))}
        </ListCard>
      )}
      {toggle.error ? (
        <AppText variant="caption" color="danger" accessibilityRole="alert">
          Não foi possível salvar o hábito. Verifique a conexão e tente de novo.
        </AppText>
      ) : null}

      {/* Semana */}
      <Card>
        <View style={styles.weekHeader}>
          <AppText variant="subheading">Sua semana</AppText>
          <AppText variant="smallStrong" color="sageDeep">
            {weekActive} de {WEEKLY_ACTIVE_DAYS_GOAL} dias ativos
          </AppText>
        </View>
        <WeekStrip activeDates={progress.activeDates} />
      </Card>

      {/* Aviso do app (vindo do banco) */}
      {announcement.data ? (
        <Card tone="terracotta">
          <View style={styles.annHeader}>
            <Ionicons name="megaphone-outline" size={18} color={colors.terracottaDeep} />
            <AppText variant="smallStrong" color="terracottaDeep">
              {announcement.data.title}
            </AppText>
          </View>
          {announcement.data.body ? <AppText variant="small">{announcement.data.body}</AppText> : null}
        </Card>
      ) : null}

      {/* Mensagem do dia */}
      <Card tone="rose">
        <AppText variant="quote" color="textStrong">
          {motivationalMessage()}
        </AppText>
        <Overline color="roseDeep">Mensagem do dia</Overline>
      </Card>
    </Screen>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <AppText variant="heading">{value}</AppText>
      <AppText variant="caption" color="textMuted">
        {label}
      </AppText>
    </View>
  );
}

function Pill({ label, icon }: { label: string; icon?: 'time-outline' }) {
  return (
    <View style={styles.pill}>
      {icon ? <Ionicons name={icon} size={14} color={colors.textStrong} /> : null}
      <AppText variant="caption" color="textStrong" style={styles.pillText}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { gap: 2, marginTop: spacing.xs },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  stat: { flex: 1, gap: 2 },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.offWhite,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pillText: { fontFamily: 'DMSans_600SemiBold' },
  weekHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: spacing.xs },
  annHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
