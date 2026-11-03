import type { TextStyle } from 'react-native';

/**
 * Famílias carregadas em src/app/_layout.tsx via @expo-google-fonts.
 * Fraunces (serifada, títulos) + DM Sans (texto e interface).
 */
export const fonts = {
  display: 'Fraunces_500Medium',
  displaySemiBold: 'Fraunces_600SemiBold',
  displayItalic: 'Fraunces_400Regular_Italic',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodySemiBold: 'DMSans_600SemiBold',
  bodyBold: 'DMSans_700Bold',
} as const;

export const textVariants = {
  hero: { fontFamily: fonts.display, fontSize: 36, lineHeight: 42, letterSpacing: -0.5 },
  title: { fontFamily: fonts.display, fontSize: 30, lineHeight: 36, letterSpacing: -0.4 },
  heading: { fontFamily: fonts.display, fontSize: 22, lineHeight: 28, letterSpacing: -0.2 },
  subheading: { fontFamily: fonts.display, fontSize: 19, lineHeight: 25 },
  quote: { fontFamily: fonts.displayItalic, fontSize: 18, lineHeight: 26 },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24 },
  bodyStrong: { fontFamily: fonts.bodySemiBold, fontSize: 16, lineHeight: 24 },
  small: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20 },
  smallStrong: { fontFamily: fonts.bodySemiBold, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18 },
  overline: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  stat: { fontFamily: fonts.display, fontSize: 48, lineHeight: 52, letterSpacing: -1 },
} satisfies Record<string, TextStyle>;

export type TextVariant = keyof typeof textVariants;
