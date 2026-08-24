import { Stack } from 'expo-router';

import { colors } from '@/constants/theme';

export default function BookLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.navy },
        headerTintColor: colors.cream,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.bg },
      }}>
      <Stack.Screen name="index" options={{ title: 'Book' }} />
      <Stack.Screen name="confirmation" options={{ title: 'You’re booked' }} />
    </Stack>
  );
}
