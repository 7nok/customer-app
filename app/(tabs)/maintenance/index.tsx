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
      <Text style={styles.title}>What next.</Text>
      <Text style={styles.body}>
        Pick the vehicle, then a system. Intervals are general — Joe still wants to look at the one
        in your driveway.
      </Text>

      <View style={styles.list}>
        <Choice
          index="01"
          title="Car"
          body="Sedans, coupes, crossovers, family vehicles."
          onPress={() =>
            router.push({ pathname: '/maintenance/categories', params: { vehicleType: 'car' } })
          }
        />
        <Choice
          index="02"
          title="Truck"
          body="Pickups, 4x4s, light-duty work trucks."
          onPress={() =>
            router.push({ pathname: '/maintenance/categories', params: { vehicleType: 'truck' } })
          }
        />
      </View>

      <Text style={styles.disclaimer}>{GUIDE_DISCLAIMER}</Text>
    </Screen>
  );
}

function Choice({
  index,
  title,
  body,
  onPress,
}: {
  index: string;
  title: string;
  body: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.choice, pressed && { opacity: 0.55 }]}>
      <Text style={styles.index}>{index}</Text>
      <View style={styles.choiceCopy}>
        <Text style={styles.choiceTitle}>{title}</Text>
        <Text style={styles.choiceBody}>{body}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  kicker: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.white,
    fontSize: 48,
    fontWeight: '500',
    letterSpacing: -1.6,
    lineHeight: 52,
  },
  body: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 420,
  },
  list: {
    borderTopColor: colors.line,
    borderTopWidth: 1,
    marginTop: spacing.md,
  },
  choice: {
    borderBottomColor: colors.line,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 22,
  },
  index: {
    color: colors.muted,
    fontSize: 13,
    letterSpacing: 1,
    width: 28,
  },
  choiceCopy: {
    flex: 1,
    gap: 6,
  },
  choiceTitle: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '500',
    letterSpacing: -0.6,
  },
  choiceBody: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  disclaimer: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: spacing.lg,
  },
});
