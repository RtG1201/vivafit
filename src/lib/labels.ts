import type { ExerciseCategory, ExerciseLevel, MealType } from '@/types/database';

/** Rótulos em português para os valores salvos no banco. */

export const MEAL_TYPES: { value: MealType; label: string }[] = [
  { value: 'cafe', label: 'Café da manhã' },
  { value: 'almoco', label: 'Almoço' },
  { value: 'lanche', label: 'Lanche' },
  { value: 'jantar', label: 'Jantar' },
];
export const mealLabel = (v: string) => MEAL_TYPES.find((m) => m.value === v)?.label ?? v;

export const EXERCISE_CATEGORIES: { value: ExerciseCategory; label: string }[] = [
  { value: 'iniciante', label: 'Iniciantes' },
  { value: 'sem_equipamento', label: 'Sem equipamento' },
  { value: 'forca', label: 'Força' },
  { value: 'mobilidade', label: 'Mobilidade' },
  { value: 'alongamento', label: 'Alongamento' },
];
export const categoryLabel = (v: string) => EXERCISE_CATEGORIES.find((c) => c.value === v)?.label ?? v;

export const LEVELS: Record<ExerciseLevel, { label: string; step: 1 | 2 | 3 }> = {
  iniciante: { label: 'Iniciante', step: 1 },
  intermediario: { label: 'Intermediário', step: 2 },
  avancado: { label: 'Avançado', step: 3 },
};

export const DIET_TAGS: { value: string; label: string }[] = [
  { value: 'vegetariana', label: 'Vegetariana' },
  { value: 'vegana', label: 'Vegana' },
  { value: 'sem_gluten', label: 'Sem glúten' },
  { value: 'sem_lactose', label: 'Sem lactose' },
  { value: 'low_carb', label: 'Low carb' },
];
export const tagLabel = (v: string) => DIET_TAGS.find((t) => t.value === v)?.label ?? v;

export function equipmentLabel(v: string): string {
  if (!v || v === 'nenhum') return 'Sem equipamento';
  return v.charAt(0).toUpperCase() + v.slice(1);
}

export const PLAN_LABEL = { free: 'Gratuito', premium: 'Premium' } as const;
