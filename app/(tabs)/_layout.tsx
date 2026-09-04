import { Tabs } from 'expo-router';

import { AppTabBar } from '@/components/app-tab-bar';
import { colors } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarPosition: 'top',
        sceneStyle: { backgroundColor: colors.bg },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="book" options={{ title: 'Visit' }} />
      <Tabs.Screen name="maintenance" options={{ title: 'Guide' }} />
      <Tabs.Screen name="loyalty" options={{ title: 'List' }} />
      <Tabs.Screen name="about" options={{ title: 'Shop' }} />
    </Tabs>
  );
}
