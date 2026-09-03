import { Stack } from 'expo-router';

import { colors, type } from '@/constants/theme';

export default function MaintenanceLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.navy },
        headerTintColor: colors.cream,
        headerTitleStyle: type.header,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.bg },
      }}>
      <Stack.Screen name="index" options={{ title: 'Maintenance' }} />
      <Stack.Screen name="categories" options={{ title: 'Categories' }} />
      <Stack.Screen name="items" options={{ title: 'Items' }} />
      <Stack.Screen name="detail" options={{ title: 'Interval' }} />
    </Stack>
  );
}
