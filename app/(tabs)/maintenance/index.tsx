import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/ui';
import { GUIDE_DISCLAIMER } from '@/constants/maintenance';
import { shop } from '@/constants/shop';
import { colors, fonts, spacing } from '@/constants/theme';

export default function MaintenanceHomeScreen() {
  const router = useRouter();

  return (
    <Screen>
      <Text style={styles.kicker}>Guide</Text>
      <Text style={styles.title}>WHAT{'\n'}NEXT</Text>
      <Text style={styles.body}>
        Pick the vehicle, then a system. Intervals are general — Joe still wants to look at the one
        in your driveway.
      </Text>
      <Text style={styles.body}>{shop.exclusionsNote}</Text>

      <View style={styles.pair}>
        <Pressable
          onPress={() =>
            router.push({ pathname: '/maintenance/categories', params: { vehicleType: 'car' } })
          }
          style={({ pressed }) => [styles.choice, styles.choiceDark, pressed && { opacity: 0.75 }]}>
          <Text style={styles.choiceIndex}>01</Text>
          <Text style={styles.choiceTitleOn}>Car</Text>
          <Text style={styles.choiceBodyOn}>Sedans, coupes, crossovers.</Text>
        </Pressable>
        <Pressable
          onPress={() =>
            router.push({ pathname: '/maintenance/categories', params: { vehicleType: 'truck' } })
          }
          style={({ pressed }) => [styles.choice, pressed && { opacity: 0.75 }]}>
          <Text style={styles.choiceIndexAccent}>02</Text>
          <Text style={styles.choiceTitle}>Truck</Text>
          <Text style={styles.choiceBody}>Pickups, 4x4s, light-duty.</Text>
        </Pressable>
      </View>

      <Text style={styles.disclaimer}>{GUIDE_DISCLAIMER}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    color: colors.amber,
    fontFamily: fonts.display,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 64,
    fontWeight: '700',
    letterSpacing: -2,
    lineHeight: 58,
  },
  body: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 420,
  },
  pair: {
    gap: 12,
    marginTop: spacing.md,
  },
  choice: {
    backgroundColor: colors.card,
    gap: 6,
    padding: spacing.lg,
  },
  choiceDark: {
    backgroundColor: colors.cream,
  },
  choiceIndex: {
    color: colors.amber,
    fontFamily: fonts.display,
    fontSize: 14,
    fontWeight: '700',
  },
  choiceIndexAccent: {
    color: colors.amber,
    fontFamily: fonts.display,
    fontSize: 14,
    fontWeight: '700',
  },
  choiceTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 40,
    fontWeight: '700',
  },
  choiceTitleOn: {
    color: colors.white,
    fontFamily: fonts.display,
    fontSize: 40,
    fontWeight: '700',
  },
  choiceBody: {
    color: colors.muted,
    fontSize: 15,
  },
  choiceBodyOn: {
    color: '#D9D0C2',
    fontSize: 15,
  },
  disclaimer: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: spacing.lg,
  },
});
