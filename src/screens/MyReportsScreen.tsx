import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { getCurrentUser, supabase } from '@/lib/supabase';
import { colors } from '@/theme/colors';
import { radii, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type ReportPriority = 'High' | 'Medium' | 'Low';
type ReportStatus = 'Reported' | 'Assigned' | 'In Progress' | 'Resolved' | 'Verified';
type TimelineState = 'done' | 'current' | 'pending';

type ReportRow = {
  id: string;
  ticket_id: string;
  title: string;
  category: string;
  description: string;
  status: string;
  created_at: string;
  location_text?: string | null;
};

type TimelineItem = {
  key: string;
  title: string;
  timestamp?: string;
  detail?: string;
  state: TimelineState;
};

type ReportListItem = {
  id: string;
  ticketId: string;
  title: string;
  description: string;
  category: string;
  priority: ReportPriority;
  status: ReportStatus;
  dateLabel: string;
  photoUri?: string;
  timeline: TimelineItem[];
};

function categoryIcon(category: string) {
  switch (category) {
    case 'streetlight':
      return 'lightbulb' as const;
    case 'pothole':
      return 'add-road' as const;
    case 'garbage':
      return 'delete' as const;
    case 'drainage':
      return 'water-drop' as const;
    default:
      return 'report' as const;
  }
}

function statusStyles(status: ReportStatus | string) {
  if (status === 'In Progress') {
    return { backgroundColor: colors.primaryTint, color: colors.primary };
  }
  if (status === 'Resolved') {
    return { backgroundColor: colors.secondaryTint, color: colors.onSecondaryContainer };
  }
  if (status === 'Verified') {
    return { backgroundColor: colors.secondaryContainer, color: colors.onSecondaryContainer };
  }
  return { backgroundColor: colors.surfaceContainer, color: colors.onSurfaceVariant };
}

function priorityStyles(priority: ReportPriority) {
  if (priority === 'High') {
    return { backgroundColor: colors.primaryTint, color: colors.error };
  }
  if (priority === 'Medium') {
    return { backgroundColor: colors.surfaceContainer, color: colors.primary };
  }
  return { backgroundColor: colors.surfaceContainerLow, color: colors.onSurfaceVariant };
}

function timelineDotStyle(state: TimelineState) {
  if (state === 'done') {
    return { backgroundColor: colors.secondary, borderColor: colors.surfaceContainerLowest };
  }
  if (state === 'current') {
    return { backgroundColor: colors.primary, borderColor: colors.surfaceContainerLowest };
  }
  return { backgroundColor: colors.surfaceContainer, borderColor: colors.outlineVariant };
}

function timelineIcon(state: TimelineState, title: string) {
  if (state === 'pending') {
    return 'radio-button-unchecked' as const;
  }
  if (title === 'In Progress') {
    return 'handyman' as const;
  }
  if (title === 'Resolved') {
    return 'task-alt' as const;
  }
  if (title === 'Verified') {
    return 'verified-user' as const;
  }
  return 'check' as const;
}

export function MyReportsScreen() {
  const [reports, setReports] = useState<ReportListItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadReports() {
      const { data: userData, error: userError } = await getCurrentUser();
      if (userError || !userData.user) {
        if (active) {
          setReports([]);
          setExpandedId(null);
        }
        return;
      }

      const { data, error } = await supabase
        .from('civic_issues')
        .select('*')
        .eq('reporter_id', userData.user.id)
        .order('created_at', { ascending: false });

      if (!active) {
        return;
      }

      if (error) {
        setReports([]);
        setExpandedId(null);
        return;
      }

      const mapped: ReportListItem[] = (data ?? []).map((issue: ReportRow) => {
        const status = (issue.status as ReportStatus) || 'Reported';
        const category = issue.category || 'others';
        const priority: ReportPriority =
          category === 'pothole' || category === 'drainage'
            ? 'High'
            : category === 'streetlight'
              ? 'Medium'
              : 'Low';
        const dateLabel = new Date(issue.created_at).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
        });

        const reportedState: TimelineState = status === 'Reported' ? 'current' : 'done';
        const assignedState: TimelineState =
          status === 'Assigned' ? 'current' : status === 'In Progress' || status === 'Resolved' || status === 'Verified' ? 'done' : 'pending';
        const inProgressState: TimelineState =
          status === 'In Progress' ? 'current' : status === 'Resolved' || status === 'Verified' ? 'done' : 'pending';
        const resolvedState: TimelineState =
          status === 'Resolved' || status === 'Verified' ? 'done' : 'pending';

        const timeline: TimelineItem[] = [
          {
            key: 'reported',
            title: 'Reported',
            timestamp: `${dateLabel}, ${new Date(issue.created_at).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            })}`,
            detail: issue.location_text || 'Issue reported by citizen.',
            state: reportedState,
          },
          { key: 'assigned', title: 'Assigned', state: assignedState },
          { key: 'in-progress', title: 'In Progress', state: inProgressState },
          { key: 'resolved', title: 'Resolved', state: resolvedState },
        ];

        return {
          id: issue.id,
          ticketId: issue.ticket_id,
          title: issue.title,
          description: issue.description,
          category,
          priority,
          status,
          dateLabel,
          timeline,
        };
      });

      setReports(mapped);
      setExpandedId((current) => current ?? mapped[0]?.id ?? null);
    }

    void loadReports();

    return () => {
      active = false;
    };
  }, []);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.headingRow}>
          <View style={styles.headingCopy}>
            <Text style={styles.title}>My Reports</Text>
            <Text style={styles.subtitle}>Track the status of issues you've reported.</Text>
          </View>
        </View>

        <View style={styles.toolbar}>
          <Button
            icon="add"
            label="New Report"
            onPress={() => router.push('/report-issue')}
            style={styles.toolbarButton}
          />
        </View>

        <View style={styles.list}>
          {reports.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons color={colors.outline} name="assignment" size={32} />
              <Text style={styles.emptyTitle}>No reports yet</Text>
              <Text style={styles.emptyDescription}>Your submitted civic issues will appear here once you file the first report.</Text>
            </View>
          ) : (
            reports.map((report) => {
              const expanded = expandedId === report.id;
              const status = statusStyles(report.status);
              const priority = priorityStyles(report.priority);

            return (
              <Pressable
                key={report.id}
                onPress={() => setExpandedId(expanded ? null : report.id)}
                style={[styles.card, expanded && styles.cardExpanded]}>
                <View style={styles.cardBody}>
                  <View style={styles.thumb}>
                    {report.photoUri ? (
                      <Image contentFit="cover" source={{ uri: report.photoUri }} style={styles.thumbImage} />
                    ) : (
                      <MaterialIcons
                        color={colors.outline}
                        name={categoryIcon(report.category)}
                        size={32}
                      />
                    )}
                  </View>
                  <View style={styles.cardCopy}>
                    <View style={styles.cardTop}>
                      <Text numberOfLines={1} style={styles.cardTitle}>
                        {report.title}
                      </Text>
                      <View style={[styles.chip, { backgroundColor: status.backgroundColor }]}>
                        <Text style={[styles.chipText, { color: status.color }]}>{report.status}</Text>
                      </View>
                    </View>
                    <Text numberOfLines={1} style={styles.cardDescription}>
                      {report.description}
                    </Text>
                    <View style={styles.metaRow}>
                      <View style={[styles.priorityChip, { backgroundColor: priority.backgroundColor }]}>
                        <Text style={[styles.chipText, { color: priority.color }]}>{report.priority}</Text>
                      </View>
                      <Text style={styles.metaText}>{report.dateLabel}</Text>
                      <Text style={styles.refText}>{report.ticketId}</Text>
                    </View>
                  </View>
                </View>

                {expanded ? (
                  <View style={styles.timeline}>
                    <Text style={styles.timelineTitle}>Status Updates</Text>
                    {report.timeline.map((step, index) => {
                      const iconColor =
                        step.state === 'pending' ? colors.outline : colors.onPrimary;
                      return (
                        <View key={step.key} style={styles.step}>
                          {index < report.timeline.length - 1 ? <View style={styles.stepLine} /> : null}
                          <View style={[styles.dot, timelineDotStyle(step.state)]}>
                            <MaterialIcons
                              color={iconColor}
                              name={timelineIcon(step.state, step.title)}
                              size={14}
                            />
                          </View>
                          <View style={styles.stepCopy}>
                            <View style={styles.stepHeader}>
                              <Text
                                style={[
                                  styles.stepTitle,
                                  step.state === 'current' && styles.stepTitleCurrent,
                                  step.state === 'pending' && styles.stepTitlePending,
                                ]}>
                                {step.title}
                              </Text>
                              {step.timestamp ? (
                                <Text style={styles.stepTime}>{step.timestamp}</Text>
                              ) : null}
                            </View>
                            {step.detail ? <Text style={styles.stepDetail}>{step.detail}</Text> : null}
                          </View>
                        </View>
                      );
                    })}
                    {report.status === 'Resolved' ? (
                      <Button
                        icon="verified-user"
                        label="Verify Resolution"
                        onPress={() =>
                          router.push({
                            pathname: '/resolution-verification',
                            params: { reportId: report.id },
                          })
                        }
                      />
                    ) : null}
                  </View>
                ) : null}
              </Pressable>
            );
            })
          )}
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
  headingRow: {
    marginBottom: spacing.stackSm,
  },
  headingCopy: {
    gap: 4,
  },
  title: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  toolbar: {
    marginBottom: spacing.stackMd,
  },
  toolbarButton: {
    alignSelf: 'flex-start',
    minHeight: 44,
    paddingHorizontal: 16,
  },
  list: {
    gap: spacing.gutter,
  },
  emptyState: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radii.xl,
    padding: spacing.stackMd,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    ...typography.labelMd,
    color: colors.onSurface,
  },
  emptyDescription: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radii.xl,
    overflow: 'hidden',
  },
  cardExpanded: {
    borderColor: colors.primary,
  },
  cardBody: {
    flexDirection: 'row',
    gap: 16,
    padding: spacing.stackMd,
  },
  thumb: {
    width: 80,
    height: 80,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  cardCopy: {
    flex: 1,
    minWidth: 0,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: {
    ...typography.labelMd,
    color: colors.onSurface,
    flex: 1,
  },
  cardDescription: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    fontSize: 14,
    marginBottom: 8,
  },
  chip: {
    borderRadius: radii.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  chipText: {
    ...typography.labelSm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityChip: {
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  metaText: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  refText: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginLeft: 'auto',
  },
  timeline: {
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLowest,
    padding: spacing.stackMd,
  },
  timelineTitle: {
    ...typography.labelMd,
    color: colors.onSurface,
    marginBottom: 16,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: 16,
    position: 'relative',
  },
  stepLine: {
    position: 'absolute',
    left: 11,
    top: 24,
    bottom: 0,
    width: 2,
    backgroundColor: colors.outlineVariant,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepCopy: {
    flex: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  stepTitle: {
    ...typography.labelMd,
    color: colors.onSurface,
  },
  stepTitleCurrent: {
    color: colors.primary,
  },
  stepTitlePending: {
    color: colors.outline,
  },
  stepTime: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  stepDetail: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    fontSize: 14,
    marginTop: 4,
  },
});
