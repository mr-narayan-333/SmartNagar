import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type ComingSoonScreenProps = {
  title: string;
  message: string;
};

export function ComingSoonScreen({ title, message }: ComingSoonScreenProps) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{message}</Text>
        <Text style={styles.soon}>Coming soon</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.containerPadding,
    gap: spacing.stackSm,
  },
  title: {
    ...typography.headlineLgMobile,
    color: colors.primary,
  },
  body: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  soon: {
    ...typography.labelMd,
    color: colors.onSecondaryContainer,
  },
});
