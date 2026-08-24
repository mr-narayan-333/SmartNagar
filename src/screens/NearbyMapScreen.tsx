/**
 * NearbyMapScreen — STATIC MOCK map only.
 * Pins sit at hardcoded percentages inside a styled View. There is no
 * react-native-maps, expo-location, GPS, or live tile layer. Do not treat
 * this as a finished map integration.
 */
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MOCK_NEARBY_ISSUES, type NearbyIssue } from '@/lib/nearby-issues';
import type { ReportPriority } from '@/lib/report-draft';
import { colors } from '@/theme/colors';
import { radii, spacing } from '@/theme/spacing';
import { fontFamily, typography } from '@/theme/typography';

type PriorityFilter = 'All' | ReportPriority;

const FILTERS: PriorityFilter[] = ['All', 'High', 'Medium', 'Low'];

function categoryIcon(category: NearbyIssue['category']) {
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

function priorityPinColor(priority: ReportPriority) {
  if (priority === 'High') {
    return colors.error;
  }
  if (priority === 'Medium') {
    return colors.amber;
  }
  return colors.secondary;
}

function priorityBadge(priority: ReportPriority) {
  if (priority === 'High') {
    return { backgroundColor: colors.errorTint, color: colors.error };
  }
  if (priority === 'Medium') {
    return { backgroundColor: colors.amberTint, color: colors.onAmber };
  }
  return { backgroundColor: colors.secondaryTint, color: colors.onSecondaryContainer };
}

export function NearbyMapScreen() {
  const [filter, setFilter] = useState<PriorityFilter>('All');
  const [selectedId, setSelectedId] = useState<string | null>(MOCK_NEARBY_ISSUES[0]?.id ?? null);

  const visible = useMemo(
    () =>
      MOCK_NEARBY_ISSUES.filter((issue) => (filter === 'All' ? true : issue.priority === filter)),
    [filter],
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <MaterialIcons color={colors.primary} name="account-balance" size={22} />
          <Text style={styles.brand}>SmartNagar</Text>
        </View>
        <Text style={styles.caption}>Civic issues near you</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
        contentContainerStyle={styles.chipRow}>
        {FILTERS.map((item) => {
          const active = filter === item;
          return (
            <Pressable
              key={item}
              accessibilityRole="button"
              onPress={() => setFilter(item)}
              style={[styles.chip, active && styles.chipActive]}>
              {item !== 'All' && !active ? (
                <View style={[styles.chipDot, { backgroundColor: priorityPinColor(item) }]} />
              ) : null}
              <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{item}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.mapBox} accessibilityLabel="Static mock nearby issues map">
        <View style={styles.mockChip}>
          <Text style={styles.mockChipText}>Static mock map</Text>
        </View>

        {visible.map((issue) => {
          const selected = issue.id === selectedId;
          const pinColor = priorityPinColor(issue.priority);
          return (
            <Pressable
              key={issue.id}
              accessibilityRole="button"
              accessibilityLabel={`${issue.title}, ${issue.priority} priority`}
              onPress={() => setSelectedId(issue.id)}
              style={[
                styles.pinWrap,
                { top: `${issue.pinTop}%`, left: `${issue.pinLeft}%` },
                selected && styles.pinWrapSelected,
              ]}>
              <View style={[styles.pinHead, { backgroundColor: pinColor }]} />
              <View style={[styles.pinDiamond, { backgroundColor: pinColor }]} />
            </Pressable>
          );
        })}

        <View style={styles.locationPill}>
          <MaterialIcons color={colors.primary} name="location-on" size={14} />
          <Text style={styles.locationPillText}>Civic Road, Central Zone</Text>
        </View>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Nearby issues</Text>
        <View style={styles.countPill}>
          <Text style={styles.countText}>{visible.length} found</Text>
        </View>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}>
        {visible.map((issue) => {
          const selected = issue.id === selectedId;
          const badge = priorityBadge(issue.priority);
          const pinColor = priorityPinColor(issue.priority);
          return (
            <Pressable
              key={issue.id}
              accessibilityRole="button"
              onPress={() => setSelectedId(issue.id)}
              style={[styles.card, selected && styles.cardSelected]}>
              <View style={[styles.cardIcon, { backgroundColor: badge.backgroundColor }]}>
                <MaterialIcons color={pinColor} name={categoryIcon(issue.category)} size={20} />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {issue.title}
                </Text>
                <Text style={styles.cardAddress} numberOfLines={1}>
                  {issue.address}
                </Text>
                <Text style={styles.metaText}>
                  {issue.distance} · {issue.reportedAgo}
                </Text>
              </View>
              <View style={[styles.priorityChip, { backgroundColor: badge.backgroundColor }]}>
                <Text style={[styles.priorityText, { color: badge.color }]}>{issue.priority}</Text>
              </View>
            </Pressable>
          );
        })}

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/report-issue')}
          style={styles.ctaRow}>
          <View style={styles.ctaIcon}>
            <MaterialIcons color={colors.onPrimary} name="add" size={20} />
          </View>
          <Text style={styles.ctaLabel}>Report new issue</Text>
          <MaterialIcons color={colors.primary} name="chevron-right" size={22} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.containerPadding,
    paddingTop: spacing.base,
    paddingBottom: spacing.stackSm,
    backgroundColor: colors.surfaceContainerLowest,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brand: {
    fontFamily: fontFamily.notoSansMedium,
    fontSize: 16,
    lineHeight: 24,
    color: colors.primary,
  },
  caption: {
    fontFamily: fontFamily.interRegular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.onSurfaceVariant,
    marginTop: 4,
    marginLeft: 30,
  },
  chipScroll: {
    flexGrow: 0,
    backgroundColor: colors.surfaceContainerLowest,
  },
  chipRow: {
    paddingHorizontal: spacing.containerPadding,
    paddingVertical: spacing.stackSm,
    gap: 8,
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLowest,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipDot: {
    width: 8,
    height: 8,
    borderRadius: radii.full,
  },
  chipLabel: {
    ...typography.labelMd,
    color: colors.onSurface,
  },
  chipLabelActive: {
    color: colors.onPrimary,
  },
  mapBox: {
    height: 232,
    marginHorizontal: spacing.containerPadding,
    marginTop: spacing.base,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceContainerLow,
    overflow: 'hidden',
    position: 'relative',
  },
  mockChip: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 3,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  mockChipText: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    letterSpacing: 0,
  },
  locationPill: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    zIndex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.full,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  locationPillText: {
    ...typography.labelSm,
    color: colors.onSurface,
    letterSpacing: 0,
  },
  pinWrap: {
    position: 'absolute',
    width: 18,
    height: 24,
    marginLeft: -9,
    marginTop: -24,
    alignItems: 'center',
  },
  pinWrapSelected: {
    zIndex: 2,
    transform: [{ scale: 1.25 }],
  },
  pinHead: {
    width: 16,
    height: 16,
    borderRadius: radii.full,
    zIndex: 1,
  },
  pinDiamond: {
    width: 10,
    height: 10,
    marginTop: -6,
    transform: [{ rotate: '45deg' }],
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.containerPadding,
    paddingTop: spacing.stackMd,
    paddingBottom: spacing.base,
  },
  listTitle: {
    ...typography.labelMd,
    fontSize: 16,
    lineHeight: 24,
    color: colors.onSurface,
  },
  countPill: {
    backgroundColor: colors.secondaryTint,
    borderRadius: radii.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countText: {
    ...typography.labelSm,
    color: colors.onSecondaryContainer,
    letterSpacing: 0,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.containerPadding,
    paddingBottom: spacing.stackMd,
    gap: spacing.stackSm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  cardSelected: {
    borderColor: colors.primary,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
  },
  cardTitle: {
    ...typography.labelMd,
    color: colors.onSurface,
  },
  cardAddress: {
    fontFamily: fontFamily.interRegular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  metaText: {
    fontFamily: fontFamily.interRegular,
    fontSize: 11,
    lineHeight: 14,
    color: colors.outline,
    marginTop: 4,
  },
  priorityChip: {
    borderRadius: radii.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  priorityText: {
    ...typography.labelSm,
    letterSpacing: 0,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: radii.lg,
    backgroundColor: colors.primaryTint,
    marginTop: spacing.base,
  },
  ctaIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaLabel: {
    ...typography.labelMd,
    flex: 1,
    color: colors.primary,
    fontFamily: fontFamily.interSemiBold,
  },
});
