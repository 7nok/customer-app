import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import Head from 'expo-router/head';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { AppStateProvider, useAppState } from '@/context/app-state';
import { colors, type } from '@/constants/theme';
import { useLockToVisualViewport } from '@/hooks/use-lock-to-visual-viewport';

export const unstable_settings = {
  anchor: '(tabs)',
};

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.amber,
    background: colors.bg,
    card: colors.navy,
    text: colors.cream,
    border: colors.navyMid,
    notification: colors.amber,
  },
};

function RootNavigation() {
  const { ready } = useAppState();

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator color={colors.amberDeep} size="large" />
      </View>
    );
  }

  return (
    <>
      <Head>
        <title>Daily Drivin · Hillsboro, TX</title>
        <meta
          name="description"
          content="Daily Drivin — Joe’s mobile auto care around Hillsboro, Texas and about thirty miles out. Request a visit, check maintenance intervals, and join the rewards list."
        />
      </Head>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.navy },
          headerTintColor: colors.cream,
          headerTitleStyle: type.header,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.bg },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="availability"
          options={{ title: 'Appointment windows', presentation: 'card' }}
        />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}

export default function RootLayout() {
  useLockToVisualViewport();

  return (
    <ThemeProvider value={navigationTheme}>
      <AppStateProvider>
        <RootNavigation />
      </AppStateProvider>
    </ThemeProvider>
  );
}
