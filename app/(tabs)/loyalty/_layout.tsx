import { Stack } from 'expo-router';

import { colors, type } from '@/constants/theme';

export default function LoyaltyLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.navy },
        headerTintColor: colors.cream,
        headerTitleStyle: type.header,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.bg },
      }}>
      <Stack.Screen name="index" options={{ title: 'Loyalty', headerShown: false }} />
      <Stack.Screen name="signup" options={{ title: 'Join' }} />
      <Stack.Screen name="confirmation" options={{ title: 'You’re in' }} />
    </Stack>
  );
}
