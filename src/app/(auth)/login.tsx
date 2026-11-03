import { Link } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, View, type TextInputInstance } from 'react-native';

import { ConfigNotice } from '@/components/cards';
import { AppText, Button, Card, Screen, TextField } from '@/components/ui';
import { env } from '@/lib/env';
import { authErrorMessage, isValidEmail, signInWithEmail } from '@/services/auth';
import { spacing } from '@/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef<TextInputInstance>(null);

  async function handleSubmit() {
    const next: typeof errors = {};
    if (!isValidEmail(email)) next.email = 'Digite um e-mail válido.';
    if (!password) next.password = 'Digite sua senha.';
    setErrors(next);
    setFormError(null);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      await signInWithEmail(email, password);
      // A troca de tela acontece sozinha quando a sessão muda (rotas protegidas).
    } catch (e) {
      setFormError(authErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen edges={['bottom']} keyboard>
      <View style={styles.header}>
        <AppText variant="title" accessibilityRole="header">
          Que bom te ver de novo
        </AppText>
        <AppText variant="body" color="textMuted">
          Entre com o e-mail e a senha da sua conta.
        </AppText>
      </View>

      {!env.isSupabaseConfigured ? <ConfigNotice /> : null}

      <View style={styles.form}>
        <TextField
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          textContentType="emailAddress"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          placeholder="voce@email.com"
        />
        <TextField
          ref={passwordRef}
          label="Senha"
          password
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={handleSubmit}
        />
      </View>

      {formError ? (
        <Card tone="rose" style={styles.alert}>
          <AppText variant="small" color="textStrong" accessibilityRole="alert">
            {formError}
          </AppText>
        </Card>
      ) : null}

      <Button label="Entrar" onPress={handleSubmit} loading={loading} disabled={!env.isSupabaseConfigured} />

      <View style={styles.footer}>
        <AppText variant="small" color="textMuted">
          Ainda não tem conta?
        </AppText>
        <Link href="/cadastro" replace asChild>
          <Pressable accessibilityRole="link" hitSlop={10} style={styles.link}>
            <AppText variant="smallStrong" style={styles.underline}>
              Criar conta
            </AppText>
          </Pressable>
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.xs, marginBottom: spacing.xs },
  form: { gap: spacing.md },
  alert: { paddingVertical: spacing.sm },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  link: { minHeight: 44, justifyContent: 'center' },
  underline: { textDecorationLine: 'underline' },
});
