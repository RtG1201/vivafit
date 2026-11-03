import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

import { colors, layout } from '@/theme';

type Props = {
  favorite: boolean;
  onToggle: () => void;
  recipeTitle: string;
  /** "soft" para usar sobre cartões; "solid" sobre fotos. */
  tone?: 'soft' | 'solid';
};

/** Coração de favoritar. Área de toque de 44 pt, rótulo para leitor de tela. */
export function FavoriteButton({ favorite, onToggle, recipeTitle, tone = 'soft' }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: favorite }}
      accessibilityLabel={favorite ? `Remover ${recipeTitle} das favoritas` : `Salvar ${recipeTitle} nas favoritas`}
      onPress={onToggle}
      hitSlop={6}
      style={({ pressed }) => [
        styles.button,
        tone === 'solid' && styles.solid,
        pressed && { transform: [{ scale: 0.92 }] },
      ]}
    >
      <Ionicons name={favorite ? 'heart' : 'heart-outline'} size={22} color={favorite ? colors.roseDeep : colors.plum} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: layout.minTouchTarget,
    height: layout.minTouchTarget,
    borderRadius: layout.minTouchTarget / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  solid: { backgroundColor: 'rgba(255, 249, 245, 0.92)' },
});
