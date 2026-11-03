import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, Badge, Card, LevelBars } from '@/components/ui';
import { categoryLabel, equipmentLabel, LEVELS } from '@/lib/labels';
import { colors, radius, spacing } from '@/theme';
import type { Exercise, ExerciseCategory } from '@/types/database';

const TINT: Record<ExerciseCategory, string> = {
  iniciante: colors.sageTint,
  sem_equipamento: colors.sageTint,
  forca: colors.terracottaTint,
  mobilidade: colors.terracottaTint,
  alongamento: colors.roseTint,
};

export const ExerciseCard = memo(function ExerciseCard({ exercise, onPress }: { exercise: Exercise; onPress: () => void }) {
  const level = LEVELS[exercise.level] ?? LEVELS.iniciante;
  return (
    <Card
      onPress={onPress}
      padded={false}
      accessibilityLabel={`${exercise.name}. ${exercise.duration_minutes} minutos, nível ${level.label}.`}
    >
      <View style={styles.row}>
        <View style={[styles.thumb, { backgroundColor: TINT[exercise.category] ?? colors.sageTint }]}>
          <View style={styles.play}>
            <Ionicons name={exercise.video_url ? 'play' : 'list'} size={16} color={colors.plum} />
          </View>
          <AppText variant="caption" color="textStrong">
            {exercise.video_url ? 'Vídeo' : 'Passo a passo'}
          </AppText>
        </View>
        <View style={styles.body}>
          <View style={styles.titleRow}>
            <AppText variant="bodyStrong" style={styles.title} numberOfLines={2}>
              {exercise.name}
            </AppText>
            {exercise.premium ? <Badge label="Premium" tone="rose" icon="sparkles-outline" /> : null}
          </View>
          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={14} color={colors.textMuted} />
              <AppText variant="caption" color="textMuted">
                {exercise.duration_minutes} min
              </AppText>
            </View>
            <LevelBars step={level.step} label={level.label} />
          </View>
          <AppText variant="caption" color="textMuted">
            {equipmentLabel(exercise.equipment)} · {categoryLabel(exercise.category)}
          </AppText>
        </View>
      </View>
    </Card>
  );
});

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md, padding: spacing.sm },
  thumb: { width: 92, height: 92, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', gap: 6 },
  play: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.offWhite, alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, gap: 6, paddingTop: 2 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.xs },
  title: { flex: 1 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
