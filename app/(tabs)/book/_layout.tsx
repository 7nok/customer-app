import { Stack } from 'expo-router';

import { colors, type } from '@/constants/theme';

export default function BookLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.navy },
        headerTintColor: colors.cream,
        headerTitleStyle: type.header,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.bg },
      }}>
      <Stack.Screen name="index" options={{ title: 'Book' }} />
      <Stack.Screen name="confirmation" options={{ title: 'You’re booked' }} />
    </Stack>
  );
}
