import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { BrandMark, ConfigNotice } from '@/components/cards';
import { AppText, Button, Screen } from '@/components/ui';
import { env } from '@/lib/env';
import { colors, spacing } from '@/theme';

const POINTS = [
  { icon: 'restaurant-outline', text: 'Receitas simples, filtradas pelas suas preferências' },
  { icon: 'barbell-outline', text: 'Treinos curtos para fazer em casa, no seu ritmo' },
  { icon: 'calendar-outline', text: 'Hábitos, sequência de dias e conquistas' },
] as const;

/** Tela de boas-vindas (primeira tela sem sessão). */
export default function WelcomeScreen() {
  return (
    <Screen edges={['top', 'bottom']} contentStyle={styles.content}>
      <View style={styles.hero}>
        <BrandMark size={112} />
        <AppText variant="overline" color="sageDeep" style={styles.kicker}>
          Vivafit
        </AppText>
        <AppText variant="hero" align="center" accessibilityRole="header">
          Cuidar de você, um dia de cada vez.
        </AppText>
        <AppText variant="body" color="textMuted" align="center">
          Alimentação, movimento e constância — sem promessas milagrosas, no ritmo que cabe na sua rotina.
        </AppText>
      </View>

      <View style={styles.points}>
        {POINTS.map((p) => (
          <View key={p.text} style={styles.point}>
            <View style={styles.pointIcon}>
              <Ionicons name={p.icon} size={18} color={colors.plum} />
            </View>
            <AppText variant="small" style={styles.flex}>
              {p.text}
            </AppText>
          </View>
        ))}
      </View>

      {!env.isSupabaseConfigured ? <ConfigNotice /> : null}

      <View style={styles.flex} />

      <View style={styles.actions}>
        <Button label="Criar minha conta" onPress={() => router.push('/cadastro')} />
        <Button label="Já tenho conta" variant="secondary" onPress={() => router.push('/login')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.xxl },
  hero: { alignItems: 'center', gap: spacing.sm },
  kicker: { marginTop: spacing.md },
  points: { gap: spacing.sm, marginTop: spacing.lg },
  point: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  pointIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.sageTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: { flex: 1 },
  actions: { gap: spacing.sm, marginTop: spacing.lg },
});
