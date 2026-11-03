import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { FavoriteButton, RecipePhoto } from '@/components/cards';
import { AppText, Badge, Card, EmptyState, ErrorState, LoadingState, Overline, Screen, SectionHeader } from '@/components/ui';
import { useFavoriteRecipeIds, useRecipe, useToggleFavorite } from '@/hooks/queries';
import { mealLabel, tagLabel } from '@/lib/labels';
import { nutritionItems, servingsLabel } from '@/lib/recipes';
import { colors, radius, spacing } from '@/theme';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipe = useRecipe(id ?? '');
  const favorites = useFavoriteRecipeIds();
  const toggleFavorite = useToggleFavorite();
  // Lista de conferência: a usuária marca o que já tem em casa (só nesta tela).
  const [haveIt, setHaveIt] = useState<Set<number>>(new Set());

  if (recipe.isLoading) return <Screen edges={[]}><LoadingState /></Screen>;
  if (recipe.error) return <Screen edges={[]}><ErrorState error={recipe.error} onRetry={recipe.refetch} /></Screen>;
  if (!recipe.data) {
    return (
      <Screen edges={[]}>
        <EmptyState icon="restaurant-outline" title="Receita indisponível" message="Ela pode ter sido retirada do cardápio ou fazer parte do plano Premium." />
      </Screen>
    );
  }

  const r = recipe.data;
  const isFavorite = favorites.ids.has(r.id);
  const nutrition = nutritionItems(r);
  const servings = servingsLabel(r.servings);
  const toggle = () => toggleFavorite.mutate({ recipeId: r.id, favorite: !isFavorite });
  const toggleIngredient = (i: number) =>
    setHaveIt((cur) => {
      const next = new Set(cur);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <Screen edges={['bottom']}>
      <Stack.Screen
        options={{
          title: mealLabel(r.meal_type),
          headerRight: () => <FavoriteButton favorite={isFavorite} onToggle={toggle} recipeTitle={r.title} />,
        }}
      />

      <RecipePhoto uri={r.image_url} mealType={r.meal_type} title={r.title} style={styles.hero} showPendingLabel iconSize={44} />

      <View style={styles.header}>
        <Overline>{mealLabel(r.meal_type)}</Overline>
        <AppText variant="title" accessibilityRole="header">
          {r.title}
        </AppText>
        {r.description ? (
          <AppText variant="body" color="textMuted">
            {r.description}
          </AppText>
        ) : null}
      </View>

      <View style={styles.pills}>
        <Pill icon="time-outline" label={`${r.prep_minutes} min`} />
        {servings ? <Pill icon="people-outline" label={servings} /> : null}
        {r.calories != null ? <Pill icon="flame-outline" label={`≈ ${r.calories} kcal/porção`} /> : null}
      </View>
      {r.tags.length > 0 ? (
        <View style={styles.tags}>
          {r.tags.map((t) => (
            <Badge key={t} label={tagLabel(t)} />
          ))}
        </View>
      ) : null}

      <SectionHeader title="Ingredientes" />
      <AppText variant="caption" color="textMuted">
        Toque para marcar o que você já tem em casa.
      </AppText>
      <View style={styles.list}>
        {r.ingredients.map((ing, i) => {
          const checked = haveIt.has(i);
          return (
            <Pressable
              key={`${ing.name}-${i}`}
              accessibilityRole="checkbox"
              accessibilityState={{ checked }}
              accessibilityLabel={`${ing.qty} de ${ing.name}`}
              onPress={() => toggleIngredient(i)}
              style={({ pressed }) => [styles.ingredient, pressed && { opacity: 0.85 }]}
            >
              <View style={[styles.check, checked && styles.checkOn]}>
                {checked ? <Ionicons name="checkmark" size={16} color={colors.textStrong} /> : null}
              </View>
              <AppText variant="body" style={[styles.flex, checked && styles.done]}>
                {ing.name}
              </AppText>
              <AppText variant="small" color="textMuted" style={styles.qty}>
                {ing.qty}
              </AppText>
            </Pressable>
          );
        })}
      </View>
      {r.ingredients.length > 0 && haveIt.size === r.ingredients.length ? (
        <Card tone="sage" style={styles.ready}>
          <AppText variant="smallStrong" color="textStrong">
            Tudo separado. Bora para o fogão!
          </AppText>
        </Card>
      ) : null}

      <SectionHeader title="Modo de preparo" />
      <View style={styles.steps}>
        {r.steps.map((s, i) => (
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

      {nutrition.length > 0 ? (
        <Card tone="muted">
          <Overline color="textMuted">Informação nutricional estimada · por porção</Overline>
          <View style={styles.nutrition}>
            {nutrition.map((n) => (
              <View key={n.label} style={styles.nutriItem}>
                <AppText variant="heading">
                  {n.value}
                  <AppText variant="small"> {n.unit}</AppText>
                </AppText>
                <AppText variant="caption" color="textMuted">
                  {n.label}
                </AppText>
              </View>
            ))}
          </View>
          <AppText variant="caption" color="textMuted">
            Valores aproximados. Variam conforme marcas e quantidades usadas.
          </AppText>
        </Card>
      ) : null}

      {toggleFavorite.error ? (
        <AppText variant="caption" color="danger" accessibilityRole="alert">
          Não foi possível salvar a favorita. Verifique a conexão e tente de novo.
        </AppText>
      ) : null}
    </Screen>
  );
}

function Pill({ icon, label }: { icon: 'time-outline' | 'people-outline' | 'flame-outline'; label: string }) {
  return (
    <View style={styles.pill}>
      <Ionicons name={icon} size={15} color={colors.textStrong} />
      <AppText variant="caption" color="textStrong" style={styles.pillText}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  hero: { width: '100%', aspectRatio: 16 / 10, borderRadius: radius.lg },
  header: { gap: spacing.xs },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.sageTint,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  pillText: { fontFamily: 'DMSans_600SemiBold' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  list: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.divider,
    overflow: 'hidden',
    gap: 1,
  },
  ingredient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 52,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surface,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: { backgroundColor: colors.sage, borderColor: colors.sage },
  done: { color: colors.textMuted },
  qty: { maxWidth: '45%', textAlign: 'right' },
  ready: { paddingVertical: spacing.sm },
  steps: { gap: spacing.md },
  step: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  stepNum: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.terracottaTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nutrition: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  nutriItem: { minWidth: '40%', flexGrow: 1 },
});
