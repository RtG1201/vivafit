import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Button, Card, ChipGroup, Overline, ProgressBar, Screen } from '@/components/ui';
import { useProfile, useUpdatePreferences } from '@/hooks/queries';
import {
  ACTIVITY_OPTIONS,
  answersFromProfile,
  DIET_OPTIONS,
  EMPTY_ANSWERS,
  EQUIPMENT_OPTIONS,
  GOAL_OPTIONS,
  MAX_GOALS,
  MINUTES_OPTIONS,
  planSummary,
  type OnboardingAnswers,
} from '@/lib/onboarding';
import { colors, radius, spacing } from '@/theme';

type Step = {
  title: string;
  hint: string;
  /** A resposta é obrigatória para avançar? (o botão "Pular" continua disponível no primeiro acesso) */
  required: boolean;
};

const STEPS: Step[] = [
  { title: 'O que você quer conquistar?', hint: `Escolha até ${MAX_GOALS}.`, required: true },
  { title: 'Como está sua rotina de exercícios hoje?', hint: 'Assim os treinos começam no ponto certo.', required: true },
  { title: 'Quanto tempo você tem por dia?', hint: 'Treinos curtos também funcionam.', required: true },
  { title: 'O que você tem em casa?', hint: 'Marque tudo que tiver. Pode ser nada.', required: false },
  { title: 'Alguma preferência na alimentação?', hint: 'Opcional. As receitas já vêm filtradas.', required: false },
];

function toggle(list: string[], value: string, max?: number): string[] {
  if (list.includes(value)) return list.filter((v) => v !== value);
  if (max && list.length >= max) return [...list.slice(1), value];
  return [...list, value];
}

/**
 * Questionário inicial (5 perguntas curtas + resumo do plano).
 * Primeiro acesso: aparece sozinho até ser respondido ou pulado.
 * Pelo Perfil (?editar=1): abre com as respostas salvas e volta ao terminar.
 */
export default function OnboardingScreen() {
  const { editar } = useLocalSearchParams<{ editar?: string }>();
  const editing = editar === '1';
  const profile = useProfile();
  const save = useUpdatePreferences();
  const [answers, setAnswers] = useState<OnboardingAnswers>(() =>
    editing ? answersFromProfile(profile.data) : EMPTY_ANSWERS,
  );
  const [step, setStep] = useState(0);

  const isSummary = step === STEPS.length;
  const current = STEPS[step];
  const set = (patch: Partial<OnboardingAnswers>) => setAnswers((a) => ({ ...a, ...patch }));

  const answered = [
    answers.goals.length > 0,
    !!answers.activity_level,
    !!answers.minutes_available,
    answers.equipment.length > 0,
    answers.diet_prefs.length > 0,
  ];

  function finish(values: OnboardingAnswers) {
    save.mutate(values, {
      onSuccess: () => {
        if (editing && router.canGoBack()) router.back();
        else router.replace('/inicio');
      },
    });
  }

  function back() {
    if (step > 0) setStep(step - 1);
    else if (editing && router.canGoBack()) router.back();
  }

  return (
    <Screen edges={['top', 'bottom']} contentStyle={styles.content}>
      {/* Topo: voltar, progresso e pular */}
      <View style={styles.top}>
        <Pressable
          onPress={back}
          disabled={step === 0 && !editing}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          hitSlop={12}
          style={[styles.iconButton, step === 0 && !editing && styles.hidden]}
        >
          <Ionicons name="chevron-back" size={24} color={colors.plum} />
        </Pressable>
        <View style={styles.flex} accessibilityLabel={`Passo ${Math.min(step + 1, STEPS.length)} de ${STEPS.length}`}>
          <ProgressBar value={step / STEPS.length} color={colors.terracotta} />
        </View>
        {!editing && !isSummary ? (
          <Pressable
            onPress={() => finish(answers)}
            disabled={save.isPending}
            accessibilityRole="button"
            accessibilityHint="Salva o que já respondeu. Você pode completar depois no Perfil."
            hitSlop={12}
          >
            <AppText variant="smallStrong" color="textMuted">
              Pular
            </AppText>
          </Pressable>
        ) : (
          <View style={styles.iconButton} />
        )}
      </View>

      {isSummary ? (
        <View style={styles.body}>
          <Overline>Seu plano</Overline>
          <AppText variant="title" accessibilityRole="header">
            Pronto! Montamos o Vivafit para você.
          </AppText>
          <Card tone="sage">
            {planSummary(answers).map((line) => (
              <View key={line} style={styles.summaryLine}>
                <Ionicons name="checkmark-circle" size={20} color={colors.sageDeep} />
                <AppText variant="body" style={styles.flex}>
                  {line}
                </AppText>
              </View>
            ))}
          </Card>
          <AppText variant="small" color="textMuted">
            Você pode mudar essas respostas quando quiser em Perfil › Suas preferências.
          </AppText>
        </View>
      ) : (
        <View style={styles.body}>
          <Overline color="textMuted">{`Pergunta ${step + 1} de ${STEPS.length}`}</Overline>
          <AppText variant="title" accessibilityRole="header">
            {current.title}
          </AppText>
          <AppText variant="small" color="textMuted">
            {current.hint}
          </AppText>

          {step === 0 ? (
            <OptionList
              options={GOAL_OPTIONS}
              selected={answers.goals}
              onPress={(v) => set({ goals: toggle(answers.goals, v, MAX_GOALS) })}
              multiple
            />
          ) : null}
          {step === 1 ? (
            <OptionList
              options={ACTIVITY_OPTIONS}
              selected={answers.activity_level ? [answers.activity_level] : []}
              onPress={(v) => set({ activity_level: v })}
            />
          ) : null}
          {step === 2 ? (
            <ChipGroup
              accessibilityLabel="Minutos por dia"
              options={MINUTES_OPTIONS.map((m) => ({ value: String(m), label: `${m} min` }))}
              values={answers.minutes_available ? [String(answers.minutes_available)] : []}
              onToggle={(v) => set({ minutes_available: Number(v) })}
            />
          ) : null}
          {step === 3 ? (
            <OptionList
              options={EQUIPMENT_OPTIONS}
              selected={answers.equipment}
              onPress={(v) =>
                set({
                  // "Nada" exclui os demais, e marcar um equipamento desmarca "Nada".
                  equipment: v === 'nenhum' ? ['nenhum'] : toggle(answers.equipment.filter((e) => e !== 'nenhum'), v),
                })
              }
              multiple
            />
          ) : null}
          {step === 4 ? (
            <ChipGroup
              accessibilityLabel="Preferências alimentares"
              options={DIET_OPTIONS}
              values={answers.diet_prefs}
              onToggle={(v) => set({ diet_prefs: toggle(answers.diet_prefs, v) })}
            />
          ) : null}
        </View>
      )}

      <View style={styles.flex} />

      {save.error ? (
        <AppText variant="caption" color="danger" accessibilityRole="alert">
          Não foi possível salvar suas respostas. Confira a conexão e tente de novo.
        </AppText>
      ) : null}

      {isSummary ? (
        <Button label={editing ? 'Salvar preferências' : 'Começar'} onPress={() => finish(answers)} loading={save.isPending} />
      ) : (
        <Button
          label={!answered[step] && !current.required ? 'Pular esta' : 'Continuar'}
          onPress={() => setStep(step + 1)}
          disabled={current.required && !answered[step]}
        />
      )}
    </Screen>
  );
}

/** Lista de opções em cartões grandes (fácil de tocar). */
function OptionList({
  options,
  selected,
  onPress,
  multiple = false,
}: {
  options: { value: string; label: string }[];
  selected: string[];
  onPress: (value: string) => void;
  multiple?: boolean;
}) {
  return (
    <View style={styles.options}>
      {options.map((o) => {
        const on = selected.includes(o.value);
        return (
          <Pressable
            key={o.value}
            onPress={() => onPress(o.value)}
            accessibilityRole={multiple ? 'checkbox' : 'radio'}
            accessibilityState={multiple ? { checked: on } : { selected: on }}
            accessibilityLabel={o.label}
            style={({ pressed }) => [styles.option, on && styles.optionOn, pressed && styles.pressed]}
          >
            <AppText variant="bodyStrong" style={styles.flex}>
              {o.label}
            </AppText>
            <Ionicons
              name={on ? (multiple ? 'checkbox' : 'radio-button-on') : multiple ? 'square-outline' : 'radio-button-off'}
              size={22}
              color={on ? colors.plum : colors.textMuted}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.md },
  flex: { flex: 1 },
  top: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 44 },
  iconButton: { width: 32, alignItems: 'flex-start' },
  hidden: { opacity: 0 },
  body: { gap: spacing.sm },
  options: { gap: spacing.xs, marginTop: spacing.xs },
  option: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionOn: { borderColor: colors.plum, backgroundColor: colors.sageTint },
  pressed: { opacity: 0.85 },
  summaryLine: { flexDirection: 'row', gap: spacing.xs, alignItems: 'flex-start' },
});
