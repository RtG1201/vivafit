"""
Gera supabase/migrations/20261101120000_receitas_brasileiras.sql a partir da lista abaixo.

Uso:  python3 supabase/seed/receitas_brasileiras.py
Valores nutricionais são ESTIMATIVAS por porção, calculadas a partir de tabelas
de composição de alimentos (ex.: TACO) para as medidas indicadas.
"""
import json
from pathlib import Path

R = []


def receita(meal, title, description, minutes, servings, nutri, tags, ingredients, steps):
    kcal, prot, carb, fat = nutri
    R.append(dict(meal=meal, title=title, description=description, minutes=minutes, servings=servings,
                  kcal=kcal, prot=prot, carb=carb, fat=fat, tags=tags,
                  ingredients=[{"name": n, "qty": q} for n, q in ingredients], steps=steps))


# ---------------- Café da manhã ----------------
receita('cafe', 'Pão com ovo mexido', 'O clássico da padaria, feito em casa em poucos minutos.', 10, 1,
        (330, 17, 30, 15), ['vegetariana'],
        [('Pão francês', '1 unidade'), ('Ovos', '2 unidades'), ('Manteiga ou óleo', '1 colher (chá)'), ('Sal', 'a gosto')],
        ['Bata os ovos com uma pitada de sal.',
         'Aqueça a manteiga numa frigideira em fogo baixo e despeje os ovos.',
         'Mexa devagar até ficarem cremosos e cozidos.',
         'Abra o pão, recheie com o ovo e sirva.'])
receita('cafe', 'Tapioca com queijo e tomate', 'Rápida, sem glúten e boa para começar o dia.', 10, 1,
        (260, 11, 35, 8), ['vegetariana', 'sem_gluten'],
        [('Goma de tapioca hidratada', '3 colheres (sopa)'), ('Queijo minas ou muçarela', '2 fatias'),
         ('Tomate', '½ unidade em rodelas'), ('Orégano', 'a gosto')],
        ['Espalhe a goma numa frigideira antiaderente, em fogo médio, sem óleo.',
         'Quando as bordas soltarem, vire com cuidado.',
         'Coloque o queijo e o tomate em metade da tapioca e salpique orégano.',
         'Dobre ao meio e deixe mais 1 minuto para o queijo derreter.'])
receita('cafe', 'Cuscuz com ovo', 'Cuscuz de milho na cuscuzeira, com ovo por cima.', 15, 2,
        (280, 10, 40, 8), ['vegetariana', 'sem_gluten'],
        [('Flocão de milho', '1 xícara (chá)'), ('Água', '½ xícara (chá)'), ('Sal', '1 pitada'),
         ('Ovos', '2 unidades'), ('Manteiga', '1 colher (chá)')],
        ['Misture o flocão com a água e o sal e deixe hidratar por 5 minutos.',
         'Coloque água no fundo da cuscuzeira, acomode a massa sem apertar e tampe.',
         'Cozinhe por cerca de 8 minutos depois que começar a sair vapor.',
         'Enquanto isso, frite ou cozinhe os ovos.',
         'Sirva o cuscuz com a manteiga e o ovo por cima.'])
receita('cafe', 'Mingau de aveia com banana', 'Quentinho, simples e com ingredientes de casa.', 10, 1,
        (300, 11, 50, 7), ['vegetariana'],
        [('Aveia em flocos', '3 colheres (sopa)'), ('Leite', '1 xícara (chá)'), ('Banana', '1 unidade'),
         ('Canela em pó', 'a gosto')],
        ['Leve o leite e a aveia ao fogo baixo, mexendo sempre.',
         'Cozinhe por 3 a 5 minutos, até engrossar.',
         'Desligue, coloque numa tigela e cubra com a banana em rodelas.',
         'Polvilhe canela e sirva.'])
receita('cafe', 'Vitamina de banana com aveia', 'Pronta no liquidificador em 5 minutos.', 5, 1,
        (280, 10, 48, 6), ['vegetariana'],
        [('Banana', '1 unidade'), ('Leite', '1 copo (200 ml)'), ('Aveia em flocos', '1 colher (sopa)'),
         ('Mel ou açúcar', '1 colher (chá), opcional')],
        ['Coloque todos os ingredientes no liquidificador.',
         'Bata por cerca de 1 minuto, até ficar cremoso.',
         'Sirva na hora.'])
receita('cafe', 'Salada de frutas', 'Use as frutas que estiverem mais baratas na semana.', 10, 2,
        (120, 2, 30, 1), ['vegana', 'sem_gluten', 'sem_lactose'],
        [('Banana', '1 unidade'), ('Maçã', '1 unidade'), ('Laranja', '1 unidade'), ('Mamão', '1 fatia'),
         ('Limão', 'suco de ½ unidade')],
        ['Lave bem as frutas.',
         'Corte tudo em cubos pequenos, sem a casca da laranja e do mamão.',
         'Misture numa tigela e regue com o suco de limão para não escurecer.',
         'Sirva na hora ou guarde na geladeira por até 1 dia.'])

# ---------------- Almoço ----------------
receita('almoco', 'Frango grelhado com arroz e feijão', 'O prato feito de todo dia, leve e bem temperado.', 30, 2,
        (520, 42, 60, 11), ['sem_gluten', 'sem_lactose'],
        [('Filé de peito de frango', '2 unidades (cerca de 300 g)'), ('Alho', '1 dente amassado'),
         ('Limão', 'suco de ½ unidade'), ('Óleo ou azeite', '1 colher (sopa)'), ('Sal', 'a gosto'),
         ('Arroz cozido', '2 xícaras (chá)'), ('Feijão cozido', '2 conchas')],
        ['Tempere o frango com alho, limão e sal e deixe descansar por 10 minutos.',
         'Aqueça uma frigideira com o óleo em fogo médio.',
         'Grelhe o frango por 5 a 6 minutos de cada lado, até dourar e cozinhar por dentro.',
         'Sirva com o arroz e o feijão.'])
receita('almoco', 'Feijão caseiro na pressão', 'Rende para a semana toda e pode ser congelado.', 40, 6,
        (140, 9, 24, 2), ['vegana', 'sem_gluten', 'sem_lactose'],
        [('Feijão carioca', '2 xícaras (chá)'), ('Água', '6 xícaras (chá)'), ('Cebola', '½ unidade picada'),
         ('Alho', '2 dentes amassados'), ('Folha de louro', '1 unidade'), ('Óleo', '1 colher (sopa)'), ('Sal', 'a gosto')],
        ['Escolha e lave o feijão. Se der, deixe de molho por algumas horas e descarte a água.',
         'Coloque o feijão, a água e o louro na panela de pressão. Cozinhe por 25 minutos após pegar pressão.',
         'Espere a pressão sair. Numa frigideira, refogue a cebola e o alho no óleo.',
         'Junte o refogado ao feijão, acerte o sal e deixe ferver mais 5 minutos sem tampa.'])
receita('almoco', 'Carne moída com legumes', 'Rende bem e combina com arroz, purê ou macarrão.', 25, 3,
        (280, 24, 9, 16), ['sem_gluten', 'sem_lactose', 'low_carb'],
        [('Carne moída', '300 g'), ('Cebola', '1 unidade picada'), ('Tomate', '1 unidade picado'),
         ('Cenoura', '1 unidade ralada'), ('Abobrinha', '½ unidade picada'), ('Óleo', '1 colher (sopa)'),
         ('Cheiro-verde', 'a gosto'), ('Sal', 'a gosto')],
        ['Refogue a cebola no óleo até ficar transparente.',
         'Junte a carne e mexa até perder a cor vermelha.',
         'Acrescente o tomate, a cenoura e a abobrinha. Tempere com sal.',
         'Tampe e cozinhe por 10 minutos em fogo baixo. Finalize com cheiro-verde.'])
receita('almoco', 'Peixe assado com batata', 'Tudo numa assadeira só: menos louça, mais sabor.', 35, 2,
        (360, 30, 32, 11), ['sem_gluten', 'sem_lactose'],
        [('Filé de tilápia', '2 unidades'), ('Batata', '2 unidades médias em rodelas'), ('Cebola', '½ unidade em rodelas'),
         ('Limão', 'suco de 1 unidade'), ('Azeite ou óleo', '1 colher (sopa)'), ('Sal', 'a gosto')],
        ['Tempere o peixe com limão e sal.',
         'Forre a assadeira com as batatas e a cebola, regue com azeite e salgue.',
         'Leve ao forno a 200 °C por 15 minutos.',
         'Coloque o peixe por cima e asse mais 15 minutos, até ficar branquinho e soltar em lascas.'])
receita('almoco', 'Salada de alface, tomate e cenoura', 'A salada do dia a dia, pronta em 10 minutos.', 10, 2,
        (70, 2, 10, 3), ['vegana', 'sem_gluten', 'sem_lactose', 'low_carb'],
        [('Alface', '½ pé'), ('Tomate', '1 unidade'), ('Cenoura', '1 unidade ralada'), ('Limão', 'suco de ½ unidade'),
         ('Azeite', '1 colher (chá)'), ('Sal', 'a gosto')],
        ['Lave bem as folhas e os legumes.',
         'Rasgue a alface com as mãos e corte o tomate em gomos.',
         'Junte a cenoura ralada.',
         'Tempere na hora de servir com limão, azeite e sal.'])
receita('almoco', 'Legumes refogados', 'Abobrinha, cenoura e chuchu para acompanhar qualquer prato.', 20, 3,
        (90, 2, 12, 4), ['vegana', 'sem_gluten', 'sem_lactose', 'low_carb'],
        [('Abobrinha', '1 unidade em cubos'), ('Cenoura', '1 unidade em rodelas'), ('Chuchu', '1 unidade em cubos'),
         ('Alho', '1 dente picado'), ('Óleo ou azeite', '1 colher (sopa)'), ('Sal', 'a gosto')],
        ['Refogue o alho no óleo por 1 minuto.',
         'Junte a cenoura e o chuchu, que demoram mais, e mexa por 3 minutos.',
         'Acrescente a abobrinha, o sal e 2 colheres de água. Tampe.',
         'Cozinhe por 8 a 10 minutos, até ficarem macios mas firmes.'])

# ---------------- Lanches ----------------
receita('lanche', 'Sanduíche natural de frango', 'Ótimo para levar na bolsa ou na marmita.', 10, 2,
        (300, 22, 28, 10), [],
        [('Pão de forma', '4 fatias'), ('Frango cozido e desfiado', '1 xícara (chá)'), ('Requeijão', '2 colheres (sopa)'),
         ('Cenoura', '½ unidade ralada'), ('Alface', '2 folhas')],
        ['Misture o frango com o requeijão e a cenoura.',
         'Espalhe o recheio em 2 fatias de pão.',
         'Coloque a alface e feche com as outras fatias.',
         'Corte ao meio e sirva, ou embale para levar.'])
receita('lanche', 'Iogurte com banana e aveia', 'Lanche de 3 minutos, sem fogão.', 3, 1,
        (220, 9, 35, 5), ['vegetariana'],
        [('Iogurte natural', '1 pote (170 g)'), ('Banana', '½ unidade'), ('Aveia em flocos', '1 colher (sopa)'),
         ('Mel', '1 colher (chá), opcional')],
        ['Coloque o iogurte numa tigela.',
         'Corte a banana em rodelas por cima.',
         'Finalize com a aveia e, se quiser, o mel.'])
receita('lanche', 'Ovo cozido com fruta', 'Prático, barato e sustenta até a próxima refeição.', 12, 1,
        (220, 13, 18, 10), ['vegetariana', 'sem_gluten', 'sem_lactose'],
        [('Ovos', '2 unidades'), ('Fruta da estação', '1 unidade'), ('Sal', '1 pitada')],
        ['Coloque os ovos numa panela, cubra com água e leve ao fogo.',
         'Quando ferver, conte 9 minutos.',
         'Passe os ovos para água fria, descasque e tempere com uma pitada de sal.',
         'Sirva com a fruta.'])
receita('lanche', 'Pão de queijo de frigideira', 'Sabor de pão de queijo, pronto em 10 minutos.', 10, 1,
        (230, 12, 22, 10), ['vegetariana', 'sem_gluten'],
        [('Ovo', '1 unidade'), ('Goma de tapioca', '2 colheres (sopa)'), ('Queijo ralado', '2 colheres (sopa)'),
         ('Leite', '1 colher (sopa)'), ('Sal', '1 pitada')],
        ['Misture todos os ingredientes num prato fundo com um garfo.',
         'Despeje numa frigideira antiaderente pequena, em fogo baixo, e tampe.',
         'Quando a parte de baixo dourar, vire e doure o outro lado.',
         'Sirva quente.'])
receita('lanche', 'Banana amassada com aveia e canela', 'Doce natural, sem açúcar e sem fogão.', 3, 1,
        (170, 4, 36, 2), ['vegana', 'sem_lactose'],
        [('Banana bem madura', '1 unidade'), ('Aveia em flocos', '1 colher (sopa)'), ('Canela em pó', 'a gosto')],
        ['Amasse a banana com um garfo.',
         'Misture a aveia.',
         'Polvilhe canela e sirva.'])
receita('lanche', 'Torrada com requeijão e tomate', 'Para a tarde, com café ou chá.', 5, 1,
        (200, 7, 26, 7), ['vegetariana'],
        [('Pão de forma ou francês', '2 fatias'), ('Requeijão', '1 colher (sopa)'), ('Tomate', '½ unidade em rodelas'),
         ('Orégano', 'a gosto')],
        ['Torre o pão na frigideira ou na torradeira.',
         'Espalhe o requeijão.',
         'Cubra com o tomate e salpique orégano.'])

# ---------------- Jantar ----------------
receita('jantar', 'Omelete de legumes', 'Leve, rápida e boa para aproveitar o que tem na geladeira.', 15, 1,
        (210, 14, 6, 14), ['vegetariana', 'sem_gluten', 'sem_lactose', 'low_carb'],
        [('Ovos', '2 unidades'), ('Tomate', '½ unidade picado'), ('Cebola', '2 colheres (sopa) picada'),
         ('Cheiro-verde', 'a gosto'), ('Óleo', '1 colher (chá)'), ('Sal', 'a gosto')],
        ['Bata os ovos com o sal.',
         'Misture o tomate, a cebola e o cheiro-verde.',
         'Despeje numa frigideira untada, em fogo baixo, e tampe.',
         'Quando firmar, dobre ao meio e sirva.'])
receita('jantar', 'Sopa de legumes com frango', 'Reconfortante e rende bem para a família.', 35, 4,
        (200, 16, 22, 4), ['sem_gluten', 'sem_lactose'],
        [('Peito de frango em cubos', '200 g'), ('Batata', '2 unidades em cubos'), ('Cenoura', '1 unidade em cubos'),
         ('Chuchu', '1 unidade em cubos'), ('Cebola', '½ unidade picada'), ('Alho', '2 dentes'),
         ('Água', '1 litro'), ('Sal e cheiro-verde', 'a gosto')],
        ['Refogue a cebola e o alho numa panela com um fio de óleo.',
         'Junte o frango e mexa até dourar levemente.',
         'Acrescente os legumes, a água e o sal.',
         'Cozinhe por 20 minutos, até a batata ficar macia. Finalize com cheiro-verde.'])
receita('jantar', 'Frango desfiado com legumes', 'Serve no prato, no pão ou na tapioca.', 30, 3,
        (240, 28, 8, 10), ['sem_gluten', 'sem_lactose', 'low_carb'],
        [('Peito de frango', '400 g'), ('Cebola', '1 unidade picada'), ('Tomate', '1 unidade picado'),
         ('Cenoura', '1 unidade ralada'), ('Óleo', '1 colher (sopa)'), ('Sal e cheiro-verde', 'a gosto')],
        ['Cozinhe o frango em água com sal por 20 minutos (ou 10 na pressão).',
         'Escorra e desfie com dois garfos.',
         'Refogue a cebola no óleo, junte o tomate e a cenoura.',
         'Acrescente o frango, mexa por 3 minutos e finalize com cheiro-verde.'])
receita('jantar', 'Caldo verde simples', 'Batata e couve: barato, quentinho e saboroso.', 30, 4,
        (180, 4, 30, 5), ['vegana', 'sem_gluten', 'sem_lactose'],
        [('Batata', '4 unidades'), ('Couve', '1 maço fatiado bem fininho'), ('Cebola', '½ unidade'),
         ('Alho', '2 dentes'), ('Azeite ou óleo', '1 colher (sopa)'), ('Água', '1 litro'), ('Sal', 'a gosto')],
        ['Cozinhe as batatas, a cebola e o alho na água com sal até ficarem bem macios.',
         'Bata tudo no liquidificador (cuidado: espere amornar um pouco).',
         'Volte o creme para a panela e junte a couve.',
         'Deixe ferver por 3 minutos e regue com o azeite.'])
receita('jantar', 'Arroz mexido com ovo e legumes', 'Aproveita o arroz que sobrou do almoço.', 15, 2,
        (320, 13, 48, 8), ['vegetariana', 'sem_lactose'],
        [('Arroz cozido', '2 xícaras (chá)'), ('Ovos', '2 unidades'), ('Cenoura', '1 unidade ralada'),
         ('Milho ou ervilha', '½ xícara (chá)'), ('Cebolinha', 'a gosto'), ('Óleo', '1 colher (chá)'), ('Sal', 'a gosto')],
        ['Refogue a cenoura no óleo por 2 minutos.',
         'Junte o arroz e o milho e mexa até aquecer.',
         'Abra um espaço na panela, quebre os ovos e mexa até cozinharem.',
         'Misture tudo, acerte o sal e finalize com cebolinha.'])
receita('jantar', 'Caldo de feijão', 'Usa o feijão de casa e fica pronto em 20 minutos.', 20, 3,
        (180, 10, 28, 3), ['vegana', 'sem_gluten', 'sem_lactose'],
        [('Feijão cozido com caldo', '3 conchas'), ('Água', '1 xícara (chá)'), ('Alho', '1 dente'),
         ('Cebola', '¼ unidade'), ('Óleo', '1 colher (chá)'), ('Cheiro-verde', 'a gosto')],
        ['Bata o feijão com a água no liquidificador.',
         'Refogue o alho e a cebola no óleo.',
         'Junte o feijão batido e deixe ferver por 10 minutos, mexendo de vez em quando.',
         'Finalize com cheiro-verde.'])


def q(s: str) -> str:
    return "'" + s.replace("'", "''") + "'"


def arr(items):
    return "array[" + ", ".join(q(i) for i in items) + "]::text[]"


rows = []
for r in R:
    rows.append(
        "  (" + ", ".join([
            q(r['title']), q(r['description']), q(r['meal']), str(r['minutes']), str(r['servings']),
            str(r['kcal']), str(r['prot']), str(r['carb']), str(r['fat']),
            arr(r['tags']) if r['tags'] else "'{}'::text[]",
            q(json.dumps(r['ingredients'], ensure_ascii=False)) + "::jsonb",
            arr(r['steps']), 'false', 'true',
        ]) + ")"
    )

sql = f"""-- Viva Leve · Alimentação brasileira, caseira e simples
-- Migração NÃO destrutiva: nenhum DELETE, nenhum DROP, nenhum dado de usuária alterado.
begin;

-- 1) Novos campos opcionais em receitas
alter table public.recipes add column if not exists servings int;
alter table public.recipes add column if not exists image_url text;
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'recipes_servings_positive') then
    alter table public.recipes add constraint recipes_servings_positive check (servings is null or servings > 0);
  end if;
end $$;

-- 2) Favoritos por usuária (cada uma só vê e altera os próprios)
create table if not exists public.recipe_favorites (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, recipe_id)
);
grant select, insert, delete on public.recipe_favorites to authenticated;
grant all on public.recipe_favorites to service_role;
alter table public.recipe_favorites enable row level security;
drop policy if exists "own favorites read" on public.recipe_favorites;
drop policy if exists "own favorites insert" on public.recipe_favorites;
drop policy if exists "own favorites delete" on public.recipe_favorites;
create policy "own favorites read" on public.recipe_favorites for select to authenticated using (user_id = auth.uid());
create policy "own favorites insert" on public.recipe_favorites for insert to authenticated with check (user_id = auth.uid());
create policy "own favorites delete" on public.recipe_favorites for delete to authenticated using (user_id = auth.uid());

-- 3) Receitas antigas: só despublicadas (continuam no banco; podem voltar com published = true)
update public.recipes set published = false
where published = true
  and title not in ({", ".join(q(r['title']) for r in R)});

-- 4) Receitas brasileiras (só insere as que ainda não existem — pode rodar de novo sem duplicar)
insert into public.recipes
  (title, description, meal_type, prep_minutes, servings, calories, protein, carbs, fat, tags, ingredients, steps, premium, published)
select v.* from (values
{(','+chr(10)).join(rows)}
) as v(title, description, meal_type, prep_minutes, servings, calories, protein, carbs, fat, tags, ingredients, steps, premium, published)
where not exists (select 1 from public.recipes r where r.title = v.title);

commit;
"""

out = Path(__file__).resolve().parents[1] / 'migrations' / '20261101120000_receitas_brasileiras.sql'
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(sql, encoding='utf-8')
print(f'{len(R)} receitas -> {out}')
