import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { router } from 'expo-router';
import { Linking, StyleSheet, View } from 'react-native';

import { ScreenHeader } from '@/components/cards';
import { AppText, Badge, Button, Card, ErrorState, LoadingState, Overline, Screen, SectionHeader, TextField } from '@/components/ui';
import { useProfile, useUpdateName } from '@/hooks/queries';
import { confirmAction } from '@/lib/confirm';
import { env } from '@/lib/env';
import { PLAN_LABEL, tagLabel } from '@/lib/labels';
import { activityLabel, equipmentOptionLabel, goalLabel, joinPt } from '@/lib/onboarding';
import { useAuth } from '@/providers/AuthProvider';
import { authErrorMessage, deleteOwnAccount } from '@/services/auth';
import { colors, spacing } from '@/theme';

const PREMIUM_FEATURES = [
  'Todas as receitas e exercícios da biblioteca',
  'Plano semanal de refeições e lista de compras',
  'Programas guiados para iniciantes',
  'Histórico completo da sua evolução',
];

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const profile = useProfile();
  const updateName = useUpdateName();
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const plan = profile.data?.plan ?? 'free';
  const initial = (profile.data?.name || user?.email || '?').trim().charAt(0).toUpperCase();

  async function confirmSignOut() {
    const ok = await confirmAction({
      title: 'Sair da conta?',
      message: 'Você pode entrar de novo quando quiser.',
      confirmLabel: 'Sair',
      destructive: true,
    });
    if (ok) await signOut();
  }

  async function confirmDeleteAccount() {
    const ok = await confirmAction({
      title: 'Excluir sua conta?',
      message:
        'Seus hábitos, treinos registrados, favoritos e dados de perfil serão apagados para sempre. Essa ação não pode ser desfeita.',
      confirmLabel: 'Excluir conta',
      destructive: true,
    });
    if (!ok) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      // Ao terminar, a sessão some e as rotas protegidas levam para as boas-vindas.
      await deleteOwnAccount();
    } catch (e) {
      setDeleteError(authErrorMessage(e));
      setDeleting(false);
    }
  }

  function saveName() {
    if (name.trim().length < 2) return;
    // O erro aparece no campo via updateName.error.
    updateName.mutate(name, {
      onSuccess: () => {
        setEditing(false);
        setSaved(true);
      },
    });
  }

  return (
    <Screen keyboard refreshing={profile.isRefetching} onRefresh={() => profile.refetch()}>
      <ScreenHeader title="Perfil" />

      {profile.isLoading ? <LoadingState /> : null}
      {profile.error ? <ErrorState error={profile.error} onRetry={profile.refetch} /> : null}

      {/* Identidade */}
      <Card>
        <View style={styles.identity}>
          <View style={styles.avatar} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <AppText variant="heading" color="textStrong">
              {initial}
            </AppText>
          </View>
          <View style={styles.flex}>
            <AppText variant="subheading" numberOfLines={1}>
              {profile.data?.name || 'Sem nome'}
            </AppText>
            <AppText variant="small" color="textMuted" numberOfLines={1}>
              {user?.email}
            </AppText>
          </View>
          <Badge label={PLAN_LABEL[plan]} tone={plan === 'premium' ? 'rose' : 'sage'} />
        </View>

        {editing ? (
          <View style={styles.edit}>
            <TextField
              label="Como prefere ser chamada"
              value={name}
              onChangeText={setName}
              error={name.trim().length < 2 ? 'Digite pelo menos 2 letras.' : updateName.error ? 'Não foi possível salvar.' : null}
              autoComplete="given-name"
              returnKeyType="done"
              onSubmitEditing={saveName}
            />
            <View style={styles.row}>
              <Button label="Salvar" size="md" onPress={saveName} loading={updateName.isPending} style={styles.flex} />
              <Button
                label="Cancelar"
                size="md"
                variant="secondary"
                onPress={() => setEditing(false)}
                style={styles.flex}
              />
            </View>
          </View>
        ) : (
          <Button
            label="Editar nome"
            icon="create-outline"
            size="md"
            variant="secondary"
            onPress={() => {
              setName(profile.data?.name ?? '');
              setSaved(false);
              setEditing(true);
            }}
          />
        )}
        {saved ? (
          <AppText variant="caption" color="sageDeep" accessibilityLiveRegion="polite">
            Nome atualizado.
          </AppText>
        ) : null}
      </Card>

      {/* Preferências do questionário inicial: personalizam treinos e receitas */}
      <SectionHeader title="Suas preferências" />
      <Card tone="muted">
        {profile.data ? (
          <>
            <Info label="Objetivos" value={joinPt(profile.data.goals.map(goalLabel))} />
            <Info label="Rotina de exercícios" value={profile.data.activity_level ? activityLabel(profile.data.activity_level) : ''} />
            <Info label="Tempo por dia" value={profile.data.minutes_available ? `${profile.data.minutes_available} min` : ''} />
            <Info label="Equipamentos" value={joinPt(profile.data.equipment.map(equipmentOptionLabel))} />
            <Info label="Alimentação" value={joinPt(profile.data.diet_prefs.map(tagLabel))} />
          </>
        ) : null}
        <Button
          label="Editar preferências"
          icon="options-outline"
          size="md"
          variant="secondary"
          onPress={() => router.push({ pathname: '/questionario', params: { editar: '1' } })}
        />
      </Card>

      {/* Assinatura */}
      <SectionHeader title="Assinatura" />
      <Card>
        <View style={styles.rowBetween}>
          <View>
            <Overline color="textMuted">Seu plano</Overline>
            <AppText variant="heading">{PLAN_LABEL[plan]}</AppText>
          </View>
          <Ionicons name={plan === 'premium' ? 'sparkles' : 'leaf-outline'} size={28} color={colors.sageDeep} />
        </View>
        {plan === 'premium' ? (
          <AppText variant="small">Você tem acesso a todo o conteúdo Premium.</AppText>
        ) : (
          <>
            <AppText variant="smallStrong">O Premium inclui:</AppText>
            {PREMIUM_FEATURES.map((f) => (
              <View key={f} style={styles.feature}>
                <Ionicons name="checkmark" size={16} color={colors.roseDeep} />
                <AppText variant="small" style={styles.flex}>
                  {f}
                </AppText>
              </View>
            ))}
            <Button label="Assinatura em breve" disabled icon="time-outline" accessibilityHint="A assinatura ainda não está disponível no app." />
            <AppText variant="caption" color="textMuted">
              A assinatura ainda não está disponível no aplicativo. Nenhum pagamento é cobrado nesta versão.
            </AppText>
          </>
        )}
      </Card>

      <Button label="Sair da conta" variant="danger" icon="log-out-outline" onPress={confirmSignOut} />

      {/* Conta e privacidade */}
      <SectionHeader title="Conta e privacidade" />
      {env.privacyPolicyUrl ? (
        <Button
          label="Política de Privacidade"
          icon="document-text-outline"
          size="md"
          variant="secondary"
          onPress={() => Linking.openURL(env.privacyPolicyUrl).catch(() => undefined)}
        />
      ) : null}
      <Button
        label="Excluir minha conta"
        icon="trash-outline"
        size="md"
        variant="secondary"
        onPress={confirmDeleteAccount}
        loading={deleting}
        accessibilityHint="Apaga sua conta e todos os seus dados de forma permanente."
      />
      {deleteError ? (
        <AppText variant="caption" color="danger" accessibilityRole="alert">
          {deleteError}
        </AppText>
      ) : null}
    </Screen>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.info}>
      <AppText variant="caption" color="textMuted">
        {label}
      </AppText>
      <AppText variant="small">{value || 'Não informado'}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  identity: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.sage, alignItems: 'center', justifyContent: 'center' },
  edit: { gap: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.sm },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  feature: { flexDirection: 'row', gap: spacing.xs, alignItems: 'flex-start' },
  info: { gap: 2 },
});
