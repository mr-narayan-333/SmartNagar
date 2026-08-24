import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { radii } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type CheckboxProps = {
  label: ReactNode;
  checked: boolean;
  onChange: (next: boolean) => void;
};

export function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={() => onChange(!checked)}
      style={styles.row}>
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked ? <MaterialIcons color={colors.onPrimary} name="check" size={14} /> : null}
      </View>
      {typeof label === 'string' ? <Text style={styles.label}>{label}</Text> : <View style={styles.labelWrap}>{label}</View>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  labelWrap: {
    flex: 1,
  },
  box: {
    width: 16,
    height: 16,
    marginTop: 4,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  label: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    flex: 1,
  },
});
