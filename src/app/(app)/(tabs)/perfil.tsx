import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { ScreenHeader } from '@/components/cards';
import { AppText, Badge, Button, Card, ErrorState, LoadingState, Overline, Screen, SectionHeader, TextField } from '@/components/ui';
import { useProfile, useUpdateName } from '@/hooks/queries';
import { PLAN_LABEL } from '@/lib/labels';
import { useAuth } from '@/providers/AuthProvider';
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

  const plan = profile.data?.plan ?? 'free';
  const initial = (profile.data?.name || user?.email || '?').trim().charAt(0).toUpperCase();

  function confirmSignOut() {
    Alert.alert('Sair da conta?', 'Você pode entrar de novo quando quiser.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => signOut() },
    ]);
  }

  async function saveName() {
    if (name.trim().length < 2) return;
    await updateName.mutateAsync(name);
    setEditing(false);
    setSaved(true);
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

      {/* Preferências vindas do perfil (preenchidas no onboarding — próxima etapa) */}
      <SectionHeader title="Suas preferências" />
      <Card tone="muted">
        {profile.data?.onboarded ? (
          <>
            <Info label="Objetivos" value={profile.data.goals.join(', ')} />
            <Info label="Restrições" value={profile.data.diet_prefs.join(', ')} />
            <Info label="Tempo por dia" value={profile.data.minutes_available ? `${profile.data.minutes_available} min` : ''} />
          </>
        ) : (
          <AppText variant="small">
            Você ainda não respondeu o questionário inicial (objetivos, restrições, tempo e equipamentos). Ele chega na
            próxima etapa do app e vai personalizar receitas e treinos.
          </AppText>
        )}
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
