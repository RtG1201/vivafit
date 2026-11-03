import { Link, router } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, View, type TextInputInstance } from 'react-native';

import { ConfigNotice } from '@/components/cards';
import { AppText, Button, Card, Screen, TextField } from '@/components/ui';
import { env } from '@/lib/env';
import { authErrorMessage, isValidEmail, signUpWithEmail } from '@/services/auth';
import { spacing } from '@/theme';

const MIN_PASSWORD = 8;

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const emailRef = useRef<TextInputInstance>(null);
  const passwordRef = useRef<TextInputInstance>(null);
  const confirmRef = useRef<TextInputInstance>(null);

  async function handleSubmit() {
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = 'Conte como podemos te chamar.';
    if (!isValidEmail(email)) next.email = 'Digite um e-mail válido.';
    if (password.length < MIN_PASSWORD) next.password = `Use pelo menos ${MIN_PASSWORD} caracteres.`;
    if (confirm !== password) next.confirm = 'As senhas não são iguais.';
    setErrors(next);
    setFormError(null);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      const { needsConfirmation } = await signUpWithEmail(name, email, password);
      if (needsConfirmation) setSentTo(email.trim());
      // Sem confirmação obrigatória, a sessão já existe e o app abre o painel sozinho.
    } catch (e) {
      setFormError(authErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  if (sentTo) {
    return (
      <Screen edges={['bottom']}>
        <View style={styles.header}>
          <AppText variant="title" accessibilityRole="header">
            Confira seu e-mail
          </AppText>
          <AppText variant="body" color="textMuted">
            Enviamos um link de confirmação para {sentTo}. Depois de confirmar, volte aqui e entre com seu e-mail e senha.
          </AppText>
        </View>
        <Button label="Ir para o login" onPress={() => router.replace('/login')} />
      </Screen>
    );
  }

  return (
    <Screen edges={['bottom']} keyboard>
      <View style={styles.header}>
        <AppText variant="title" accessibilityRole="header">
          Crie sua conta
        </AppText>
        <AppText variant="body" color="textMuted">
          Leva menos de um minuto. Seus dados ficam protegidos na sua conta.
        </AppText>
      </View>

      {!env.isSupabaseConfigured ? <ConfigNotice /> : null}

      <View style={styles.form}>
        <TextField
          label="Nome"
          value={name}
          onChangeText={setName}
          error={errors.name}
          autoComplete="given-name"
          textContentType="givenName"
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
          placeholder="Como prefere ser chamada"
        />
        <TextField
          ref={emailRef}
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
          hint={`Mínimo de ${MIN_PASSWORD} caracteres.`}
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="next"
          onSubmitEditing={() => confirmRef.current?.focus()}
        />
        <TextField
          ref={confirmRef}
          label="Confirme a senha"
          password
          value={confirm}
          onChangeText={setConfirm}
          error={errors.confirm}
          autoComplete="new-password"
          textContentType="newPassword"
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

      <Button label="Criar conta" onPress={handleSubmit} loading={loading} disabled={!env.isSupabaseConfigured} />

      <View style={styles.footer}>
        <AppText variant="small" color="textMuted">
          Já tem conta?
        </AppText>
        <Link href="/login" replace asChild>
          <Pressable accessibilityRole="link" hitSlop={10} style={styles.link}>
            <AppText variant="smallStrong" style={styles.underline}>
              Entrar
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
