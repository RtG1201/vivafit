import { Ionicons } from '@expo/vector-icons';
import { forwardRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputInstance, type TextInputProps } from 'react-native';

import { colors, fonts, radius, spacing } from '@/theme';
import { AppText } from './AppText';

export type TextFieldProps = TextInputProps & {
  label: string;
  error?: string | null;
  hint?: string;
  /** Mostra o botão de exibir/ocultar senha. */
  password?: boolean;
};

/** Campo com rótulo visível, mensagem de erro e opção de mostrar senha. */
export const TextField = forwardRef<TextInputInstance, TextFieldProps>(function TextField(
  { label, error, hint, password = false, style, ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(password);

  const borderColor = error ? colors.danger : focused ? colors.plum : colors.borderStrong;

  return (
    <View style={styles.wrapper}>
      <AppText variant="smallStrong" nativeID={`${label}-label`}>
        {label}
      </AppText>
      <View style={[styles.field, { borderColor, borderWidth: focused || error ? 1.5 : 1 }]}>
        <TextInput
          ref={ref}
          accessibilityLabel={label}
          accessibilityLabelledBy={`${label}-label`}
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.terracotta}
          secureTextEntry={hidden}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          {...rest}
          style={[styles.input, style]}
        />
        {password ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Mostrar senha' : 'Ocultar senha'}
            onPress={() => setHidden((h) => !h)}
            hitSlop={8}
            style={styles.eye}
          >
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <AppText variant="caption" color="danger" accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" color="textMuted">
          {hint}
        </AppText>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: { gap: spacing.xs },
  field: {
    minHeight: 54,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.text,
  },
  eye: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
});
