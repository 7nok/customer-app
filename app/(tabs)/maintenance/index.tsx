import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/ui';
import { GUIDE_DISCLAIMER } from '@/constants/maintenance';
import { colors, spacing } from '@/constants/theme';

export default function MaintenanceHomeScreen() {
  const router = useRouter();

  return (
    <Screen>
      <Text style={styles.kicker}>Guide</Text>
      <Text style={styles.title}>What should I check next?</Text>
      <Text style={styles.body}>
        Start with the kind of vehicle, then pick a system. Intervals are general — Joe still wants
        to look at the one in your driveway.
      </Text>

      <Pressable
        onPress={() =>
          router.push({ pathname: '/maintenance/categories', params: { vehicleType: 'car' } })
        }
        style={({ pressed }) => [styles.row, pressed && { opacity: 0.5 }]}>
        <Text style={styles.rowTitle}>Car</Text>
        <Text style={styles.rowBody}>Sedans, coupes, crossovers, family vehicles.</Text>
      </Pressable>
      <Pressable
        onPress={() =>
          router.push({ pathname: '/maintenance/categories', params: { vehicleType: 'truck' } })
        }
        style={({ pressed }) => [styles.row, pressed && { opacity: 0.5 }]}>
        <Text style={styles.rowTitle}>Truck</Text>
        <Text style={styles.rowBody}>Pickups, 4x4s, and light-duty work trucks.</Text>
      </Pressable>

      <Text style={styles.note}>{GUIDE_DISCLAIMER}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    color: colors.muted,
    fontSize: 12,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '500',
    letterSpacing: -0.4,
    lineHeight: 36,
    marginTop: 8,
  },
  body: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 26,
    marginTop: spacing.md,
  },
  row: {
    borderBottomColor: colors.line,
    borderBottomWidth: 1,
    paddingVertical: 20,
  },
  rowTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '500',
  },
  rowBody: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 4,
  },
  note: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: spacing.lg,
  },
});
