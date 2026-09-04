import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Screen } from '@/components/ui';
import { GUIDE_DISCLAIMER } from '@/constants/maintenance';
import { colors, fonts, spacing } from '@/constants/theme';

export default function MaintenanceHomeScreen() {
  const router = useRouter();

  return (
    <Screen>
      <Text style={styles.folio}>Guide</Text>
      <Text style={styles.title}>A word on intervals</Text>
      <Text style={styles.story}>
        Start with the kind of vehicle, then a system. These are general recommendations — Joe still
        wants to look at the one in your driveway.
      </Text>

      <Pressable
        onPress={() =>
          router.push({ pathname: '/maintenance/categories', params: { vehicleType: 'car' } })
        }
        style={({ pressed }) => [styles.chapter, pressed && { opacity: 0.7 }]}>
        <Text style={styles.num}>I</Text>
        <Text style={styles.chapterTitle}>Cars</Text>
        <Text style={styles.chapterBody}>Sedans, coupes, crossovers, and family vehicles.</Text>
      </Pressable>
      <Pressable
        onPress={() =>
          router.push({ pathname: '/maintenance/categories', params: { vehicleType: 'truck' } })
        }
        style={({ pressed }) => [styles.chapter, pressed && { opacity: 0.7 }]}>
        <Text style={styles.num}>II</Text>
        <Text style={styles.chapterTitle}>Trucks</Text>
        <Text style={styles.chapterBody}>Pickups, 4x4s, and light-duty work trucks.</Text>
      </Pressable>

      <Text style={styles.note}>{GUIDE_DISCLAIMER}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  folio: {
    color: colors.amberDeep,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 32,
    fontWeight: '600',
    lineHeight: 40,
    marginTop: 6,
  },
  story: {
    color: colors.text,
    fontSize: 17,
    lineHeight: 28,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  chapter: {
    borderTopColor: colors.line,
    borderTopWidth: 1,
    paddingVertical: spacing.md,
  },
  num: {
    color: colors.amberDeep,
    fontFamily: fonts.display,
    fontSize: 14,
  },
  chapterTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 26,
    marginTop: 4,
  },
  chapterBody: {
    color: colors.muted,
    fontSize: 15,
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
