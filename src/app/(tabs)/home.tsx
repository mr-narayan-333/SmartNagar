import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export default function HomeTab() {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>Home</Text>
        <Text style={styles.body}>
          Start a civic report from here. Use the tabs below to view reports, map, and rewards.
        </Text>
        <Button
          icon="add-a-photo"
          label="Report an issue"
          onPress={() => router.push('/report-issue')}
        />
        <Button label="Sign out" variant="outline" onPress={() => router.replace('/')} />
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
    marginBottom: spacing.stackMd,
  },
});
