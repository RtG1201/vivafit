import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';

import { AppText, Badge, Button, Card, EmptyState, ErrorState, LevelBars, LoadingState, Overline, Screen, SectionHeader } from '@/components/ui';
import { useExercise, useLogActivity } from '@/hooks/queries';
import { categoryLabel, equipmentLabel, LEVELS } from '@/lib/labels';
import { colors, spacing } from '@/theme';

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const exercise = useExercise(id ?? '');
  const logActivity = useLogActivity();
  const [logged, setLogged] = useState(false);

  if (exercise.isLoading) return <Screen edges={[]}><LoadingState /></Screen>;
  if (exercise.error) return <Screen edges={[]}><ErrorState error={exercise.error} onRetry={exercise.refetch} /></Screen>;
  if (!exercise.data) {
    return (
      <Screen edges={[]}>
        <EmptyState icon="lock-closed-outline" title="Exercício indisponível" message="Ele pode ter sido removido ou fazer parte do plano Premium." />
      </Screen>
    );
  }

  const e = exercise.data;
  const level = LEVELS[e.level] ?? LEVELS.iniciante;

  function markDone() {
    // O erro aparece na tela via logActivity.error (sem promessa rejeitada solta).
    logActivity.mutate(
      { title: e.name, minutes: e.duration_minutes, exerciseId: e.id },
      { onSuccess: () => setLogged(true) },
    );
  }

  return (
    <Screen edges={['bottom']}>
      <Stack.Screen options={{ title: categoryLabel(e.category) }} />
      <View style={styles.header}>
        <Overline>{categoryLabel(e.category)}</Overline>
        <AppText variant="title" accessibilityRole="header">
          {e.name}
        </AppText>
        {e.description ? <AppText variant="body">{e.description}</AppText> : null}
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={16} color={colors.textMuted} />
            <AppText variant="small" color="textMuted">
              {e.duration_minutes} min
            </AppText>
          </View>
          <LevelBars step={level.step} label={level.label} />
          <Badge label={equipmentLabel(e.equipment)} />
          {e.premium ? <Badge label="Premium" tone="rose" icon="sparkles-outline" /> : null}
        </View>
      </View>

      {e.video_url ? (
        <Button
          label="Assistir demonstração"
          icon="play-circle-outline"
          variant="secondary"
          onPress={() => Linking.openURL(e.video_url!).catch(() => undefined)}
        />
      ) : null}

      <SectionHeader title="Passo a passo" />
      <View style={styles.steps}>
        {e.steps.map((s, i) => (
          <View key={i} style={styles.step}>
            <View style={styles.stepNum}>
              <AppText variant="smallStrong" color="textStrong">
                {i + 1}
              </AppText>
            </View>
            <AppText variant="body" style={styles.flex}>
              {s}
            </AppText>
          </View>
        ))}
      </View>

      <Card tone="muted">
        <AppText variant="small">
          Respeite seus limites. Se sentir dor, pare o exercício. Em caso de condição de saúde, procure orientação profissional.
        </AppText>
      </Card>

      {logged ? (
        <Card tone="sage">
          <View style={styles.metaItem}>
            <Ionicons name="checkmark-circle" size={22} color={colors.sageDeep} />
            <AppText variant="bodyStrong">Registrado no seu progresso de hoje.</AppText>
          </View>
        </Card>
      ) : (
        <Button label="Marcar como feito" icon="checkmark" onPress={markDone} loading={logActivity.isPending} />
      )}
      {logActivity.error ? (
        <AppText variant="caption" color="danger" accessibilityRole="alert">
          Não foi possível registrar agora. Verifique a conexão e tente de novo.
        </AppText>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { gap: spacing.xs },
  meta: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xxs },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  steps: { gap: spacing.md },
  step: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  stepNum: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.sageTint, alignItems: 'center', justifyContent: 'center' },
});
