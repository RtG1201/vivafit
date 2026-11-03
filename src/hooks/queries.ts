import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { addDays, toISODate } from '@/lib/dates';
import { computeAchievements, currentStreak, longestStreak } from '@/lib/gamification';
import { useAuth } from '@/providers/AuthProvider';
import * as content from '@/services/content';
import * as favorites from '@/services/favorites';
import * as tracking from '@/services/tracking';
import type { Habit } from '@/types/database';

export const queryKeys = {
  profile: (userId: string) => ['profile', userId] as const,
  recipes: ['recipes'] as const,
  recipe: (id: string) => ['recipe', id] as const,
  exercises: ['exercises'] as const,
  exercise: (id: string) => ['exercise', id] as const,
  teasers: ['premium-teasers'] as const,
  announcement: ['announcement'] as const,
  habits: (userId: string) => ['habits', userId] as const,
  habitLogs: (userId: string) => ['habit-logs', userId] as const,
  activity: (userId: string) => ['activity', userId] as const,
  planning: (userId: string) => ['planning-counts', userId] as const,
  favorites: (userId: string) => ['recipe-favorites', userId] as const,
};

/** Janela de histórico usada para sequência, calendário e conquistas. */
const HISTORY_DAYS = 120;

function useUserId() {
  const { user } = useAuth();
  return user?.id ?? '';
}

// ---------- Conteúdo ----------

export const useRecipes = () => useQuery({ queryKey: queryKeys.recipes, queryFn: content.fetchRecipes });
export const useRecipe = (id: string) =>
  useQuery({ queryKey: queryKeys.recipe(id), queryFn: () => content.fetchRecipe(id), enabled: !!id });
export const useExercises = () => useQuery({ queryKey: queryKeys.exercises, queryFn: content.fetchExercises });
export const useExercise = (id: string) =>
  useQuery({ queryKey: queryKeys.exercise(id), queryFn: () => content.fetchExercise(id), enabled: !!id });
export const usePremiumTeasers = () => useQuery({ queryKey: queryKeys.teasers, queryFn: content.fetchPremiumTeasers });
export const useAnnouncement = () =>
  useQuery({ queryKey: queryKeys.announcement, queryFn: content.fetchActiveAnnouncement });

// ---------- Dados da usuária ----------

export function useProfile() {
  const userId = useUserId();
  return useQuery({
    queryKey: queryKeys.profile(userId),
    queryFn: () => tracking.fetchProfile(userId),
    enabled: !!userId,
  });
}

export function useHabits() {
  const userId = useUserId();
  return useQuery({ queryKey: queryKeys.habits(userId), queryFn: tracking.fetchHabits, enabled: !!userId });
}

export function useHabitLogs() {
  const userId = useUserId();
  return useQuery({
    queryKey: queryKeys.habitLogs(userId),
    queryFn: () => tracking.fetchHabitLogsSince(toISODate(addDays(new Date(), -HISTORY_DAYS))),
    enabled: !!userId,
  });
}

export function useActivityLogs() {
  const userId = useUserId();
  return useQuery({ queryKey: queryKeys.activity(userId), queryFn: () => tracking.fetchActivityLogs(), enabled: !!userId });
}

export function usePlanningCounts() {
  const userId = useUserId();
  return useQuery({ queryKey: queryKeys.planning(userId), queryFn: tracking.fetchPlanningCounts, enabled: !!userId });
}

export function useToggleHabit() {
  const userId = useUserId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ habit, done }: { habit: Habit; done: boolean }) => tracking.setHabitDone(habit, done),
    onSettled: () => qc.invalidateQueries({ queryKey: queryKeys.habitLogs(userId) }),
  });
}

export function useLogActivity() {
  const userId = useUserId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: tracking.logActivity,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.activity(userId) }),
  });
}

export function useUpdateName() {
  const userId = useUserId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => tracking.updateProfileName(userId, name),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.profile(userId) }),
  });
}

// ---------- Favoritos de receitas ----------

export function useFavoriteRecipeIds() {
  const userId = useUserId();
  const query = useQuery({
    queryKey: queryKeys.favorites(userId),
    queryFn: favorites.fetchFavoriteRecipeIds,
    enabled: !!userId,
  });
  const ids = useMemo(() => new Set(query.data ?? []), [query.data]);
  return { ...query, ids };
}

/** Marca/desmarca favorito com atualização otimista (o coração muda na hora). */
export function useToggleFavorite() {
  const userId = useUserId();
  const qc = useQueryClient();
  const key = queryKeys.favorites(userId);
  return useMutation({
    mutationFn: ({ recipeId, favorite }: { recipeId: string; favorite: boolean }) =>
      favorites.setRecipeFavorite(recipeId, favorite),
    onMutate: async ({ recipeId, favorite }) => {
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<string[]>(key) ?? [];
      const next = favorite ? [...new Set([...previous, recipeId])] : previous.filter((id) => id !== recipeId);
      qc.setQueryData(key, next);
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx) qc.setQueryData(key, ctx.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: key }),
  });
}

// ---------- Progresso derivado ----------

/**
 * Junta atividades e hábitos para calcular sequência, semana, calendário e conquistas.
 * Um "dia ativo" é qualquer dia com treino/atividade registrada ou hábito marcado.
 */
export function useProgress() {
  const habits = useHabits();
  const logs = useHabitLogs();
  const activity = useActivityLogs();
  const planning = usePlanningCounts();

  const data = useMemo(() => {
    const habitList = habits.data ?? [];
    const habitLogs = (logs.data ?? []).filter((l) => l.value > 0);
    const activities = activity.data ?? [];

    const activeDates = new Set<string>([...activities.map((a) => a.date), ...habitLogs.map((l) => l.date)]);
    const today = toISODate(new Date());

    // Dias em que todos os hábitos foram concluídos.
    const doneByDate = new Map<string, Set<string>>();
    for (const l of habitLogs) {
      const habit = habitList.find((h) => h.id === l.habit_id);
      if (!habit || l.value < habit.target) continue;
      if (!doneByDate.has(l.date)) doneByDate.set(l.date, new Set());
      doneByDate.get(l.date)!.add(l.habit_id);
    }
    const habitDaysCompleted =
      habitList.length === 0 ? 0 : [...doneByDate.values()].filter((s) => s.size >= habitList.length).length;

    const totalMinutes = activities.reduce((sum, a) => sum + (a.minutes ?? 0), 0);
    const workouts = activities.length;
    const dates = [...activeDates];

    const stats = {
      workouts,
      totalMinutes,
      longestStreak: longestStreak(dates),
      habitDaysCompleted,
      mealsPlanned: planning.data?.mealsPlanned ?? 0,
      goalsDone: planning.data?.goalsDone ?? 0,
    };

    const todayHabitIds = new Set(
      habitLogs.filter((l) => l.date === today).map((l) => l.habit_id),
    );

    return {
      activeDates,
      streak: currentStreak(dates),
      stats,
      achievements: computeAchievements(stats),
      todayMinutes: activities.filter((a) => a.date === today).reduce((s, a) => s + a.minutes, 0),
      todayHabitIds,
      recentActivities: activities.slice(0, 10),
    };
  }, [habits.data, logs.data, activity.data, planning.data]);

  return {
    ...data,
    habits: habits.data ?? [],
    isLoading: habits.isLoading || logs.isLoading || activity.isLoading,
    error: habits.error ?? logs.error ?? activity.error ?? planning.error,
    refetch: async () => {
      await Promise.all([habits.refetch(), logs.refetch(), activity.refetch(), planning.refetch()]);
    },
  };
}
