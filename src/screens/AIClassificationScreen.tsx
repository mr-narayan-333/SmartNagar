import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import {
  addCitizenReport,
  createTicketId,
  DEPARTMENT_BY_TYPE,
  getReportDraft,
  ISSUE_TYPES,
  MOCK_CONFIDENCE,
  MOCK_LOCATION,
  MOCK_PRIORITY,
  parseIssueType,
} from '@/lib/report-draft';
import { colors } from '@/theme/colors';
import { radii, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export function AIClassificationScreen() {
  const params = useLocalSearchParams<{
    category?: string | string[];
    categoryLabel?: string | string[];
  }>();
  const [draft, setDraft] = useState(() => getReportDraft());

  useFocusEffect(
    useCallback(() => {
      setDraft(getReportDraft());
    }, []),
  );

  const [notes, setNotes] = useState(draft?.description ?? '');

  const category = useMemo(() => {
    const fromParams = parseIssueType(params.category);
    const fromDraft = parseIssueType(draft?.category);
    const value = fromParams ?? fromDraft;
    return ISSUE_TYPES.find((item) => item.value === value);
  }, [draft?.category, params.category]);

  const photoUri = draft?.photoUris[0];
  const department = category ? DEPARTMENT_BY_TYPE[category.value] : 'General Civic Services';
  const detectedLabel =
    category?.label ??
    (Array.isArray(params.categoryLabel) ? params.categoryLabel[0] : params.categoryLabel) ??
    draft?.categoryLabel ??
    'Unknown';

  function handleConfirm() {
    if (!category) {
      return;
    }

    const ticketId = createTicketId();
    const now = new Date();
    const dateLabel = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    const timestamp = now.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

    addCitizenReport({
      id: ticketId,
      ticketId,
      title: category.label,
      description: notes.trim() || draft?.description || 'Submitted via SmartNagar.',
      category: category.value,
      priority: MOCK_PRIORITY,
      status: 'Reported',
      dateLabel,
      photoUri: draft?.photoUris[0],
      timeline: [
        {
          key: 'reported',
          title: 'Reported',
          timestamp,
          detail: 'Issue logged into system.',
          state: 'current',
        },
        { key: 'assigned', title: 'Assigned', state: 'pending' },
        { key: 'in-progress', title: 'In Progress', state: 'pending' },
        { key: 'resolved', title: 'Resolved', state: 'pending' },
      ],
    });

    router.push({
      pathname: '/submission-success',
      params: { ticketId },
    });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <MaterialIcons color={colors.primary} name="account-balance" size={24} />
        <Text style={styles.headerTitle}>SmartNagar</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.photoMeta}>
            <Button
              label="Retake Photo"
              variant="outline"
              onPress={() => router.back()}
              style={styles.retake}
            />
            <View style={styles.encrypted}>
              <MaterialIcons color={colors.secondary} name="verified" size={16} />
              <Text style={styles.encryptedLabel}>Encrypted Upload</Text>
            </View>
          </View>

          <View style={styles.photoCard}>
            {photoUri ? (
              <Image contentFit="cover" source={{ uri: photoUri }} style={styles.heroPhoto} />
            ) : (
              <View style={styles.heroFallback}>
                <MaterialIcons color={colors.onSurfaceVariant} name="image" size={40} />
              </View>
            )}
            <View style={styles.photoOverlay}>
              <Text style={styles.detectedTitle}>{detectedLabel}</Text>
              <View style={styles.confidenceRow}>
                <MaterialIcons color={colors.secondaryContainer} name="auto-awesome" size={18} />
                <Text style={styles.confidence}>{MOCK_CONFIDENCE}% confidence</Text>
              </View>
            </View>
          </View>
          <Text style={styles.aiHint}>
            AI classification is based on automated visual analysis. Please confirm details before
            submitting.
          </Text>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Issue Details</Text>
            <Text style={styles.sectionSubtitle}>Review the categorized information.</Text>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <MaterialIcons color={colors.primary} name="apartment" size={22} />
              </View>
              <View style={styles.detailCopy}>
                <Text style={styles.detailLabel}>Routed Department</Text>
                <Text style={styles.detailValue}>{department}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, styles.priorityIcon]}>
                <MaterialIcons color={colors.error} name="warning" size={22} />
              </View>
              <View style={styles.detailCopy}>
                <Text style={styles.detailLabel}>Assessed Priority</Text>
                <Text style={styles.priorityValue}>{MOCK_PRIORITY}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <MaterialIcons color={colors.primary} name="location-on" size={22} />
              </View>
              <View style={styles.detailCopy}>
                <Text style={styles.detailLabel}>Detected Location</Text>
                <Text style={styles.detailValue}>{MOCK_LOCATION.address}</Text>
                <Text style={styles.detailMeta}>
                  Lat: {MOCK_LOCATION.lat}, Lng: {MOCK_LOCATION.lng}
                </Text>
              </View>
            </View>

            <TextField
              label="Additional Context (Optional)"
              multiline
              numberOfLines={3}
              placeholder="Provide any extra details helpful for responders..."
              value={notes}
              onChangeText={setNotes}
            />
          </View>

          <View style={styles.actions}>
            <Button label="Cancel" variant="outline" onPress={() => router.back()} />
            <Button icon="send" label="Confirm & Submit" onPress={handleConfirm} />
          </View>

          <Text style={styles.trust}>Official Government Portal • Data is securely processed.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing.containerPadding,
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    ...typography.headlineMd,
    color: colors.primary,
  },
  scrollContent: {
    padding: spacing.containerPadding,
    paddingBottom: spacing.stackLg,
    gap: spacing.stackSm,
  },
  photoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  retake: {
    minHeight: 40,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  encrypted: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.secondaryTint,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.full,
  },
  encryptedLabel: {
    ...typography.labelSm,
    color: colors.secondary,
  },
  photoCard: {
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainer,
  },
  heroPhoto: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
  heroFallback: {
    width: '100%',
    aspectRatio: 4 / 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainer,
  },
  photoOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: 'rgba(11, 28, 48, 0.72)',
  },
  detectedTitle: {
    ...typography.headlineMd,
    color: colors.onPrimary,
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  confidence: {
    ...typography.bodyMd,
    color: colors.onPrimary,
  },
  aiHint: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radii.xl,
    padding: spacing.stackMd,
    gap: 16,
    marginTop: spacing.stackSm,
  },
  sectionTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
  },
  sectionSubtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: -8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    padding: 16,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityIcon: {
    backgroundColor: colors.primaryTint,
  },
  detailCopy: {
    flex: 1,
  },
  detailLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  detailValue: {
    ...typography.bodyMd,
    color: colors.onSurface,
    marginTop: 2,
  },
  detailMeta: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  priorityValue: {
    ...typography.bodyMd,
    color: colors.error,
    marginTop: 2,
  },
  actions: {
    gap: 12,
    marginTop: spacing.stackSm,
  },
  trust: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
  },
});
