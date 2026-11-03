/// <reference types="jest" />
import { EMPTY_FILTERS, filterRecipes, hasActiveFilters, normalize, nutritionItems, recipeSummary, servingsLabel } from './recipes';

const base = { tags: [] as string[], ingredients: [] as { name: string; qty: string }[] };
const recipes = [
  { ...base, id: '1', title: 'Pão com ovo mexido', meal_type: 'cafe' as const, prep_minutes: 10, tags: ['vegetariana'], ingredients: [{ name: 'Ovos', qty: '2' }] },
  { ...base, id: '2', title: 'Feijão caseiro na pressão', meal_type: 'almoco' as const, prep_minutes: 40, tags: ['vegana', 'sem_gluten'] },
  { ...base, id: '3', title: 'Omelete de legumes', meal_type: 'jantar' as const, prep_minutes: 15, tags: ['vegetariana', 'sem_gluten'], ingredients: [{ name: 'Tomate', qty: '½' }] },
];

describe('filterRecipes', () => {
  it('sem filtros devolve tudo', () => {
    expect(filterRecipes(recipes, EMPTY_FILTERS)).toHaveLength(3);
  });

  it('filtra por refeição', () => {
    expect(filterRecipes(recipes, { ...EMPTY_FILTERS, meal: 'jantar' }).map((r) => r.id)).toEqual(['3']);
  });

  it('exige todas as restrições marcadas', () => {
    const r = filterRecipes(recipes, { ...EMPTY_FILTERS, tags: ['vegetariana', 'sem_gluten'] });
    expect(r.map((x) => x.id)).toEqual(['3']);
  });

  it('"rápidas" mantém até 15 minutos', () => {
    expect(filterRecipes(recipes, { ...EMPTY_FILTERS, quickOnly: true }).map((r) => r.id)).toEqual(['1', '3']);
  });

  it('favoritas usa a lista da usuária', () => {
    const r = filterRecipes(recipes, { ...EMPTY_FILTERS, favoritesOnly: true }, new Set(['2']));
    expect(r.map((x) => x.id)).toEqual(['2']);
  });

  it('busca ignora acento e caixa e procura nos ingredientes', () => {
    expect(filterRecipes(recipes, { ...EMPTY_FILTERS, query: 'FEIJAO' }).map((r) => r.id)).toEqual(['2']);
    expect(filterRecipes(recipes, { ...EMPTY_FILTERS, query: 'tomate' }).map((r) => r.id)).toEqual(['3']);
  });
});

describe('formatação', () => {
  it('porções no singular e plural', () => {
    expect(servingsLabel(1)).toBe('1 porção');
    expect(servingsLabel(4)).toBe('4 porções');
    expect(servingsLabel(null)).toBeNull();
  });

  it('resumo omite porções ausentes', () => {
    expect(recipeSummary({ prep_minutes: 10, servings: 2 })).toBe('10 min · 2 porções');
    expect(recipeSummary({ prep_minutes: 10, servings: null })).toBe('10 min');
  });

  it('nutrição mostra só valores existentes', () => {
    expect(nutritionItems({ calories: 200, protein: null, carbs: 30, fat: null }).map((n) => n.label)).toEqual(['Calorias', 'Carboidratos']);
  });

  it('normaliza texto e detecta filtros ativos', () => {
    expect(normalize(' Pão ')).toBe('pao');
    expect(hasActiveFilters(EMPTY_FILTERS)).toBe(false);
    expect(hasActiveFilters({ ...EMPTY_FILTERS, quickOnly: true })).toBe(true);
  });
});
