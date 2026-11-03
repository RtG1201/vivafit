import { requireSupabase } from '@/lib/supabase';

/**
 * Favoritos de receitas (tabela recipe_favorites).
 * `user_id` é preenchido pelo banco com auth.uid() e a RLS garante que cada
 * usuária só leia, crie e apague os próprios favoritos.
 */

export async function fetchFavoriteRecipeIds(): Promise<string[]> {
  const { data, error } = await requireSupabase().from('recipe_favorites').select('recipe_id');
  if (error) throw error;
  return (data ?? []).map((f) => f.recipe_id);
}

export async function setRecipeFavorite(recipeId: string, favorite: boolean) {
  const db = requireSupabase();
  if (favorite) {
    const { error } = await db
      .from('recipe_favorites')
      .upsert({ recipe_id: recipeId }, { onConflict: 'user_id,recipe_id', ignoreDuplicates: true });
    if (error) throw error;
  } else {
    const { error } = await db.from('recipe_favorites').delete().eq('recipe_id', recipeId);
    if (error) throw error;
  }
}
