import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import { radii, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export function SubmissionSuccessScreen() {
  const { ticketId } = useLocalSearchParams<{ ticketId?: string }>();
  const displayId = ticketId && ticketId.length > 0 ? ticketId : 'JRK000000';
  const dateLabel = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <MaterialIcons color={colors.onSecondaryContainer} name="check-circle" size={48} />
        </View>

        <Text style={styles.title}>Issue Reported Successfully</Text>
        <Text style={styles.subtitle}>
          Thank you for bringing this to our attention. Your report has been logged and assigned to
          the relevant department.
        </Text>

        <View style={styles.ticket}>
          <Text style={styles.ticketLabel}>Ticket ID</Text>
          <View style={styles.ticketIdRow}>
            <MaterialIcons color={colors.outline} name="tag" size={22} />
            <Text style={styles.ticketId}>{displayId}</Text>
          </View>
          <View style={styles.ticketMeta}>
            <View>
              <Text style={styles.metaLabel}>Date</Text>
              <Text style={styles.metaValue}>{dateLabel}</Text>
            </View>
            <View style={styles.statusBlock}>
              <Text style={styles.metaLabel}>Status</Text>
              <View style={styles.statusChip}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Received</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            icon="assignment"
            label="Track in My Reports"
            onPress={() => router.replace('/reports')}
          />
          <Button label="Back to Home" variant="outline" onPress={() => router.replace('/home')} />
        </View>
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
    alignItems: 'center',
    paddingHorizontal: spacing.containerPadding,
  },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: radii.full,
    backgroundColor: colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.stackMd,
  },
  title: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: spacing.stackSm,
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: spacing.stackLg,
    maxWidth: 360,
  },
  ticket: {
    width: '100%',
    maxWidth: 448,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radii.xl,
    padding: spacing.stackMd,
    marginBottom: spacing.stackLg,
  },
  ticketLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: spacing.base,
  },
  ticketIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ticketId: {
    ...typography.headlineMd,
    color: colors.primary,
    letterSpacing: 1,
  },
  ticketMeta: {
    marginTop: spacing.stackSm,
    paddingTop: spacing.stackSm,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  metaValue: {
    ...typography.bodyMd,
    color: colors.onSurface,
  },
  statusBlock: {
    alignItems: 'flex-end',
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.secondaryTint,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.onSecondaryContainer,
  },
  statusText: {
    ...typography.labelMd,
    color: colors.onSecondaryContainer,
  },
  actions: {
    width: '100%',
    maxWidth: 448,
    gap: 12,
  },
});
