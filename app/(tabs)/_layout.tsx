import { Tabs } from 'expo-router';

import { AppTabBar, TAB_BAR_CONTENT_HEIGHT } from '@/components/app-tab-bar';
import { HapticTab } from '@/components/haptic-tab';
import { Icon } from '@/components/icon';
import { colors } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopColor: colors.line,
          height: TAB_BAR_CONTENT_HEIGHT,
          paddingBottom: 0,
          paddingTop: 0,
          overflow: 'visible',
        },
        tabBarItemStyle: { paddingHorizontal: 0, overflow: 'visible' },
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Icon name="speedometer-outline" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="book"
        options={{
          title: 'Book',
          tabBarIcon: ({ color }) => <Icon name="calendar-outline" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="maintenance"
        options={{
          title: 'Guide',
          tabBarIcon: ({ color }) => <Icon name="build-outline" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="loyalty"
        options={{
          title: 'Loyalty',
          tabBarIcon: ({ color }) => <Icon name="medal-outline" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color }) => <Icon name="information-circle-outline" color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
