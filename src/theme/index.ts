export { colors, palette } from './colors';
export type { ColorName } from './colors';
export { fonts, textVariants } from './typography';
export type { TextVariant } from './typography';

/** Escala de espaçamento (múltiplos de 4). */
export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 12,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
} as const;

/** Largura máxima do conteúdo em tablets / telas largas. */
export const layout = {
  maxContentWidth: 640,
  screenPadding: 20,
  minTouchTarget: 44,
} as const;

export const shadow = {
  card: {
    shadowColor: '#493D43',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
} as const;
