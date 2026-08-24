import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { radii } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export function OfficialServiceBadge() {
  return (
    <View style={styles.badge}>
      <MaterialIcons color={colors.secondary} name="verified" size={20} />
      <Text style={styles.label}>Official Digital Service</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: 'rgba(197, 197, 211, 0.5)',
  },
  label: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
  },
});
