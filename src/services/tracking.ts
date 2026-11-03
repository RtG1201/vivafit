import { toISODate } from '@/lib/dates';
import { requireSupabase } from '@/lib/supabase';
import type { ActivityLog, Habit, HabitLog, Profile } from '@/types/database';

/**
 * Dados da própria usuária. O banco preenche `user_id` com auth.uid()
 * e as regras RLS garantem que cada conta só veja e altere as próprias linhas.
 */

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await requireSupabase().from('profiles').select('*').eq('id', userId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateProfileName(userId: string, name: string) {
  const { error } = await requireSupabase().from('profiles').update({ name: name.trim() }).eq('id', userId);
  if (error) throw error;
}

export async function fetchHabits(): Promise<Habit[]> {
  const { data, error } = await requireSupabase().from('habits').select('*').order('created_at');
  if (error) throw error;
  return data ?? [];
}

/** Linhas por página: abaixo do limite padrão de 1000 linhas por consulta do Supabase. */
const PAGE_SIZE = 500;

/** Busca todas as páginas de uma consulta ordenada (o histórico completo alimenta as conquistas). */
async function fetchAllPages<T>(
  page: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: unknown }>,
): Promise<T[]> {
  const rows: T[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await page(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE_SIZE) return rows;
  }
}

/** Todos os registros de hábitos da usuária. */
export function fetchHabitLogs(): Promise<HabitLog[]> {
  return fetchAllPages((from, to) =>
    requireSupabase().from('habit_logs').select('*').order('date').order('id').range(from, to),
  );
}

/** Marca (ou desmarca) um hábito como feito hoje. */
export async function setHabitDone(habit: Habit, done: boolean, date: string = toISODate(new Date())) {
  const db = requireSupabase();
  if (done) {
    const { error } = await db
      .from('habit_logs')
      .upsert({ habit_id: habit.id, date, value: habit.target }, { onConflict: 'habit_id,date' });
    if (error) throw error;
  } else {
    const { error } = await db.from('habit_logs').delete().eq('habit_id', habit.id).eq('date', date);
    if (error) throw error;
  }
}

/** Todas as atividades da usuária, da mais recente para a mais antiga. */
export function fetchActivityLogs(): Promise<ActivityLog[]> {
  return fetchAllPages((from, to) =>
    requireSupabase()
      .from('activity_logs')
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
      .order('id')
      .range(from, to),
  );
}

export async function logActivity(input: { title: string; minutes: number; exerciseId?: string | null }) {
  const { error } = await requireSupabase().from('activity_logs').insert({
    title: input.title,
    minutes: Math.max(0, Math.round(input.minutes)),
    exercise_id: input.exerciseId ?? null,
    date: toISODate(new Date()),
  });
  if (error) throw error;
}

/** Contagens usadas nas conquistas (sem baixar as linhas). */
export async function fetchPlanningCounts(): Promise<{ mealsPlanned: number; goalsDone: number }> {
  const db = requireSupabase();
  const [meals, goals] = await Promise.all([
    db.from('meal_plans').select('id', { count: 'exact', head: true }),
    db.from('goals').select('id', { count: 'exact', head: true }).eq('done', true),
  ]);
  if (meals.error) throw meals.error;
  if (goals.error) throw goals.error;
  return { mealsPlanned: meals.count ?? 0, goalsDone: goals.count ?? 0 };
}
