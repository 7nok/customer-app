import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton, Screen } from '@/components/ui';
import { shop } from '@/constants/shop';
import { colors, spacing } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
import { formatDate, formatTime, summarizeHours, vehicleLabel } from '@/lib/format';

export default function HomeScreen() {
  const router = useRouter();
  const { profile, upcomingAppointments, weeklySlots } = useAppState();
  const nextAppointment = upcomingAppointments[0];
  const openDays = summarizeHours(weeklySlots).filter((row) => row.hours !== 'Closed');

  return (
    <Screen padded={false}>
      <View style={styles.stage}>
        <Text style={styles.kicker}>{shop.locationLabel}</Text>
        <Text style={styles.wordmark}>{shop.name}</Text>
        <Text style={styles.tagline}>{shop.tagline}</Text>

        <View style={styles.cta}>
          <PrimaryButton title="Book a visit" onPress={() => router.push('/book')} />
        </View>

        {nextAppointment ? (
          <Pressable onPress={() => router.push('/book')} style={styles.nextLine}>
            <Text style={styles.nextKicker}>Next</Text>
            <Text style={styles.nextCopy}>
              {formatDate(nextAppointment.date)} · {formatTime(nextAppointment.start)}
              {'  '}
              {vehicleLabel(nextAppointment.year, nextAppointment.make, nextAppointment.model)}
            </Text>
          </Pressable>
        ) : null}

        <View style={styles.links}>
          <LaunchRow index="01" title="Service" onPress={() => router.push('/book')} />
          <LaunchRow index="02" title="Guide" onPress={() => router.push('/maintenance')} />
          <LaunchRow
            index="03"
            title={profile ? profile.name.split(' ')[0] : 'List'}
            onPress={() => router.push('/loyalty')}
          />
          <LaunchRow index="04" title="Shop" onPress={() => router.push('/about')} />
        </View>

        <Text style={styles.hours}>
          {openDays.length
            ? openDays.map((row) => `${row.day} ${row.hours}`).join('  ·  ')
            : 'Hours on the shop page'}
        </Text>
      </View>
    </Screen>
  );
}

function LaunchRow({
  index,
  title,
  onPress,
}: {
  index: string;
  title: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.55 }]}>
      <Text style={styles.rowIndex}>{index}</Text>
      <Text style={styles.rowTitle}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  stage: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  kicker: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  wordmark: {
    color: colors.white,
    fontSize: 64,
    fontWeight: '500',
    letterSpacing: -2.4,
    lineHeight: 68,
  },
  tagline: {
    color: colors.muted,
    fontSize: 17,
    lineHeight: 26,
    maxWidth: 320,
  },
  cta: {
    marginTop: spacing.sm,
    maxWidth: 420,
  },
  nextLine: {
    gap: 4,
    marginTop: spacing.sm,
  },
  nextKicker: {
    color: colors.muted,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  nextCopy: {
    color: colors.text,
    fontSize: 15,
  },
  links: {
    borderTopColor: colors.line,
    borderTopWidth: 1,
    marginTop: spacing.md,
  },
  row: {
    alignItems: 'baseline',
    borderBottomColor: colors.line,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 16,
    minHeight: 56,
    paddingVertical: 16,
  },
  rowIndex: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 1,
    width: 28,
  },
  rowTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '500',
    letterSpacing: -0.4,
  },
  hours: {
    color: colors.muted,
    fontSize: 12,
    letterSpacing: 0.2,
    lineHeight: 18,
    marginTop: spacing.sm,
  },
});
