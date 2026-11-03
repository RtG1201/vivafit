import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { AppText, Card } from '@/components/ui';
import { colors, spacing } from '@/theme';

/** Marca provisória: folha em círculos sálvia/rosa + nome em Fraunces. */
export function BrandMark({ size = 96 }: { size?: number }) {
  const inner = Math.round(size * 0.66);
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.outer, { width: size, height: size, borderRadius: size / 2 }]}
    >
      <View style={[styles.inner, { width: inner, height: inner, borderRadius: inner / 2 }]}>
        <Ionicons name="leaf-outline" size={Math.round(size * 0.32)} color={colors.sageDeep} />
      </View>
    </View>
  );
}

export function Wordmark() {
  return (
    <AppText variant="heading" accessibilityRole="header">
      Viva Leve
    </AppText>
  );
}

/** Aviso exibido enquanto o .env.local não for preenchido. */
export function ConfigNotice() {
  return (
    <Card tone="terracotta">
      <AppText variant="smallStrong" color="terracottaDeep">
        Conexão com o banco não configurada
      </AppText>
      <AppText variant="small">
        Crie o arquivo .env.local na pasta do projeto (copie de .env.example), preencha a URL e a chave pública do
        Supabase e reinicie com “npx expo start -c”.
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  outer: { backgroundColor: colors.sageTint, alignItems: 'center', justifyContent: 'center' },
  inner: { backgroundColor: colors.roseTint, alignItems: 'center', justifyContent: 'center', margin: spacing.xxs },
});
