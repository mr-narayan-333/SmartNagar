import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import type { ComponentProps } from 'react';

import { colors } from '@/theme/colors';
import { radii } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type ButtonVariant = 'primary' | 'outline';

type ButtonProps = PressableProps & {
  label: string;
  variant?: ButtonVariant;
  icon?: ComponentProps<typeof MaterialIcons>['name'];
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  variant = 'primary',
  icon,
  loading = false,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const isPrimary = variant === 'primary';
  const isDisabled = disabled || loading;
  const iconColor = isPrimary ? colors.onPrimary : colors.primary;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.outline,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={iconColor} />
      ) : (
        <>
          <Text style={[styles.label, isPrimary ? styles.primaryLabel : styles.outlineLabel]}>
            {label}
          </Text>
          {icon ? <MaterialIcons color={iconColor} name={icon} size={18} /> : null}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: radii.lg,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primary: {
    backgroundColor: colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
      },
      android: { elevation: 1 },
      default: { boxShadow: '0px 1px 2px rgba(0,0,0,0.08)' },
    }),
  },
  outline: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.55,
  },
  label: {
    ...typography.labelMd,
  },
  primaryLabel: {
    color: colors.onPrimary,
  },
  outlineLabel: {
    color: colors.primary,
  },
});
