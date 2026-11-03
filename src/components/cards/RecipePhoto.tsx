import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { Image, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/ui';
import { colors } from '@/theme';
import type { MealType } from '@/types/database';

type IconName = ComponentProps<typeof Ionicons>['name'];

const LOOK: Record<MealType, { bg: string; icon: IconName }> = {
  cafe: { bg: colors.terracottaTint, icon: 'cafe-outline' },
  almoco: { bg: colors.sageTint, icon: 'restaurant-outline' },
  lanche: { bg: colors.roseTint, icon: 'nutrition-outline' },
  jantar: { bg: colors.surfaceMuted, icon: 'moon-outline' },
};

type Props = {
  uri: string | null | undefined;
  mealType: MealType;
  title: string;
  style?: StyleProp<ViewStyle>;
  /** Mostra "Foto em breve" no espaço vazio (usado no detalhe). */
  showPendingLabel?: boolean;
  iconSize?: number;
};

/**
 * Foto do prato. Enquanto a receita não tiver foto (image_url vazio) ou se a
 * imagem falhar ao carregar, mostra um espaço ilustrado na cor da refeição.
 */
export function RecipePhoto({ uri, mealType, title, style, showPendingLabel = false, iconSize = 28 }: Props) {
  const [failed, setFailed] = useState(false);
  const look = LOOK[mealType] ?? LOOK.almoco;
  const hasPhoto = !!uri && !failed;

  return (
    <View style={[styles.box, { backgroundColor: look.bg }, style]}>
      {hasPhoto ? (
        <Image
          source={{ uri }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
          accessible
          accessibilityLabel={`Foto: ${title}`}
          onError={() => setFailed(true)}
        />
      ) : (
        <View style={styles.placeholder} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <Ionicons name={look.icon} size={iconSize} color={colors.plum} />
          {showPendingLabel ? (
            <AppText variant="caption" color="textMuted">
              Foto em breve
            </AppText>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  placeholder: { alignItems: 'center', justifyContent: 'center', gap: 6 },
});
