import { Tabs } from 'expo-router';

import { AppTabBar, TAB_BAR_CONTENT_HEIGHT } from '@/components/app-tab-bar';
import { HapticTab } from '@/components/haptic-tab';
import { Icon } from '@/components/icon';
import { colors, type } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: colors.navy },
        headerTintColor: colors.cream,
        headerTitleStyle: type.header,
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.amber,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.navy,
          borderTopColor: colors.navyMid,
          height: TAB_BAR_CONTENT_HEIGHT,
          paddingBottom: 8,
          paddingTop: 6,
          overflow: 'visible',
        },
        tabBarItemStyle: { paddingHorizontal: 0, overflow: 'visible' },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '500', letterSpacing: 0.4, lineHeight: 12 },
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Icon name="speedometer-outline" color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="book"
        options={{
          title: 'Book',
          headerShown: false,
          tabBarIcon: ({ color }) => <Icon name="calendar-outline" color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="maintenance"
        options={{
          title: 'Guide',
          headerShown: false,
          tabBarIcon: ({ color }) => <Icon name="build-outline" color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="loyalty"
        options={{
          title: 'Loyalty',
          headerShown: false,
          tabBarIcon: ({ color }) => <Icon name="medal-outline" color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color }) => <Icon name="information-circle-outline" color={color} size={22} />,
        }}
      />
    </Tabs>
  );
}
