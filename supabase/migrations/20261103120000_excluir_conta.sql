-- Vivafit · Exclusão de conta pelo próprio app (exigência da App Store e do Google Play)
-- Cria a função delete_own_account(): apaga SOMENTE os dados de quem chamou (auth.uid())
-- e depois a própria conta em auth.users. Não altera nenhuma outra tabela nem dado de outras usuárias.
begin;

create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;

  -- Dados da usuária (as tabelas que existirem; ordem: filhos antes dos pais)
  if to_regclass('public.recipe_favorites') is not null then delete from public.recipe_favorites where user_id = uid; end if;
  if to_regclass('public.habit_logs') is not null then delete from public.habit_logs where user_id = uid; end if;
  if to_regclass('public.habits') is not null then delete from public.habits where user_id = uid; end if;
  if to_regclass('public.activity_logs') is not null then delete from public.activity_logs where user_id = uid; end if;
  if to_regclass('public.meal_plans') is not null then delete from public.meal_plans where user_id = uid; end if;
  if to_regclass('public.goals') is not null then delete from public.goals where user_id = uid; end if;
  if to_regclass('public.user_roles') is not null then delete from public.user_roles where user_id = uid; end if;
  if to_regclass('public.profiles') is not null then delete from public.profiles where id = uid; end if;

  -- Por último, a conta de login
  delete from auth.users where id = uid;
end;
$$;

revoke all on function public.delete_own_account() from public, anon;
grant execute on function public.delete_own_account() to authenticated;

commit;
