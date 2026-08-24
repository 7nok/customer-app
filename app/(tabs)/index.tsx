import { Link, useRouter } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Banner, Card, Screen } from '@/components/ui';
import { shop } from '@/constants/shop';
import { colors, radius, spacing } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
import { formatDate, formatTime, summarizeHours, vehicleLabel } from '@/lib/format';

export default function HomeScreen() {
  const router = useRouter();
  const { profile, upcomingAppointments, weeklySlots } = useAppState();
  const nextAppointment = upcomingAppointments[0];
  const openDays = summarizeHours(weeklySlots).filter((row) => row.hours !== 'Closed');

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.heroEyebrow}>{shop.locationLabel}</Text>
        <Text style={styles.heroTitle}>{shop.name}</Text>
        <Text style={styles.heroBody}>{shop.tagline}</Text>
      </View>

      <View style={styles.grid}>
        <HomeTile
          title="Book"
          body="Pick an open slot"
          icon="calendar"
          onPress={() => router.push('/book')}
        />
        <HomeTile
          title="Maintenance"
          body="Cars & trucks"
          icon="construct"
          onPress={() => router.push('/maintenance')}
        />
        <HomeTile
          title="Loyalty"
          body={profile ? 'Your account' : 'Sign up here'}
          icon="ribbon"
          onPress={() => router.push('/loyalty')}
        />
        <HomeTile
          title="About"
          body="Joe & the shop"
          icon="person"
          onPress={() => router.push('/about')}
        />
      </View>

      {nextAppointment ? (
        <Card onPress={() => router.push('/book')}>
          <Text style={styles.kicker}>Next visit</Text>
          <Text style={styles.cardTitle}>
            {formatDate(nextAppointment.date)} · {formatTime(nextAppointment.start)}
          </Text>
          <Text style={styles.muted}>
            {vehicleLabel(nextAppointment.year, nextAppointment.make, nextAppointment.model)}
          </Text>
        </Card>
      ) : (
        <Banner>
          No visit on the calendar yet. Book a time that already shows on Joe’s weekly schedule.
        </Banner>
      )}

      {profile ? (
        <Card onPress={() => router.push('/loyalty')}>
          <Text style={styles.kicker}>Loyalty</Text>
          <Text style={styles.cardTitle}>Welcome back, {profile.name.split(' ')[0]}.</Text>
          <Text style={styles.muted}>
            {profile.vehicles.length === 1
              ? vehicleLabel(
                  profile.vehicles[0].year,
                  profile.vehicles[0].make,
                  profile.vehicles[0].model,
                )
              : `${profile.vehicles.length} vehicles on your account`}
          </Text>
        </Card>
      ) : (
        <Card onPress={() => router.push('/loyalty/signup')}>
          <Text style={styles.kicker}>Loyalty</Text>
          <Text style={styles.cardTitle}>Join the shop list</Text>
          <Text style={styles.muted}>
            Leave your name, email, and vehicles on this phone so Joe has them handy.
          </Text>
        </Card>
      )}

      <Card>
        <Text style={styles.kicker}>This week</Text>
        {openDays.map((row) => (
          <View key={row.day} style={styles.hoursRow}>
            <Text style={styles.hoursDay}>{row.day}</Text>
            <Text style={styles.hoursTime}>{row.hours}</Text>
          </View>
        ))}
        <Link href="/availability" style={styles.link}>
          View or edit Joe’s available times
        </Link>
      </Card>
    </Screen>
  );
}

function HomeTile({
  title,
  body,
  icon,
  onPress,
}: {
  title: string;
  body: string;
  icon: ComponentProps<typeof Icon>['name'];
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.tile, pressed && { opacity: 0.85 }]}>
      <View style={styles.tileIcon}>
        <Icon name={icon} color={colors.amber} size={22} />
      </View>
      <Text style={styles.tileTitle}>{title}</Text>
      <Text style={styles.tileBody}>{body}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.navy,
    borderRadius: radius.lg,
    gap: 8,
    padding: spacing.lg,
  },
  heroEyebrow: {
    color: colors.amber,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: colors.cream,
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  heroBody: {
    color: '#C9D0D6',
    fontSize: 16,
    lineHeight: 22,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tile: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: 6,
    padding: spacing.md,
    width: '48%',
    flexGrow: 1,
  },
  tileIcon: {
    alignItems: 'center',
    backgroundColor: colors.navy,
    borderRadius: 10,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  tileTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  tileBody: {
    color: colors.muted,
    fontSize: 13,
  },
  kicker: {
    color: colors.amberDeep,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  muted: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  hoursDay: {
    color: colors.text,
    fontWeight: '700',
  },
  hoursTime: {
    color: colors.muted,
    flexShrink: 1,
    textAlign: 'right',
  },
  link: {
    color: colors.amberDeep,
    fontWeight: '700',
    marginTop: 6,
  },
});
