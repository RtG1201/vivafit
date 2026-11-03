/**
 * Regras de gamificação (funções puras, testadas em gamification.test.ts).
 * Mesma lógica do projeto Leve em Casa, para que web e app mostrem os mesmos números.
 */
import { addDays, toISODate } from './dates';

/** Dias seguidos com atividade, terminando hoje (ou ontem, se hoje ainda não teve registro). */
export function currentStreak(activeDates: string[], today: Date = new Date()): number {
  const set = new Set(activeDates);
  let cursor = new Date(today);
  if (!set.has(toISODate(cursor))) cursor = addDays(cursor, -1);
  let streak = 0;
  while (set.has(toISODate(cursor))) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function longestStreak(activeDates: string[]): number {
  const sorted = [...new Set(activeDates)].sort();
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const d of sorted) {
    if (prev && toISODate(addDays(new Date(`${prev}T12:00:00`), 1)) === d) run++;
    else run = 1;
    best = Math.max(best, run);
    prev = d;
  }
  return best;
}

export const WEEKLY_ACTIVE_DAYS_GOAL = 4;

export type Stats = {
  workouts: number;
  totalMinutes: number;
  longestStreak: number;
  habitDaysCompleted: number;
  mealsPlanned: number;
  goalsDone: number;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  progress: number; // 0..1
};

export function computeAchievements(s: Stats): Achievement[] {
  const list: [string, string, string, number, number][] = [
    ['first', 'Primeiro passo', 'Concluir o primeiro treino', s.workouts, 1],
    ['ten', 'Constância', 'Concluir 10 treinos', s.workouts, 10],
    ['hour', 'Uma hora em movimento', 'Somar 60 minutos de atividade', s.totalMinutes, 60],
    ['streak3', 'Três dias seguidos', 'Manter uma sequência de 3 dias', s.longestStreak, 3],
    ['streak7', 'Semana completa', 'Manter uma sequência de 7 dias', s.longestStreak, 7],
    ['habits', 'Hábitos em dia', 'Completar hábitos em 5 dias', s.habitDaysCompleted, 5],
    ['planner', 'Organizada', 'Planejar 7 refeições', s.mealsPlanned, 7],
    ['goal', 'Meta alcançada', 'Concluir uma meta pessoal', s.goalsDone, 1],
  ];
  return list.map(([id, title, description, value, target]) => ({
    id,
    title,
    description,
    unlocked: value >= target,
    progress: Math.max(0, Math.min(1, value / target)),
  }));
}

const MESSAGES = [
  'Cada pequeno passo conta. Você está construindo algo para você.',
  'Movimento é cuidado, não punição.',
  'Constância vale mais que perfeição.',
  'Respire fundo. Hoje é um bom dia para se cuidar.',
  'Seu ritmo é o ritmo certo.',
  'Celebre o que você já fez esta semana.',
  'Descansar também faz parte do processo.',
];

export function motivationalMessage(today: Date = new Date()): string {
  const idx = Math.floor(today.getTime() / 86_400_000) % MESSAGES.length;
  return MESSAGES[idx];
}
