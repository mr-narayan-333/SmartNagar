import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

import { supabase } from '@/lib/supabase';
import { colors } from '@/theme/colors';
import { radii, spacing } from '@/theme/spacing';
import { fontFamily, typography } from '@/theme/typography';

type PriorityFilter = 'All' | 'High' | 'Medium' | 'Low';

type Issue = {
  id: string;
  ticket_id?: string;
  title: string;
  category: string;
  description?: string;
  location_text?: string;
  latitude: number;
  longitude: number;
  status?: string;
  priority?: string;
  created_at?: string;
};

const NAGPUR_REGION: Region = {
  latitude: 21.1458,
  longitude: 79.0882,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

const FILTERS: PriorityFilter[] = ['All', 'High', 'Medium', 'Low'];

function normalizePriority(priority?: string): PriorityFilter {
  const value = priority?.toLowerCase();

  if (value === 'high') return 'High';
  if (value === 'low') return 'Low';
  return 'Medium';
}

function priorityColor(priority?: string) {
  const p = normalizePriority(priority);

  if (p === 'High') return '#D62828';
  if (p === 'Low') return '#087F3E';

  return '#E88A00';
}

function categoryIcon(category: string) {
  const value = category.toLowerCase();

  if (value.includes('street')) return 'lightbulb';
  if (value.includes('pothole') || value.includes('road')) return 'add-road';
  if (value.includes('garbage') || value.includes('waste')) return 'delete';
  if (value.includes('drain') || value.includes('water')) return 'water-drop';

  return 'report';
}

function timeAgo(date?: string) {
  if (!date) return '';

  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NearbyMapScreen() {
  const [filter, setFilter] = useState<PriorityFilter>('All');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState<Region>(NAGPUR_REGION);

  async function loadIssues() {
    setLoading(true);

    const { data, error } = await supabase
      .from('civic_issues')
      .select(
        'id,ticket_id,title,category,description,location_text,latitude,longitude,status,priority,created_at',
      )
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.log('Map issue loading error:', error);
      setIssues([]);
      setLoading(false);
      return;
    }

    const validIssues = (data ?? [])
      .filter(
        (item: any) =>
          typeof item.latitude === 'number' &&
          typeof item.longitude === 'number',
      )
      .map((item: any) => ({
        ...item,
        latitude: Number(item.latitude),
        longitude: Number(item.longitude),
      }));

    setIssues(validIssues);

    if (validIssues.length > 0) {
      setRegion({
        latitude: validIssues[0].latitude,
        longitude: validIssues[0].longitude,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      });
    }

    setLoading(false);
  }

  useEffect(() => {
    loadIssues();

    const channel = supabase
      .channel('smartnagar-map-live')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'civic_issues',
        },
        () => {
          loadIssues();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const visibleIssues = useMemo(() => {
    if (filter === 'All') return issues;

    return issues.filter(
      (issue) => normalizePriority(issue.priority) === filter,
    );
  }, [issues, filter]);

  const selectedIssue = issues.find((issue) => issue.id === selectedId);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <MaterialIcons
            color={colors.primary}
            name="account-balance"
            size={22}
          />
          <Text style={styles.brand}>SmartNagar</Text>
        </View>

        <Text style={styles.caption}>Live civic issues near you</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
        contentContainerStyle={styles.chipRow}
      >
        {FILTERS.map((item) => {
          const active = filter === item;

          return (
            <Pressable
              key={item}
              onPress={() => setFilter(item)}
              style={[styles.chip, active && styles.chipActive]}
            >
              {item !== 'All' && !active ? (
                <View
                  style={[
                    styles.chipDot,
                    { backgroundColor: priorityColor(item) },
                  ]}
                />
              ) : null}

              <Text
                style={[
                  styles.chipLabel,
                  active && styles.chipLabelActive,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={NAGPUR_REGION}
          region={region}
          onRegionChangeComplete={setRegion}
          showsUserLocation
          showsMyLocationButton
          loadingEnabled
        >
          {visibleIssues.map((issue) => {
            const selected = issue.id === selectedId;

            return (
              <Marker
                key={issue.id}
                coordinate={{
                  latitude: issue.latitude,
                  longitude: issue.longitude,
                }}
                title={issue.title}
                description={
                  issue.location_text ||
                  issue.category ||
                  'Civic issue'
                }
                pinColor={priorityColor(issue.priority)}
                onPress={() => setSelectedId(issue.id)}
              />
            );
          })}
        </MapView>

        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE MAP</Text>
        </View>

        {loading ? (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>Loading issues...</Text>
          </View>
        ) : null}
      </View>

      {selectedIssue ? (
        <View style={styles.selectedCard}>
          <View
            style={[
              styles.selectedIcon,
              {
                backgroundColor:
                  normalizePriority(selectedIssue.priority) === 'High'
                    ? '#FDE8E8'
                    : '#FFF4E0',
              },
            ]}
          >
            <MaterialIcons
              name={categoryIcon(selectedIssue.category) as any}
              size={21}
              color={priorityColor(selectedIssue.priority)}
            />
          </View>

          <View style={styles.selectedBody}>
            <Text style={styles.selectedTitle} numberOfLines={1}>
              {selectedIssue.title}
            </Text>

            <Text style={styles.selectedAddress} numberOfLines={1}>
              {selectedIssue.location_text || selectedIssue.category}
            </Text>

            <Text style={styles.selectedMeta}>
              {normalizePriority(selectedIssue.priority)} ·{' '}
              {selectedIssue.status || 'Reported'} ·{' '}
              {timeAgo(selectedIssue.created_at)}
            </Text>
          </View>

          <Pressable
            onPress={() => setSelectedId(null)}
            style={styles.closeButton}
          >
            <MaterialIcons
              name="close"
              size={18}
              color={colors.onSurfaceVariant}
            />
          </Pressable>
        </View>
      ) : null}

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Nearby issues</Text>

        <View style={styles.countPill}>
          <Text style={styles.countText}>
            {visibleIssues.length} found
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {visibleIssues.map((issue) => {
          const priority = normalizePriority(issue.priority);
          const pinColor = priorityColor(issue.priority);

          return (
            <Pressable
              key={issue.id}
              onPress={() => {
                setSelectedId(issue.id);

                setRegion({
                  latitude: issue.latitude,
                  longitude: issue.longitude,
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.015,
                });
              }}
              style={[
                styles.card,
                selectedId === issue.id && styles.cardSelected,
              ]}
            >
              <View
                style={[
                  styles.cardIcon,
                  {
                    backgroundColor:
                      priority === 'High'
                        ? '#FDE8E8'
                        : priority === 'Low'
                          ? '#E8F7EE'
                          : '#FFF4E0',
                  },
                ]}
              >
                <MaterialIcons
                  color={pinColor}
                  name={categoryIcon(issue.category) as any}
                  size={20}
                />
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {issue.title}
                </Text>

                <Text style={styles.cardAddress} numberOfLines={1}>
                  {issue.location_text || issue.category}
                </Text>

                <Text style={styles.metaText}>
                  {issue.status || 'Reported'} ·{' '}
                  {timeAgo(issue.created_at)}
                </Text>
              </View>

              <View
                style={[
                  styles.priorityChip,
                  {
                    backgroundColor:
                      priority === 'High'
                        ? '#FDE8E8'
                        : priority === 'Low'
                          ? '#E8F7EE'
                          : '#FFF4E0',
                  },
                ]}
              >
                <Text style={[styles.priorityText, { color: pinColor }]}>
                  {priority}
                </Text>
              </View>
            </Pressable>
          );
        })}

        {!loading && visibleIssues.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons
              name="location-searching"
              size={34}
              color={colors.primary}
            />

            <Text style={styles.emptyTitle}>No issues found</Text>

            <Text style={styles.emptyText}>
              Report an issue with a GPS location and it will appear here.
            </Text>
          </View>
        ) : null}

        <Pressable
          onPress={() => router.push('/report-issue')}
          style={styles.ctaRow}
        >
          <View style={styles.ctaIcon}>
            <MaterialIcons
              color={colors.onPrimary}
              name="add"
              size={20}
            />
          </View>

          <Text style={styles.ctaLabel}>Report new issue</Text>

          <MaterialIcons
            color={colors.primary}
            name="chevron-right"
            size={22}
          />
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

  mapContainer: {
    height: 270,
    marginHorizontal: spacing.containerPadding,
    marginTop: spacing.base,
    borderRadius: radii.lg,
    overflow: 'hidden',
    position: 'relative',
  },

  map: {
    flex: 1,
  },

  liveBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'white',
    borderRadius: radii.full,
    paddingHorizontal: 10,
    paddingVertical: 6,
    elevation: 3,
  },

  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16A34A',
  },

  liveText: {
    fontSize: 11,
    fontFamily: fontFamily.interSemiBold,
    color: '#166534',
  },

  loadingOverlay: {
    position: 'absolute',
    alignSelf: 'center',
    top: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    elevation: 4,
  },

  loadingText: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },

  selectedCard: {
    marginHorizontal: spacing.containerPadding,
    marginTop: 8,
    padding: 10,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  selectedIcon: {
    width: 38,
    height: 38,
    borderRadius: radii.md,
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectedBody: {
    flex: 1,
  },

  selectedTitle: {
    ...typography.labelMd,
    color: colors.onSurface,
  },

  selectedAddress: {
    fontSize: 11,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },

  selectedMeta: {
    fontSize: 10,
    color: colors.outline,
    marginTop: 3,
  },

  closeButton: {
    padding: 5,
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

  emptyState: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },

  emptyTitle: {
    marginTop: 8,
    fontSize: 16,
    fontFamily: fontFamily.interSemiBold,
    color: colors.onSurface,
  },

  emptyText: {
    marginTop: 5,
    textAlign: 'center',
    fontSize: 12,
    color: colors.onSurfaceVariant,
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