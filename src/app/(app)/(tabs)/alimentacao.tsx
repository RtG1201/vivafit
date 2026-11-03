import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LockedItem, RecipeCard, ScreenHeader } from '@/components/cards';
import { AppText, ChipGroup, ChipRow, EmptyState, ErrorState, ListCard, LoadingState, SectionHeader } from '@/components/ui';
import { useFavoriteRecipeIds, usePremiumTeasers, useRecipes, useToggleFavorite } from '@/hooks/queries';
import { DIET_TAGS, MEAL_TYPES } from '@/lib/labels';
import { EMPTY_FILTERS, filterRecipes, hasActiveFilters, QUICK_MINUTES, type MealFilter, type RecipeFilters } from '@/lib/recipes';
import { colors, fonts, layout, radius, spacing } from '@/theme';
import type { Recipe } from '@/types/database';

const MEAL_OPTIONS: { value: MealFilter; label: string }[] = [{ value: 'todas', label: 'Todas' }, ...MEAL_TYPES];
const MEAL_ORDER = MEAL_TYPES.map((m) => m.value);

const FAV = 'favoritas';
const QUICK = 'rapidas';
const EXTRA_FILTERS = [
  { value: FAV, label: 'Favoritas' },
  { value: QUICK, label: `Até ${QUICK_MINUTES} min` },
  ...DIET_TAGS,
];

export default function FoodScreen() {
  const recipes = useRecipes();
  const teasers = usePremiumTeasers();
  const favorites = useFavoriteRecipeIds();
  const toggleFavorite = useToggleFavorite();
  const [filters, setFilters] = useState<RecipeFilters>(EMPTY_FILTERS);

  const sorted = useMemo(
    () =>
      [...(recipes.data ?? [])].sort(
        (a, b) =>
          MEAL_ORDER.indexOf(a.meal_type) - MEAL_ORDER.indexOf(b.meal_type) ||
          a.prep_minutes - b.prep_minutes ||
          a.title.localeCompare(b.title, 'pt-BR'),
      ),
    [recipes.data],
  );
  const filtered = useMemo(() => filterRecipes(sorted, filters, favorites.ids), [sorted, filters, favorites.ids]);

  // Premium que a usuária não pode ver (a RLS esconde o conteúdo; aqui só os títulos).
  const locked = useMemo(() => {
    const visible = new Set((recipes.data ?? []).map((r) => r.id));
    return (teasers.data ?? []).filter((t) => t.kind === 'receita' && !visible.has(t.id));
  }, [teasers.data, recipes.data]);

  const selectedExtras = [
    ...(filters.favoritesOnly ? [FAV] : []),
    ...(filters.quickOnly ? [QUICK] : []),
    ...filters.tags,
  ];

  const toggleExtra = (value: string) =>
    setFilters((f) => {
      if (value === FAV) return { ...f, favoritesOnly: !f.favoritesOnly };
      if (value === QUICK) return { ...f, quickOnly: !f.quickOnly };
      return { ...f, tags: f.tags.includes(value) ? f.tags.filter((t) => t !== value) : [...f.tags, value] };
    });

  const openRecipe = useCallback((r: Recipe) => router.push({ pathname: '/receita/[id]', params: { id: r.id } }), []);
  const onToggleFavorite = useCallback(
    (r: Recipe) => toggleFavorite.mutate({ recipeId: r.id, favorite: !favorites.ids.has(r.id) }),
    [toggleFavorite, favorites.ids],
  );

  const header = (
    <View style={styles.header}>
      <ScreenHeader title="Alimentação" subtitle="Comida de casa, simples e do dia a dia." />

      <View style={styles.search}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          value={filters.query}
          onChangeText={(query) => setFilters((f) => ({ ...f, query }))}
          placeholder="Buscar por receita ou ingrediente"
          placeholderTextColor={colors.textMuted}
          accessibilityLabel="Buscar por receita ou ingrediente"
          returnKeyType="search"
          autoCorrect={false}
          style={styles.searchInput}
        />
      </View>

      <ChipRow
        options={MEAL_OPTIONS}
        value={filters.meal}
        onChange={(meal) => setFilters((f) => ({ ...f, meal }))}
        accessibilityLabel="Refeição"
      />
      <ChipGroup options={EXTRA_FILTERS} values={selectedExtras} onToggle={toggleExtra} scroll accessibilityLabel="Filtros" />

      {recipes.data ? (
        <AppText variant="caption" color="textMuted" accessibilityLiveRegion="polite">
          {filtered.length === 1 ? '1 receita' : `${filtered.length} receitas`} · nutrição estimada por porção
        </AppText>
      ) : null}
      {toggleFavorite.error ? (
        <AppText variant="caption" color="danger" accessibilityRole="alert">
          Não foi possível salvar a favorita. Verifique a conexão e tente de novo.
        </AppText>
      ) : null}
    </View>
  );

  const footer =
    locked.length > 0 ? (
      <View style={styles.footer}>
        <SectionHeader title="Receitas Premium" />
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

  const empty = recipes.isLoading ? (
    <LoadingState label="Buscando receitas…" />
  ) : recipes.error ? (
    <ErrorState error={recipes.error} onRetry={recipes.refetch} />
  ) : filters.favoritesOnly && favorites.ids.size === 0 ? (
    <EmptyState
      icon="heart-outline"
      title="Nenhuma favorita ainda"
      message="Toque no coração de uma receita para guardar as que você mais gosta."
      actionLabel="Ver todas as receitas"
      onAction={() => setFilters(EMPTY_FILTERS)}
    />
  ) : (
    <EmptyState
      icon="restaurant-outline"
      title="Nenhuma receita encontrada"
      message="Tente outra refeição, outro ingrediente ou remova algum filtro."
      actionLabel={hasActiveFilters(filters) ? 'Limpar filtros' : undefined}
      onAction={() => setFilters(EMPTY_FILTERS)}
    />
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={filtered}
        keyExtractor={(r) => r.id}
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item}
            favorite={favorites.ids.has(item.id)}
            onPress={() => openRecipe(item)}
            onToggleFavorite={() => onToggleFavorite(item)}
          />
        )}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        ListEmptyComponent={empty}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        refreshControl={
          <RefreshControl
            refreshing={recipes.isRefetching}
            onRefresh={() => {
              recipes.refetch();
              teasers.refetch();
              favorites.refetch();
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
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: 50,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
  },
  searchInput: { flex: 1, fontFamily: fonts.body, fontSize: 16, color: colors.text, paddingVertical: spacing.sm },
  sep: { height: spacing.sm },
  footer: { gap: spacing.sm, marginTop: spacing.lg },
});
