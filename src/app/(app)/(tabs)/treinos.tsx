import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ExerciseCard, LockedItem, ScreenHeader } from '@/components/cards';
import { AppText, ChipRow, EmptyState, ErrorState, ListCard, LoadingState, SectionHeader } from '@/components/ui';
import { useExercises, usePremiumTeasers } from '@/hooks/queries';
import { EXERCISE_CATEGORIES } from '@/lib/labels';
import { colors, layout, spacing } from '@/theme';
import type { Exercise, ExerciseCategory } from '@/types/database';

type CategoryFilter = 'todos' | ExerciseCategory;
const CATEGORY_OPTIONS: { value: CategoryFilter; label: string }[] = [{ value: 'todos', label: 'Todos' }, ...EXERCISE_CATEGORIES];

type DurationFilter = 'qualquer' | 'ate5' | 'ate10' | 'mais10';
const DURATION_OPTIONS: { value: DurationFilter; label: string }[] = [
  { value: 'qualquer', label: 'Qualquer duração' },
  { value: 'ate5', label: 'Até 5 min' },
  { value: 'ate10', label: 'Até 10 min' },
  { value: 'mais10', label: 'Mais de 10 min' },
];

function matchesDuration(e: Exercise, d: DurationFilter) {
  if (d === 'ate5') return e.duration_minutes <= 5;
  if (d === 'ate10') return e.duration_minutes <= 10;
  if (d === 'mais10') return e.duration_minutes > 10;
  return true;
}

export default function WorkoutsScreen() {
  const exercises = useExercises();
  const teasers = usePremiumTeasers();
  const [category, setCategory] = useState<CategoryFilter>('todos');
  const [duration, setDuration] = useState<DurationFilter>('qualquer');

  const filtered = useMemo(
    () =>
      (exercises.data ?? []).filter(
        (e) => (category === 'todos' || e.category === category) && matchesDuration(e, duration),
      ),
    [exercises.data, category, duration],
  );

  const locked = useMemo(() => {
    const visible = new Set((exercises.data ?? []).map((e) => e.id));
    return (teasers.data ?? []).filter((t) => t.kind === 'exercicio' && !visible.has(t.id));
  }, [teasers.data, exercises.data]);

  const open = useCallback((e: Exercise) => router.push({ pathname: '/treino/[id]', params: { id: e.id } }), []);

  const header = (
    <View style={styles.header}>
      <ScreenHeader title="Treinos em casa" subtitle="Escolha pelo seu tempo e pelo que você tem em casa." />
      <ChipRow options={CATEGORY_OPTIONS} value={category} onChange={setCategory} accessibilityLabel="Tipo de exercício" />
      <ChipRow options={DURATION_OPTIONS} value={duration} onChange={setDuration} accessibilityLabel="Duração" />
      {exercises.data ? (
        <AppText variant="caption" color="textMuted" accessibilityLiveRegion="polite">
          {filtered.length === 1 ? '1 exercício' : `${filtered.length} exercícios`}
        </AppText>
      ) : null}
    </View>
  );

  const footer =
    locked.length > 0 ? (
      <View style={styles.footer}>
        <SectionHeader title="Exercícios Premium" />
        <AppText variant="small" color="textMuted">
          Disponíveis no plano Premium, que ainda não está aberto para assinatura.
        </AppText>
        <ListCard>
          {locked.map((t) => (
            <LockedItem key={t.id} title={t.title} kind={t.kind} />
          ))}
        </ListCard>
      </View>
    ) : undefined;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={filtered}
        keyExtractor={(e) => e.id}
        renderItem={({ item }) => <ExerciseCard exercise={item} onPress={() => open(item)} />}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        ListEmptyComponent={
          exercises.isLoading ? (
            <LoadingState label="Buscando exercícios…" />
          ) : exercises.error ? (
            <ErrorState error={exercises.error} onRetry={exercises.refetch} />
          ) : (
            <EmptyState
              icon="barbell-outline"
              title="Nenhum exercício com esses filtros"
              message="Tente outra duração ou outro tipo."
              actionLabel="Ver todos"
              onAction={() => {
                setCategory('todos');
                setDuration('qualquer');
              }}
            />
          )
        }
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        refreshControl={
          <RefreshControl
            refreshing={exercises.isRefetching}
            onRefresh={() => {
              exercises.refetch();
              teasers.refetch();
            }}
            tintColor={colors.plum}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  list: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    width: '100%',
    maxWidth: layout.maxContentWidth + layout.screenPadding * 2,
    alignSelf: 'center',
  },
  header: { gap: spacing.md, marginBottom: spacing.md },
  sep: { height: spacing.sm },
  footer: { gap: spacing.sm, marginTop: spacing.lg },
});
