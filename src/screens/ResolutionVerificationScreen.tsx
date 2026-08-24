import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useSyncExternalStore } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import {
  getCitizenReportById,
  getCitizenReports,
  ISSUE_TYPES,
  MOCK_LOCATION,
  subscribeCitizenReports,
  updateCitizenReport,
} from '@/lib/report-draft';
import { colors } from '@/theme/colors';
import { radii, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function nowStamp() {
  return new Date().toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ResolutionVerificationScreen() {
  const params = useLocalSearchParams<{ reportId?: string | string[] }>();
  const reportId = firstParam(params.reportId);
  const reports = useSyncExternalStore(subscribeCitizenReports, getCitizenReports, getCitizenReports);
  const report = useMemo(
    () => (reportId ? getCitizenReportById(reportId) : undefined),
    [reportId, reports],
  );

  const categoryLabel =
    ISSUE_TYPES.find((item) => item.value === report?.category)?.label ?? report?.title ?? 'Issue';

  function handleVerified() {
    if (!reportId) {
      return;
    }
    const stamp = nowStamp();
    updateCitizenReport(reportId, (current) => ({
      ...current,
      status: 'Verified',
      timeline: [
        ...current.timeline
          .filter((step) => step.key !== 'verified')
          .map((step) => ({ ...step, state: 'done' as const })),
        {
          key: 'verified',
          title: 'Verified',
          timestamp: stamp,
          detail: 'Citizen confirmed the resolution.',
          state: 'current',
        },
      ],
    }));
    router.back();
  }

  function handleReopen() {
    if (!reportId) {
      return;
    }
    const stamp = nowStamp();
    updateCitizenReport(reportId, (current) => ({
      ...current,
      status: 'In Progress',
      timeline: current.timeline
        .filter((step) => step.key !== 'verified')
        .map((step) => {
          if (step.key === 'in-progress') {
            return {
              ...step,
              state: 'current' as const,
              timestamp: stamp,
              detail: 'Ticket reopened by citizen for further work.',
            };
          }
          if (step.key === 'resolved') {
            return { ...step, state: 'pending' as const, timestamp: undefined, detail: undefined };
          }
          return { ...step, state: 'done' as const };
        }),
    }));
    router.back();
  }

  if (!report) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.missing}>
          <Text style={styles.title}>Report not found</Text>
          <Button label="Back to My Reports" variant="outline" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()} style={styles.backRow}>
          <MaterialIcons color={colors.onSurfaceVariant} name="arrow-back" size={18} />
          <Text style={styles.backLabel}>Back to Issues</Text>
          <Text style={styles.crumbSep}>/</Text>
          <Text style={styles.crumbTicket}>{report.ticketId}</Text>
        </Pressable>

        <View style={styles.badgeRow}>
          <View style={styles.resolvedBadge}>
            <MaterialIcons color={colors.onSecondaryContainer} name="check-circle" size={14} />
            <Text style={styles.resolvedBadgeText}>Marked as Resolved</Text>
          </View>
          <Text style={styles.reportedWhen}>Reported {report.dateLabel}</Text>
        </View>

        <Text style={styles.title}>Issue Resolved</Text>
        <Text style={styles.lede}>
          Please verify the repairs completed for {categoryLabel.toLowerCase()} ({report.ticketId}
          ).
        </Text>

        <View style={styles.card}>
          <View style={styles.cardHeading}>
            <MaterialIcons color={colors.primary} name="compare" size={22} />
            <Text style={styles.cardTitle}>Visual Verification</Text>
          </View>

          <View style={styles.photoColumn}>
            <View style={styles.photoBlock}>
              <View style={styles.photoFrame}>
                <View style={styles.beforeTag}>
                  <Text style={styles.tagText}>Before</Text>
                </View>
                {report.photoUri ? (
                  <Image contentFit="cover" source={{ uri: report.photoUri }} style={styles.photo} />
                ) : (
                  <View style={styles.photoFallback}>
                    <MaterialIcons color={colors.outline} name="image" size={36} />
                  </View>
                )}
              </View>
              <Text style={styles.photoCaptionTitle}>Reported Condition</Text>
              <Text style={styles.photoCaptionMeta}>{report.dateLabel}</Text>
            </View>

            <View style={styles.photoBlock}>
              <View style={[styles.photoFrame, styles.afterFrame]}>
                <View style={styles.afterTag}>
                  <MaterialIcons color={colors.onPrimary} name="verified" size={14} />
                  <Text style={styles.tagText}>After</Text>
                </View>
                <View style={styles.photoFallback}>
                  <MaterialIcons color={colors.secondary} name="verified" size={40} />
                  <Text style={styles.afterPlaceholder}>Resolved site (mock)</Text>
                </View>
              </View>
              <Text style={styles.photoCaptionTitle}>Contractor Submission</Text>
              <Text style={styles.photoCaptionMeta}>Mock resolved photo</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.metaLabel}>Category</Text>
          <Text style={styles.metaValue}>{categoryLabel}</Text>
          <Text style={[styles.metaLabel, styles.metaSpacer]}>Ticket ID</Text>
          <Text style={styles.metaValue}>{report.ticketId}</Text>
          <Text style={[styles.metaLabel, styles.metaSpacer]}>Location</Text>
          <View style={styles.locationRow}>
            <MaterialIcons color={colors.outline} name="location-on" size={20} />
            <Text style={styles.metaValue}>{MOCK_LOCATION.address}</Text>
          </View>
        </View>

        <View style={styles.promptCard}>
          <Text style={styles.promptTitle}>Is this issue resolved?</Text>
          <Text style={styles.promptBody}>
            Your verification ensures contractor accountability. Once closed, this ticket cannot be
            reopened.
          </Text>
          <Button icon="check" label="Yes, Resolved" onPress={handleVerified} />
          <Button icon="refresh" label="Reopen" variant="outline" onPress={handleReopen} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.containerPadding,
    paddingBottom: spacing.stackLg,
  },
  missing: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.containerPadding,
    gap: spacing.stackSm,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.stackMd,
  },
  backLabel: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
  crumbSep: {
    ...typography.labelMd,
    color: colors.outline,
  },
  crumbTicket: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  resolvedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.secondaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  resolvedBadgeText: {
    ...typography.labelSm,
    color: colors.onSecondaryContainer,
  },
  reportedWhen: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  title: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
    marginBottom: 8,
  },
  lede: {
    ...typography.bodyLg,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.stackLg,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radii.xl,
    padding: spacing.stackMd,
    marginBottom: spacing.stackLg,
  },
  cardHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.stackSm,
  },
  cardTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
  },
  photoColumn: {
    gap: spacing.gutter,
  },
  photoBlock: {
    gap: 8,
  },
  photoFrame: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: radii.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainer,
  },
  afterFrame: {
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.secondaryTint,
  },
  afterPlaceholder: {
    ...typography.labelSm,
    color: colors.onSecondaryContainer,
  },
  beforeTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 1,
    backgroundColor: colors.error,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radii.md,
  },
  afterTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radii.md,
  },
  tagText: {
    ...typography.labelSm,
    color: colors.onPrimary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  photoCaptionTitle: {
    ...typography.labelMd,
    color: colors.onSurface,
  },
  photoCaptionMeta: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  metaLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  metaSpacer: {
    marginTop: spacing.stackMd,
  },
  metaValue: {
    ...typography.bodyMd,
    color: colors.onSurface,
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  promptCard: {
    backgroundColor: colors.surfaceContainer,
    borderWidth: 1,
    borderColor: colors.primaryContainer,
    borderRadius: radii.xl,
    padding: spacing.stackMd,
    gap: 12,
    alignItems: 'stretch',
  },
  promptTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
    textAlign: 'center',
  },
  promptBody: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: spacing.stackSm,
  },
});
