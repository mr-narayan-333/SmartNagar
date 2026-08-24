import { Tabs } from 'expo-router';

import { CitizenTabBar } from '@/components/navigation/CitizenTabBar';
import { colors } from '@/theme/colors';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CitizenTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
      }}>
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="reports" options={{ title: 'Reports' }} />
      <Tabs.Screen name="map" options={{ title: 'Map' }} />
      <Tabs.Screen name="rewards" options={{ title: 'Rewards' }} />
    </Tabs>
  );
}
