import { DIET_TAGS, equipmentLabel, tagLabel } from '@/lib/labels';
import type { Exercise, Profile } from '@/types/database';

/** Questionário inicial: opções, rótulos e o resumo do plano (funções puras, testadas em onboarding.test.ts). */

type Option<T extends string = string> = { value: T; label: string };

export const GOAL_OPTIONS: Option[] = [
  { value: 'emagrecer', label: 'Emagrecer com saúde' },
  { value: 'energia', label: 'Ter mais energia' },
  { value: 'fortalecer', label: 'Fortalecer o corpo' },
  { value: 'comer_melhor', label: 'Comer melhor' },
  { value: 'aliviar_dores', label: 'Aliviar dores e tensão' },
  { value: 'rotina', label: 'Criar uma rotina' },
];
export const MAX_GOALS = 2;

export const ACTIVITY_OPTIONS: Option[] = [
  { value: 'sedentaria', label: 'Quase não me exercito' },
  { value: 'comecando', label: 'Estou começando agora' },
  { value: 'leve', label: '1 a 2 vezes por semana' },
  { value: 'ativa', label: '3 vezes ou mais por semana' },
];

/** Níveis que contam como iniciante na sugestão de treino. */
export const BEGINNER_LEVELS = ['sedentaria', 'comecando', 'leve'];

export const MINUTES_OPTIONS = [10, 15, 20, 30, 45] as const;

export const EQUIPMENT_OPTIONS: Option[] = [
  { value: 'nenhum', label: 'Nada, só o corpo' },
  { value: 'colchonete', label: 'Colchonete' },
  { value: 'halteres', label: 'Halteres ou garrafas' },
  { value: 'elastico', label: 'Elástico' },
  { value: 'cadeira', label: 'Cadeira firme' },
];

export const DIET_OPTIONS: Option[] = DIET_TAGS;

export type OnboardingAnswers = Pick<Profile, 'goals' | 'activity_level' | 'minutes_available' | 'equipment' | 'diet_prefs'>;

export const EMPTY_ANSWERS: OnboardingAnswers = {
  goals: [],
  activity_level: null,
  minutes_available: null,
  equipment: [],
  diet_prefs: [],
};

/** Respostas já salvas no perfil, para editar a partir do Perfil. */
export function answersFromProfile(profile: Profile | null | undefined): OnboardingAnswers {
  if (!profile) return EMPTY_ANSWERS;
  return {
    goals: profile.goals ?? [],
    activity_level: profile.activity_level,
    minutes_available: profile.minutes_available,
    equipment: profile.equipment ?? [],
    diet_prefs: profile.diet_prefs ?? [],
  };
}

const labelOf = (options: Option[], value: string) => options.find((o) => o.value === value)?.label ?? value;

export const goalLabel = (v: string) => labelOf(GOAL_OPTIONS, v);
export const activityLabel = (v: string) => labelOf(ACTIVITY_OPTIONS, v);
export const equipmentOptionLabel = (v: string) =>
  EQUIPMENT_OPTIONS.some((o) => o.value === v) ? labelOf(EQUIPMENT_OPTIONS, v) : equipmentLabel(v);

/** Lista em português: "a", "a e b", "a, b e c". */
export function joinPt(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} e ${items[items.length - 1]}`;
}

export function isBeginner(activityLevel: string | null | undefined): boolean {
  return !activityLevel || BEGINNER_LEVELS.includes(activityLevel);
}

/** Frases do plano mostradas ao final do questionário: cada resposta vira uma linha. */
export function planSummary(a: OnboardingAnswers): string[] {
  const lines: string[] = [];
  const minutes = a.minutes_available ? `de até ${a.minutes_available} min` : 'curtos';
  lines.push(`Treinos ${minutes}, nível ${isBeginner(a.activity_level) ? 'iniciante' : 'intermediário'}`);

  const gear = a.equipment.filter((e) => e !== 'nenhum');
  lines.push(gear.length ? `Com ${joinPt(gear.map((e) => equipmentOptionLabel(e).toLowerCase()))}` : 'Sem precisar de equipamento');

  lines.push(
    a.diet_prefs.length
      ? `Receitas já filtradas: ${joinPt(a.diet_prefs.map((t) => tagLabel(t).toLowerCase()))}`
      : 'Todas as receitas, sem restrição',
  );

  if (a.goals.length) lines.push(`Foco em: ${joinPt(a.goals.map((g) => goalLabel(g).toLowerCase()))}`);
  return lines;
}

/** O exercício pode ser feito com o que a usuária tem? Sem equipamentos informados, aceita só os sem equipamento. */
export function fitsEquipment(exercise: Pick<Exercise, 'equipment'>, owned: string[]): boolean {
  const need = (exercise.equipment ?? '').trim().toLowerCase();
  if (!need || need === 'nenhum' || need === 'nenhuma') return true;
  return owned.some((o) => o.toLowerCase() === need);
}
