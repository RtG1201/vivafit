import { requireSupabase } from '@/lib/supabase';
import type { Announcement, Exercise, PremiumTeaser, Recipe } from '@/types/database';

/**
 * Conteúdo compartilhado (receitas, exercícios, avisos).
 * As regras RLS do banco já escondem itens Premium de quem está no plano gratuito.
 */

export async function fetchRecipes(): Promise<Recipe[]> {
  const { data, error } = await requireSupabase()
    .from('recipes')
    .select('*')
    .eq('published', true)
    .order('title');
  if (error) throw error;
  return data ?? [];
}

export async function fetchRecipe(id: string): Promise<Recipe | null> {
  const { data, error } = await requireSupabase()
    .from('recipes')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchExercises(): Promise<Exercise[]> {
  const { data, error } = await requireSupabase()
    .from('exercises')
    .select('*')
    .eq('published', true)
    .order('duration_minutes');
  if (error) throw error;
  return data ?? [];
}

export async function fetchExercise(id: string): Promise<Exercise | null> {
  const { data, error } = await requireSupabase()
    .from('exercises')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/** Títulos de conteúdos Premium (sem o conteúdo em si) para exibir como bloqueados. */
export async function fetchPremiumTeasers(): Promise<PremiumTeaser[]> {
  const { data, error } = await requireSupabase().rpc('premium_teasers');
  if (error) throw error;
  return data ?? [];
}

export async function fetchActiveAnnouncement(): Promise<Announcement | null> {
  const { data, error } = await requireSupabase()
    .from('announcements')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}
