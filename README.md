# Viva Leve

Aplicativo mobile (Android e iOS) de alimentação, exercícios em casa e acompanhamento de hábitos para mulheres iniciantes.

**Stack:** Expo SDK 58 · React Native 0.88 · TypeScript · Expo Router · Supabase · TanStack Query

## Como rodar

```bash
npm install            # só na primeira vez
npx expo start         # abre o servidor; leia o QR Code com o app Expo Go
```

Antes, configure o banco:

1. Copie `.env.example` para `.env.local`.
2. Preencha `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (URL e chave **pública/anon** do Supabase).
3. Reinicie com `npx expo start -c`.

> Nunca coloque a senha do banco nem a chave `service_role` no app. A segurança dos dados vem das regras RLS do Supabase.

## Comandos úteis

| Comando | O que faz |
|---|---|
| `npm run typecheck` | Verifica tipos TypeScript |
| `npm run lint` | ESLint (config oficial do Expo) |
| `npm test` | Testes unitários (Jest + jest-expo) |
| `npx expo-doctor` | Diagnóstico de dependências e configuração |
| `npx expo start --tunnel` | Use se o celular não estiver na mesma rede Wi-Fi |

## Estrutura

```
src/
  app/                    Rotas (Expo Router) — cada arquivo é uma tela
    _layout.tsx           Fontes, provedores e rotas protegidas (logada x não logada)
    (auth)/               Boas-vindas, Login, Cadastro
    (app)/(tabs)/         Início, Alimentação, Treinos, Progresso, Perfil
    (app)/receita/[id]    Detalhe da receita
    (app)/treino/[id]     Detalhe do exercício
  components/ui/          Componentes base (texto, botão, campo, card, chips, estados)
  components/cards/       Componentes de domínio (receita, exercício, hábito, semana)
  hooks/queries.ts        Hooks de dados (TanStack Query) e progresso derivado
  services/               Acesso ao Supabase (auth, conteúdo, registros da usuária)
  lib/                    Supabase client, env, datas, gamificação (testada), rótulos
  providers/              Sessão (Auth) e cache de dados (Query)
  theme/                  Cores, tipografia, espaçamentos
  types/database.ts       Tipos das tabelas existentes (somente leitura do esquema)
```

## Banco de dados

O app usa o banco **existente** do projeto Leve em Casa (Lovable Cloud / Supabase). Migrações só aditivas, listadas abaixo:

- Leitura: `recipes` (somente `published = true`), `exercises`, `announcements`, função `premium_teasers`.
- Favoritos: `recipe_favorites` (RLS por usuária).
- Dados da própria usuária (protegidos por RLS): `profiles`, `habits`, `habit_logs`, `activity_logs`; contagens de `meal_plans` e `goals`.
- O cadastro aciona o gatilho já existente que cria perfil e hábitos iniciais.

### Migrações aplicadas pelo Viva Leve

| Arquivo | O que faz |
|---|---|
| `supabase/migrations/20261101120000_receitas_brasileiras.sql` | Adiciona `servings` e `image_url` em `recipes`, cria `recipe_favorites` com RLS, **despublica** (não apaga) as receitas antigas e cadastra 24 receitas brasileiras simples. |
| `supabase/migrations/20261103120000_excluir_conta.sql` | Cria a função `delete_own_account()`, usada pelo botão **Excluir minha conta** do Perfil: apaga só os dados de quem chamou e a conta de login. Sem ela aplicada, o botão mostra erro. |

**Política de Privacidade:** preencha `EXPO_PUBLIC_PRIVACY_POLICY_URL` no `.env.local` com o endereço público da política; o link aparece no Perfil.

O SQL é gerado por `supabase/seed/receitas_brasileiras.py` (edite a lista de receitas ali e rode `python supabase/seed/receitas_brasileiras.py`). O script é idempotente: rodar de novo não duplica receitas.

**Fotos das receitas:** preencha `recipes.image_url` com a URL pública da foto. Enquanto estiver vazio, o app mostra um espaço ilustrado com “Foto em breve”.

## Fora desta etapa

Pagamentos/assinatura, onboarding (questionário), recuperação de senha, plano semanal e lista de compras, metas e medidas, painel administrativo.
