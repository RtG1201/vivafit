import type { MealType, Recipe } from '@/types/database';

/** Filtros da tela de Alimentação (funções puras, testadas em recipes.test.ts). */
export type MealFilter = 'todas' | MealType;

export type RecipeFilters = {
  meal: MealFilter;
  tags: string[];
  quickOnly: boolean;
  favoritesOnly: boolean;
  query: string;
};

export const QUICK_MINUTES = 15;

export const EMPTY_FILTERS: RecipeFilters = {
  meal: 'todas',
  tags: [],
  quickOnly: false,
  favoritesOnly: false,
  query: '',
};

/** Remove acentos e caixa para a busca ("feijao" encontra "Feijão"). */
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

type FilterableRecipe = Pick<Recipe, 'id' | 'title' | 'meal_type' | 'tags' | 'prep_minutes' | 'ingredients'>;

export function filterRecipes<T extends FilterableRecipe>(
  recipes: T[],
  filters: RecipeFilters,
  favoriteIds: ReadonlySet<string> = new Set(),
): T[] {
  const q = normalize(filters.query);
  return recipes.filter((r) => {
    if (filters.meal !== 'todas' && r.meal_type !== filters.meal) return false;
    if (!filters.tags.every((t) => r.tags.includes(t))) return false;
    if (filters.quickOnly && r.prep_minutes > QUICK_MINUTES) return false;
    if (filters.favoritesOnly && !favoriteIds.has(r.id)) return false;
    if (q) {
      const haystack = normalize([r.title, ...r.ingredients.map((i) => i.name)].join(' '));
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export function hasActiveFilters(f: RecipeFilters): boolean {
  return f.meal !== 'todas' || f.tags.length > 0 || f.quickOnly || f.favoritesOnly || f.query.trim() !== '';
}

export function servingsLabel(servings: number | null | undefined): string | null {
  if (!servings) return null;
  return servings === 1 ? '1 porção' : `${servings} porções`;
}

/** "10 min · 2 porções" */
export function recipeSummary(r: Pick<Recipe, 'prep_minutes' | 'servings'>): string {
  return [`${r.prep_minutes} min`, servingsLabel(r.servings)].filter(Boolean).join(' · ');
}

export type NutritionItem = { label: string; value: number; unit: string };

/** Só os valores que existem no banco (a informação nutricional é opcional). */
export function nutritionItems(r: Pick<Recipe, 'calories' | 'protein' | 'carbs' | 'fat'>): NutritionItem[] {
  const items: { label: string; value: number | null; unit: string }[] = [
    { label: 'Calorias', value: r.calories, unit: 'kcal' },
    { label: 'Proteínas', value: r.protein, unit: 'g' },
    { label: 'Carboidratos', value: r.carbs, unit: 'g' },
    { label: 'Gorduras', value: r.fat, unit: 'g' },
  ];
  return items.filter((n): n is NutritionItem => n.value != null);
}
