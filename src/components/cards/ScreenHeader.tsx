import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';

/** Cabeçalho das abas: título serifado + subtítulo. */
export function ScreenHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.wrap}>
      <AppText variant="title" accessibilityRole="header">
        {title}
      </AppText>
      {subtitle ? (
        <AppText variant="body" color="textMuted">
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({ wrap: { gap: 4, marginTop: 8 } });
