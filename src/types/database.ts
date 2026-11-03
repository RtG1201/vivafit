/**
 * Tipos do banco existente (projeto Leve em Casa, Supabase).
 * Escritos à mão a partir da migração atual — o app NÃO altera o esquema.
 * Quando houver acesso à CLI do Supabase, substitua por tipos gerados:
 *   npx supabase gen types typescript --project-id <id> > src/types/database.ts
 */

type Timestamp = string; // ISO 8601
type ISODate = string; // YYYY-MM-DD

export type MealType = 'cafe' | 'almoco' | 'jantar' | 'lanche';
export type ExerciseCategory = 'iniciante' | 'sem_equipamento' | 'mobilidade' | 'alongamento' | 'forca';
export type ExerciseLevel = 'iniciante' | 'intermediario' | 'avancado';
export type Plan = 'free' | 'premium';
export type AppRole = 'admin' | 'user';

export type Ingredient = {
  name: string;
  qty: string;
};

export type Profile = {
  id: string;
  name: string;
  age: number | null;
  goals: string[];
  diet_prefs: string[];
  activity_level: string | null;
  minutes_available: number | null;
  equipment: string[];
  onboarded: boolean;
  plan: Plan;
  created_at: Timestamp;
};

export type Recipe = {
  id: string;
  title: string;
  description: string;
  meal_type: MealType;
  prep_minutes: number;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  tags: string[];
  ingredients: Ingredient[];
  steps: string[];
  premium: boolean;
  published: boolean;
  created_at: Timestamp;
  /** Porções que a receita rende (migração 20261101120000). */
  servings: number | null;
  /** URL pública da foto do prato; null enquanto não houver foto. */
  image_url: string | null;
};

/** Receita marcada como favorita por uma usuária (RLS: cada uma só vê as próprias). */
export type RecipeFavorite = {
  user_id: string;
  recipe_id: string;
  created_at: Timestamp;
};

export type Exercise = {
  id: string;
  name: string;
  description: string;
  category: ExerciseCategory;
  level: ExerciseLevel;
  duration_minutes: number;
  equipment: string;
  steps: string[];
  video_url: string | null;
  premium: boolean;
  published: boolean;
  created_at: Timestamp;
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  active: boolean;
  created_at: Timestamp;
};

export type Habit = {
  id: string;
  user_id: string;
  name: string;
  target: number;
  unit: string;
  created_at: Timestamp;
};

export type HabitLog = {
  id: string;
  user_id: string;
  habit_id: string;
  date: ISODate;
  value: number;
};

export type ActivityLog = {
  id: string;
  user_id: string;
  exercise_id: string | null;
  title: string;
  minutes: number;
  date: ISODate;
  created_at: Timestamp;
};

export type Goal = {
  id: string;
  user_id: string;
  title: string;
  done: boolean;
  due_date: ISODate | null;
  created_at: Timestamp;
};

export type MealPlan = {
  id: string;
  user_id: string;
  date: ISODate;
  meal_type: MealType;
  recipe_id: string;
};

export type PremiumTeaser = {
  id: string;
  title: string;
  kind: 'receita' | 'exercicio';
};

/** Linha completa -> formato aceito em insert/update (campos com default viram opcionais). */
type Table<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<Profile, Partial<Profile> & { id: string }>;
      recipes: Table<Recipe>;
      exercises: Table<Exercise>;
      announcements: Table<Announcement>;
      habits: Table<Habit, Partial<Habit> & { name: string }>;
      habit_logs: Table<HabitLog, Partial<HabitLog> & { habit_id: string }>;
      activity_logs: Table<ActivityLog, Partial<ActivityLog> & { title: string }>;
      goals: Table<Goal, Partial<Goal> & { title: string }>;
      meal_plans: Table<MealPlan, Partial<MealPlan> & { date: ISODate; meal_type: MealType; recipe_id: string }>;
      recipe_favorites: Table<RecipeFavorite, Partial<RecipeFavorite> & { recipe_id: string }>;
    };
    Views: { [_ in never]: never };
    Functions: {
      has_role: { Args: { _user_id: string; _role: AppRole }; Returns: boolean };
      is_premium: { Args: { _user_id: string }; Returns: boolean };
      premium_teasers: { Args: Record<string, never>; Returns: PremiumTeaser[] };
      /** Apaga os dados e a conta de quem chamou (migração 20261103120000). */
      delete_own_account: { Args: Record<string, never>; Returns: undefined };
    };
    Enums: { app_role: AppRole };
    CompositeTypes: { [_ in never]: never };
  };
};
