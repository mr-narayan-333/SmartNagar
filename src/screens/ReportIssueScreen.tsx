import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import {
  ISSUE_TYPES,
  MOCK_LOCATION,
  setReportDraft,
  type IssueTypeValue,
} from '@/lib/report-draft';
import { colors } from '@/theme/colors';
import { radii, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

const MAX_PHOTOS = 4;

export function ReportIssueScreen() {
  const [category, setCategory] = useState<IssueTypeValue | ''>('');
  const [description, setDescription] = useState('');
  const [photoUris, setPhotoUris] = useState<string[]>([]);

  function appendPhotos(uris: string[]) {
    setPhotoUris((current) => [...current, ...uris].slice(0, MAX_PHOTOS));
  }

  async function pickFromLibrary() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow photo library access to attach evidence.');
      return;
    }

    const remaining = MAX_PHOTOS - photoUris.length;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: remaining > 1,
      selectionLimit: remaining,
      quality: 0.8,
    });

    if (!result.canceled) {
      appendPhotos(result.assets.map((asset) => asset.uri));
    }
  }

  async function pickFromCamera() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow camera access to photograph civic issues.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled) {
      appendPhotos(result.assets.map((asset) => asset.uri));
    }
  }

  function handleAddPhoto() {
    if (photoUris.length >= MAX_PHOTOS) {
      Alert.alert('Limit reached', 'You can attach up to 4 photos.');
      return;
    }

    Alert.alert('Add photo', 'Choose a source', [
      { text: 'Camera', onPress: () => void pickFromCamera() },
      { text: 'Gallery', onPress: () => void pickFromLibrary() },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  function handleNext() {
    if (!category) {
      Alert.alert('Issue type required', 'Select a category to continue.');
      return;
    }
    if (photoUris.length === 0) {
      Alert.alert('Photo required', 'Add at least one photo of the issue.');
      return;
    }

    const selected = ISSUE_TYPES.find((item) => item.value === category);
    if (!selected) {
      return;
    }

    setReportDraft({
      category: selected.value,
      categoryLabel: selected.label,
      description: description.trim(),
      photoUris,
    });

    router.push({
      pathname: '/ai-classification',
      params: {
        category: selected.value,
        categoryLabel: selected.label,
      },
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
          <Text style={styles.pageTitle}>Report New Issue</Text>
          <Text style={styles.pageSubtitle}>
            Provide details to help authorities resolve the problem efficiently.
          </Text>

          <View style={styles.card}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Issue Type *</Text>
              <View style={styles.pickerField}>
                <Picker
                  dropdownIconColor={colors.onSurfaceVariant}
                  mode="dropdown"
                  selectedValue={category}
                  style={styles.picker}
                  onValueChange={(value) => setCategory(value as IssueTypeValue | '')}>
                  <Picker.Item
                    color={colors.outline}
                    enabled={false}
                    label="Select category"
                    value=""
                  />
                  {ISSUE_TYPES.map((item) => (
                    <Picker.Item
                      color={colors.onSurface}
                      key={item.value}
                      label={item.label}
                      value={item.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <View style={styles.locationHeader}>
                <Text style={styles.label}>Location *</Text>
                <Pressable
                  onPress={() =>
                    Alert.alert(
                      'Location',
                      `Using mock location:\n${MOCK_LOCATION.address}\nLat ${MOCK_LOCATION.lat}, Lng ${MOCK_LOCATION.lng}`,
                    )
                  }
                  style={styles.detectButton}>
                  <MaterialIcons color={colors.primary} name="my-location" size={16} />
                  <Text style={styles.detectLabel}>Detect Current</Text>
                </Pressable>
              </View>
              <View style={styles.mapBox}>
                <View style={styles.mapPlaceholder}>
                  <MaterialIcons color={colors.error} name="location-on" size={40} />
                  <Text style={styles.coords}>
                    Lat {MOCK_LOCATION.lat}, Lng {MOCK_LOCATION.lng}
                  </Text>
                </View>
                <View style={styles.mapCaption}>
                  <MaterialIcons color={colors.onSurfaceVariant} name="push-pin" size={18} />
                  <Text numberOfLines={1} style={styles.mapCaptionText}>
                    Auto-detected: {MOCK_LOCATION.address}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Photo Evidence</Text>
              <View style={styles.photoGrid}>
                {photoUris.map((uri) => (
                  <View key={uri} style={styles.photoTile}>
                    <Image contentFit="cover" source={{ uri }} style={styles.photo} />
                    <Pressable
                      accessibilityLabel="Remove photo"
                      onPress={() => setPhotoUris((current) => current.filter((item) => item !== uri))}
                      style={styles.removePhoto}>
                      <MaterialIcons color={colors.onPrimary} name="close" size={14} />
                    </Pressable>
                  </View>
                ))}
                {photoUris.length < MAX_PHOTOS ? (
                  <Pressable onPress={handleAddPhoto} style={styles.addPhoto}>
                    <MaterialIcons color={colors.onSurfaceVariant} name="add-a-photo" size={28} />
                    <Text style={styles.addPhotoLabel}>
                      {photoUris.length === 0 ? '+ Add Photos' : '+ Add more'}
                    </Text>
                  </Pressable>
                ) : null}
              </View>
              <Text style={styles.hint}>Upload up to 4 images (JPG, PNG). Max 5MB each.</Text>
            </View>

            <TextField
              label="Short Description"
              multiline
              numberOfLines={3}
              placeholder="Provide any additional details about the issue..."
              value={description}
              onChangeText={setDescription}
            />

            <View style={styles.actions}>
              <Button label="Cancel" variant="outline" onPress={() => router.back()} />
              <Button icon="arrow-forward" label="Next" onPress={handleNext} />
            </View>
          </View>
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
  },
  pageTitle: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
    marginBottom: 8,
  },
  pageSubtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.stackMd,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radii.xl,
    padding: spacing.stackMd,
    gap: spacing.stackMd,
  },
  fieldGroup: {
    gap: spacing.stackSm,
  },
  label: {
    ...typography.labelMd,
    color: colors.onSurface,
  },
  pickerField: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceContainerLowest,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  picker: {
    color: colors.onSurface,
    backgroundColor: 'transparent',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
  },
  detectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detectLabel: {
    ...typography.labelSm,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  mapBox: {
    height: 192,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainer,
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryTint,
    gap: 8,
  },
  coords: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  mapCaption: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radii.lg,
    padding: 12,
  },
  mapCaptionText: {
    ...typography.bodyMd,
    color: colors.onSurface,
    flex: 1,
    fontSize: 14,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  photoTile: {
    width: 128,
    height: 128,
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  removePhoto: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhoto: {
    width: 128,
    height: 128,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addPhotoLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  hint: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  actions: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    gap: 12,
  },
});
