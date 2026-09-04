import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/ui';
import { shop } from '@/constants/shop';
import { colors, spacing } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
import { formatDate, formatTime, summarizeHours, vehicleLabel } from '@/lib/format';

export default function HomeScreen() {
  const router = useRouter();
  const { profile, upcomingAppointments, weeklySlots } = useAppState();
  const nextAppointment = upcomingAppointments[0];
  const hours = summarizeHours(weeklySlots);

  return (
    <Screen>
      <Text style={styles.name}>{shop.name}</Text>
      <Text style={styles.place}>{shop.locationLabel}</Text>
      <Text style={styles.intro}>{shop.tagline}</Text>

      {nextAppointment ? (
        <Pressable onPress={() => router.push('/book')} style={styles.next}>
          <Text style={styles.nextLabel}>Next visit</Text>
          <Text style={styles.nextWhen}>
            {formatDate(nextAppointment.date)} · {formatTime(nextAppointment.start)}
          </Text>
          <Text style={styles.nextCar}>
            {vehicleLabel(nextAppointment.year, nextAppointment.make, nextAppointment.model)}
          </Text>
        </Pressable>
      ) : (
        <Text style={styles.quiet}>No visit on the calendar yet.</Text>
      )}

      <View style={styles.list}>
        <IndexRow
          num="01"
          title="Book a time"
          detail="Pick an open slot"
          onPress={() => router.push('/book')}
        />
        <IndexRow
          num="02"
          title="Maintenance"
          detail="Cars and trucks"
          onPress={() => router.push('/maintenance')}
        />
        <IndexRow
          num="03"
          title="Loyalty"
          detail={profile ? 'Your account' : 'Sign up'}
          onPress={() => router.push('/loyalty')}
        />
        <IndexRow num="04" title="About" detail="The shop" onPress={() => router.push('/about')} />
      </View>

      <View style={styles.hours}>
        {hours.map((row) => (
          <View key={row.day} style={styles.hoursRow}>
            <Text style={styles.hoursDay}>{row.day}</Text>
            <Text style={styles.hoursTime}>{row.hours}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

function IndexRow({
  num,
  title,
  detail,
  onPress,
}: {
  num: string;
  title: string;
  detail: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.5 }]}>
      <Text style={styles.num}>{num}</Text>
      <View style={styles.rowCopy}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDetail}>{detail}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  name: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '500',
    letterSpacing: -0.3,
  },
  place: {
    color: colors.muted,
    fontSize: 13,
    letterSpacing: 0.4,
    marginTop: 4,
  },
  intro: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 26,
    marginTop: spacing.md,
    maxWidth: 340,
  },
  next: {
    borderBottomColor: colors.line,
    borderBottomWidth: 1,
    borderTopColor: colors.line,
    borderTopWidth: 1,
    gap: 4,
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
  },
  nextLabel: {
    color: colors.muted,
    fontSize: 12,
  },
  nextWhen: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  nextCar: {
    color: colors.muted,
    fontSize: 14,
  },
  quiet: {
    color: colors.muted,
    fontSize: 14,
    marginTop: spacing.lg,
  },
  list: {
    marginTop: spacing.xl,
  },
  row: {
    borderBottomColor: colors.line,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 18,
  },
  num: {
    color: colors.muted,
    fontSize: 13,
    width: 28,
  },
  rowCopy: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '500',
  },
  rowDetail: {
    color: colors.muted,
    fontSize: 14,
  },
  hours: {
    gap: 8,
    marginTop: spacing.xl,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hoursDay: {
    color: colors.text,
    fontSize: 13,
  },
  hoursTime: {
    color: colors.muted,
    fontSize: 13,
  },
});
