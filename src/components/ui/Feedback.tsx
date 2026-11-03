import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@/theme';
import { AppText } from './AppText';
import { Button } from './Button';

type IconName = ComponentProps<typeof Ionicons>['name'];

/** Carregando: indicador centralizado com texto opcional. */
export function LoadingState({ label = 'Carregando…' }: { label?: string }) {
  return (
    <View style={styles.center} accessibilityLiveRegion="polite">
      <ActivityIndicator color={colors.plum} />
      <AppText variant="small" color="textMuted">
        {label}
      </AppText>
    </View>
  );
}

/** Estado vazio honesto: explica o que falta e (opcionalmente) oferece uma ação. */
export function EmptyState({
  icon = 'leaf-outline',
  title,
  message,
  actionLabel,
  onAction,
}: {
  icon?: IconName;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.box}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={24} color={colors.sageDeep} />
      </View>
      <AppText variant="subheading" align="center">
        {title}
      </AppText>
      {message ? (
        <AppText variant="small" color="textMuted" align="center">
          {message}
        </AppText>
      ) : null}
      {actionLabel && onAction ? <Button label={actionLabel} variant="secondary" size="md" onPress={onAction} /> : null}
    </View>
  );
}

/** Erro com opção de tentar de novo. */
export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const message = error instanceof Error ? error.message : 'Algo deu errado ao carregar os dados.';
  return (
    <View style={[styles.box, styles.errorBox]} accessibilityRole="alert">
      <Ionicons name="cloud-offline-outline" size={24} color={colors.danger} />
      <AppText variant="bodyStrong" align="center">
        Não foi possível carregar
      </AppText>
      <AppText variant="small" color="textMuted" align="center">
        {message}
      </AppText>
      {onRetry ? <Button label="Tentar de novo" variant="secondary" size="md" icon="refresh" onPress={onRetry} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { paddingVertical: spacing.xxl, alignItems: 'center', gap: spacing.sm },
  box: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#CDBFB8',
  },
  errorBox: { borderStyle: 'solid', borderColor: colors.dangerTint, backgroundColor: '#FFF4F3' },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.sageTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
