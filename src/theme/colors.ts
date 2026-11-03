/**
 * Paleta Vivafit.
 * Cores-base definidas pela marca + tons derivados para texto, superfícies e
 * estados. Pares de texto/fundo foram escolhidos para contraste mínimo de 4.5:1.
 */
export const palette = {
  sage: '#A8BDA5',
  rose: '#D98FA5',
  offWhite: '#FFF9F5',
  plum: '#493D43',
  terracotta: '#D88A62',
} as const;

export const colors = {
  ...palette,

  // Fundo e superfícies
  background: palette.offWhite,
  surface: '#FFFFFF',
  surfaceMuted: '#F3ECE7',

  // Texto
  text: palette.plum,
  textStrong: '#2E2529', // usado sobre terracota/rosa/sálvia (contraste ≥ 4.5:1)
  textMuted: '#75666D',
  textOnDark: palette.offWhite,

  // Tons claros (fundos de cards e chips)
  sageTint: '#E6EDE4',
  roseTint: '#F8E3E9',
  terracottaTint: '#F7E4D9',

  // Tons escuros para texto colorido sobre fundo claro
  sageDeep: '#55704F',
  roseDeep: '#9E4A63',
  terracottaDeep: '#8A4B2E',

  // Linhas e bordas
  border: '#EFE6E0',
  borderStrong: '#9C8C93', // bordas de campos (≥ 3:1)
  divider: '#F1E9E4',

  // Estados
  danger: '#A63D40',
  dangerTint: '#F9E1E1',
  success: '#55704F',
} as const;

export type ColorName = keyof typeof colors;
