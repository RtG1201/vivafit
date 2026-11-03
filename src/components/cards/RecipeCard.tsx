import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, Badge, Card } from '@/components/ui';
import { tagLabel } from '@/lib/labels';
import { recipeSummary } from '@/lib/recipes';
import { colors, radius, spacing } from '@/theme';
import type { Recipe } from '@/types/database';
import { FavoriteButton } from './FavoriteButton';
import { RecipePhoto } from './RecipePhoto';

type Props = {
  recipe: Recipe;
  favorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
};

/** Cartão da lista: foto, nome, tempo, porções, calorias estimadas e favorito. */
export const RecipeCard = memo(function RecipeCard({ recipe, favorite, onPress, onToggleFavorite }: Props) {
  const summary = recipeSummary(recipe);
  return (
    <Card onPress={onPress} padded={false} accessibilityLabel={`${recipe.title}. ${summary}`}>
      <View style={styles.row}>
        <RecipePhoto uri={recipe.image_url} mealType={recipe.meal_type} title={recipe.title} style={styles.thumb} />
        <View style={styles.body}>
          <AppText variant="bodyStrong" numberOfLines={2}>
            {recipe.title}
          </AppText>
          <View style={styles.meta}>
            <Ionicons name="time-outline" size={14} color={colors.textMuted} />
            <AppText variant="caption" color="textMuted">
              {summary}
            </AppText>
          </View>
          {recipe.calories != null ? (
            <AppText variant="caption" color="textMuted">
              ≈ {recipe.calories} kcal por porção
            </AppText>
          ) : null}
          {recipe.tags.length > 0 ? (
            <View style={styles.tags}>
              {recipe.tags.slice(0, 2).map((t) => (
                <Badge key={t} label={tagLabel(t)} />
              ))}
            </View>
          ) : null}
        </View>
        <View style={styles.fav}>
          <FavoriteButton favorite={favorite} onToggle={onToggleFavorite} recipeTitle={recipe.title} />
        </View>
      </View>
    </Card>
  );
});

/** Item Premium bloqueado: só o título, vindo da função `premium_teasers`. */
export function LockedItem({ title, kind }: { title: string; kind: 'receita' | 'exercicio' }) {
  return (
    <View style={styles.locked} accessibilityLabel={`${title}. Conteúdo Premium bloqueado.`}>
      <Ionicons name="lock-closed-outline" size={18} color={colors.roseDeep} />
      <AppText variant="small" style={styles.flex} numberOfLines={1}>
        {title}
      </AppText>
      <AppText variant="caption" color="textMuted">
        {kind === 'receita' ? 'Receita' : 'Exercício'}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md, padding: spacing.sm, alignItems: 'flex-start' },
  thumb: { width: 96, height: 96, borderRadius: radius.md },
  body: { flex: 1, gap: 4, paddingTop: 2 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 2 },
  fav: { marginTop: -6, marginRight: -6 },
  flex: { flex: 1 },
  locked: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 52,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
  },
});
