/**
 * RewardsScreen — STATIC MOCK civic points, leaderboard, and badges.
 * Totals are not computed from report-draft.ts.
 */
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  MOCK_BADGES,
  MOCK_CIVIC_POINTS,
  MOCK_LEADERBOARD,
  MOCK_REWARD_ACTIVITY,
  MOCK_USER_RANK,
} from '@/lib/rewards-mock';
import { colors } from '@/theme/colors';
import { radii, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function RewardsScreen() {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.brandRow}>
          <MaterialIcons color={colors.primary} name="account-balance" size={22} />
          <Text style={styles.brand}>SmartNagar</Text>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Community Recognition</Text>
          <Text style={styles.heroBody}>Thank you for contributing to a better city.</Text>
          <View style={styles.pointsCard}>
            <View style={styles.pointsIcon}>
              <MaterialIcons color={colors.onSecondaryContainer} name="workspace-premium" size={22} />
            </View>
            <View>
              <Text style={styles.pointsLabel}>Civic Points</Text>
              <Text style={styles.pointsValue}>{MOCK_CIVIC_POINTS.toLocaleString('en-IN')}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <View style={styles.sectionTitleRow}>
              <MaterialIcons color={colors.primary} name="leaderboard" size={22} />
              <Text style={styles.sectionTitle}>City Leaderboard</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillText}>Mock Top 6</Text>
            </View>
          </View>

          {MOCK_LEADERBOARD.map((entry) => (
            <View
              key={entry.rank}
              style={[styles.rankRow, entry.rank === 1 && styles.rankRowLead]}>
              {entry.rank === 1 ? <View style={styles.rankAccent} /> : null}
              <View style={[styles.rankBadge, entry.rank === 1 && styles.rankBadgeLead]}>
                <Text style={[styles.rankNum, entry.rank === 1 && styles.rankNumLead]}>{entry.rank}</Text>
              </View>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials(entry.name)}</Text>
              </View>
              <View style={styles.rankMeta}>
                <Text style={styles.rankName}>{entry.name}</Text>
                <Text style={styles.rankZone}>{entry.zone}</Text>
              </View>
              <Text style={styles.rankPoints}>{entry.points.toLocaleString('en-IN')} pt</Text>
            </View>
          ))}

          <View style={styles.youRow}>
            <Text style={styles.youRank}>{MOCK_USER_RANK}</Text>
            <View style={[styles.avatar, styles.youAvatar]}>
              <Text style={styles.youAvatarText}>You</Text>
            </View>
            <View style={styles.rankMeta}>
              <Text style={styles.rankName}>You</Text>
              <Text style={styles.rankZone}>Central Zone</Text>
            </View>
            <Text style={styles.rankPoints}>{MOCK_CIVIC_POINTS.toLocaleString('en-IN')} pt</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons color={colors.primary} name="verified" size={22} />
            <Text style={styles.sectionTitle}>Civic Badges</Text>
          </View>
          <Text style={styles.sectionLede}>Milestones achieved for improving your city.</Text>

          <View style={styles.badgeGrid}>
            {MOCK_BADGES.map((badge) => (
              <View key={badge.id} style={[styles.badgeCard, !badge.earned && styles.badgeLocked]}>
                {badge.earned ? (
                  <MaterialIcons
                    color={colors.secondary}
                    name="check-circle"
                    size={16}
                    style={styles.badgeCheck}
                  />
                ) : null}
                <View
                  style={[
                    styles.badgeIcon,
                    badge.earned ? styles.badgeIconEarned : styles.badgeIconLocked,
                  ]}>
                  <MaterialIcons
                    color={badge.earned ? colors.onSecondaryContainer : colors.outline}
                    name={badge.icon}
                    size={28}
                  />
                </View>
                <Text style={styles.badgeTitle}>{badge.title}</Text>
                <Text style={styles.badgeDetail}>{badge.detail}</Text>
                {!badge.earned && badge.progressPct != null ? (
                  <>
                    <View style={styles.progressTrack}>
                      <View style={[styles.progressFill, { width: `${badge.progressPct}%` }]} />
                    </View>
                    <Text style={styles.progressLabel}>{badge.progressLabel}</Text>
                  </>
                ) : null}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons color={colors.primary} name="history" size={22} />
            <Text style={styles.sectionTitle}>Recent Activity</Text>
          </View>
          {MOCK_REWARD_ACTIVITY.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.activityRow,
                index < MOCK_REWARD_ACTIVITY.length - 1 && styles.activityBorder,
              ]}>
              <View style={styles.activityIcon}>
                <MaterialIcons color={colors.secondary} name={item.icon} size={22} />
              </View>
              <View style={styles.activityBody}>
                <View style={styles.activityHead}>
                  <Text style={styles.activityTitle}>{item.title}</Text>
                  <Text style={styles.activityPts}>+{item.points} pt</Text>
                </View>
                <Text style={styles.activityDetail}>{item.detail}</Text>
                <Text style={styles.activityWhen}>{item.when}</Text>
              </View>
            </View>
          ))}
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
    gap: spacing.stackMd,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brand: {
    ...typography.headlineMd,
    color: colors.primary,
  },
  hero: {
    backgroundColor: colors.primary,
    borderRadius: radii.xl,
    padding: spacing.stackMd,
    gap: spacing.stackSm,
  },
  heroTitle: {
    ...typography.headlineLgMobile,
    color: colors.onPrimary,
  },
  heroBody: {
    ...typography.bodyMd,
    color: colors.onPrimary,
    opacity: 0.9,
  },
  pointsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.primaryTint,
    borderRadius: radii.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.onPrimaryContainer,
  },
  pointsIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.full,
    backgroundColor: colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointsLabel: {
    ...typography.labelSm,
    color: colors.onPrimary,
    textTransform: 'uppercase',
  },
  pointsValue: {
    ...typography.headlineLg,
    color: colors.onPrimary,
  },
  section: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.stackMd,
    gap: spacing.stackSm,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    ...typography.headlineMd,
    color: colors.primary,
  },
  sectionLede: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  pill: {
    backgroundColor: colors.surfaceContainer,
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  pillText: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: radii.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  rankRowLead: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primaryTint,
  },
  rankAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colors.primary,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadgeLead: {
    backgroundColor: colors.primaryContainer,
  },
  rankNum: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
  rankNumLead: {
    color: colors.onPrimaryContainer,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.labelSm,
    color: colors.primary,
  },
  rankMeta: {
    flex: 1,
  },
  rankName: {
    ...typography.labelMd,
    color: colors.onSurface,
  },
  rankZone: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  rankPoints: {
    ...typography.labelMd,
    color: colors.primary,
  },
  youRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderStyle: 'dashed',
  },
  youRank: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    width: 32,
    textAlign: 'center',
  },
  youAvatar: {
    backgroundColor: colors.secondaryContainer,
  },
  youAvatarText: {
    ...typography.labelSm,
    color: colors.onSecondaryContainer,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    width: '47%',
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    position: 'relative',
  },
  badgeLocked: {
    backgroundColor: colors.surfaceContainerLow,
    borderStyle: 'dashed',
    opacity: 0.85,
  },
  badgeCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  badgeIcon: {
    width: 56,
    height: 56,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIconEarned: {
    backgroundColor: colors.secondaryContainer,
  },
  badgeIconLocked: {
    backgroundColor: colors.surfaceContainer,
  },
  badgeTitle: {
    ...typography.labelMd,
    color: colors.onSurface,
    textAlign: 'center',
  },
  badgeDetail: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 6,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceContainer,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    backgroundColor: colors.primary,
  },
  progressLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  activityRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 8,
  },
  activityBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityBody: {
    flex: 1,
  },
  activityHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  activityTitle: {
    ...typography.labelMd,
    color: colors.onSurface,
    flex: 1,
  },
  activityPts: {
    ...typography.labelMd,
    color: colors.secondary,
  },
  activityDetail: {
    ...typography.bodyMd,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  activityWhen: {
    ...typography.labelSm,
    color: colors.outline,
    marginTop: 8,
  },
});
