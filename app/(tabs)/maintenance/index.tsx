import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Screen } from '@/components/ui';
import { GUIDE_DISCLAIMER } from '@/constants/maintenance';
import { shop } from '@/constants/shop';
import { colors, fonts, spacing } from '@/constants/theme';

export default function MaintenanceHomeScreen() {
  const router = useRouter();

  return (
    <Screen>
      <Text style={styles.job}>FIELD GUIDE</Text>
      <Text style={styles.title}>WHAT NEXT</Text>
      <Text style={styles.body}>
        Pick the vehicle, then a system. Intervals are general — Joe still wants to look at the one
        in your driveway.
      </Text>
      <Text style={styles.muted}>{shop.exclusionsNote}</Text>

      <Pressable
        onPress={() =>
          router.push({ pathname: '/maintenance/categories', params: { vehicleType: 'car' } })
        }
        style={({ pressed }) => [styles.bay, pressed && { opacity: 0.65 }]}>
        <Text style={styles.n}>01</Text>
        <Text style={styles.bayTitle}>CAR</Text>
        <Text style={styles.bayBody}>SEDANS, COUPES, CROSSOVERS</Text>
      </Pressable>
      <Pressable
        onPress={() =>
          router.push({ pathname: '/maintenance/categories', params: { vehicleType: 'truck' } })
        }
        style={({ pressed }) => [styles.bay, pressed && { opacity: 0.65 }]}>
        <Text style={styles.n}>02</Text>
        <Text style={styles.bayTitle}>TRUCK</Text>
        <Text style={styles.bayBody}>PICKUPS, 4X4S, LIGHT-DUTY</Text>
      </Pressable>

      <Text style={styles.muted}>{GUIDE_DISCLAIMER}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  job: {
    color: colors.amber,
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1.8,
  },
  title: {
    color: colors.text,
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 6,
  },
  body: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
    marginTop: spacing.sm,
  },
  muted: {
    color: colors.muted,
    fontFamily: fonts.mono,
    fontSize: 11,
    lineHeight: 16,
    marginTop: spacing.md,
  },
  bay: {
    borderColor: colors.line,
    borderWidth: 1,
    gap: 6,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  n: {
    color: colors.amber,
    fontFamily: fonts.mono,
    fontSize: 12,
  },
  bayTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 1,
  },
  bayBody: {
    color: colors.muted,
    fontFamily: fonts.mono,
    fontSize: 11,
  },
});
