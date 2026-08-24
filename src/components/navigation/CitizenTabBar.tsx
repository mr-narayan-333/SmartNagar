import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';
import { radii, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type IconName = ComponentProps<typeof MaterialIcons>['name'];
type CitizenTabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

const TAB_ICONS: Record<string, IconName> = {
  home: 'home',
  reports: 'assignment',
  map: 'map',
  rewards: 'military-tech',
};

const TAB_LABELS: Record<string, string> = {
  home: 'Home',
  reports: 'Reports',
  map: 'Map',
  rewards: 'Rewards',
};

export function CitizenTabBar({ state, navigation }: CitizenTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const icon = TAB_ICONS[route.name] ?? 'circle';
        const label = TAB_LABELS[route.name] ?? route.name;

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={{ selected: focused }}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }}
            style={[styles.item, focused && styles.itemActive]}>
            <MaterialIcons
              color={focused ? colors.onSecondaryContainer : colors.onSurfaceVariant}
              name={icon}
              size={22}
            />
            <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.surfaceContainerLowest,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    paddingTop: 8,
    paddingHorizontal: spacing.base,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: radii.lg,
  },
  itemActive: {
    backgroundColor: colors.secondaryContainer,
    borderRadius: radii.full,
    paddingHorizontal: 12,
  },
  label: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  labelActive: {
    color: colors.onSecondaryContainer,
  },
});
