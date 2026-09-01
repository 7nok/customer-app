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
        headerStyle: { backgroundColor: colors.navy },
        headerTintColor: colors.cream,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.amber,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.navy,
          borderTopColor: colors.navyMid,
          height: TAB_BAR_CONTENT_HEIGHT,
          paddingBottom: 6,
          paddingTop: 4,
        },
        tabBarItemStyle: { paddingHorizontal: 0 },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700' },
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Icon name="home" color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="book"
        options={{
          title: 'Book',
          headerShown: false,
          tabBarIcon: ({ color }) => <Icon name="calendar" color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="maintenance"
        options={{
          title: 'Guide',
          headerShown: false,
          tabBarIcon: ({ color }) => <Icon name="construct" color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="loyalty"
        options={{
          title: 'Loyalty',
          headerShown: false,
          tabBarIcon: ({ color }) => <Icon name="ribbon" color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color }) => <Icon name="person" color={color} size={22} />,
        }}
      />
    </Tabs>
  );
}
