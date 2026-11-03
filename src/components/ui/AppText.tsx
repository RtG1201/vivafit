import { Text, type TextProps } from 'react-native';

import { colors, textVariants, type ColorName, type TextVariant } from '@/theme';

export type AppTextProps = TextProps & {
  variant?: TextVariant;
  color?: ColorName;
  align?: 'left' | 'center' | 'right';
};

/** Texto padrão do app: aplica fonte, tamanho e cor do tema. */
export function AppText({ variant = 'body', color = 'text', align, style, ...rest }: AppTextProps) {
  return (
    <Text
      maxFontSizeMultiplier={1.6}
      {...rest}
      style={[textVariants[variant], { color: colors[color] }, align && { textAlign: align }, style]}
    />
  );
}
