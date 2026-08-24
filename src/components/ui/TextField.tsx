import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState, type ComponentProps, type ReactNode } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { colors } from '@/theme/colors';
import { radii, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type TextFieldProps = TextInputProps & {
  label: string;
  leftIcon?: ComponentProps<typeof MaterialIcons>['name'];
  prefix?: string;
  rightAccessory?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
};

export function TextField({
  label,
  leftIcon,
  prefix,
  rightAccessory,
  containerStyle,
  onFocus,
  onBlur,
  style,
  ...inputProps
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.field, inputProps.multiline && styles.fieldMultiline, focused && styles.fieldFocused]}>
        {leftIcon ? (
          <MaterialIcons
            color={colors.onSurfaceVariant}
            name={leftIcon}
            size={22}
            style={inputProps.multiline ? styles.multilineIcon : undefined}
          />
        ) : null}
        {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}
        {prefix ? <View style={styles.prefixDivider} /> : null}
        <TextInput
          placeholderTextColor="rgba(68, 70, 81, 0.5)"
          style={[styles.input, inputProps.multiline && styles.multilineInput, style]}
          textAlignVertical={inputProps.multiline ? 'top' : 'center'}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          {...inputProps}
        />
        {rightAccessory ? <View style={styles.accessory}>{rightAccessory}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.base,
  },
  label: {
    ...typography.labelMd,
    color: colors.onSurface,
  },
  field: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 12,
    paddingRight: 12,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
  },
  fieldFocused: {
    borderColor: colors.primary,
  },
  prefix: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  prefixDivider: {
    width: 1,
    height: 22,
    backgroundColor: colors.outlineVariant,
  },
  accessory: {
    flexShrink: 0,
    zIndex: 1,
  },
  input: {
    ...typography.bodyMd,
    flex: 1,
    minWidth: 0,
    color: colors.onSurface,
    paddingVertical: 12,
  },
  fieldMultiline: {
    alignItems: 'flex-start',
    minHeight: 96,
  },
  multilineIcon: {
    marginTop: 12,
  },
  multilineInput: {
    minHeight: 72,
    paddingTop: 12,
  },
});
