import { useRouter } from 'expo-router';
import { Linking, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { HeroImage } from '@/components/hero-image';
import { PrimaryButton, Screen } from '@/components/ui';
import { HERO_CREDIT } from '@/constants/media';
import { shop } from '@/constants/shop';
import { colors, spacing } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
import {
  appointmentStatusLabel,
  formatDate,
  formatTime,
  openAppointmentWindows,
  vehicleLabel,
} from '@/lib/format';

export default function HomeScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const { profile, upcomingAppointments, weeklySlots } = useAppState();
  const nextAppointment = upcomingAppointments[0];
  const windows = openAppointmentWindows(weeklySlots);
  const heroHeight = Math.max(360, Math.round(Math.min(height * 0.66, 620)));

  return (
    <Screen padded={false}>
      <View style={[styles.hero, { height: heroHeight }]}>
        <HeroImage style={StyleSheet.absoluteFillObject} contentPosition={{ top: '35%', left: '50%' }} />
        <View style={styles.heroDim} />
        <View style={styles.heroFade} />
        <View style={styles.heroCopy}>
          <Text style={styles.kicker}>{shop.serviceAreaShort}</Text>
          <Text style={styles.wordmark}>{shop.name}</Text>
          <Text style={styles.tagline}>{shop.tagline}</Text>
          <View style={styles.cta}>
            <PrimaryButton title="Book a visit" onPress={() => router.push('/book')} />
          </View>
        </View>
      </View>

      <View style={styles.stage}>
        {nextAppointment ? (
          <Pressable onPress={() => router.push('/book')} style={styles.nextLine}>
            <Text style={styles.nextKicker}>{appointmentStatusLabel(nextAppointment.status)}</Text>
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
            title={profile ? profile.name.split(' ')[0] : 'Rewards'}
            onPress={() => router.push('/loyalty')}
          />
          <LaunchRow index="04" title="Shop" onPress={() => router.push('/about')} />
        </View>

        <Text style={styles.hoursKicker}>{shop.hoursHeadline}</Text>
        <Text style={styles.hours}>
          {windows.length
            ? windows.map((row) => `${row.day} ${row.hours}`).join('  ·  ')
            : 'Joe has not posted windows yet — text to ask.'}
        </Text>
        <Text style={styles.hoursNote}>{shop.hoursBody}</Text>

        <Pressable
          onPress={() => {
            void Linking.openURL(shop.smsUrl);
          }}
          style={({ pressed }) => [styles.textJoe, pressed && { opacity: 0.55 }]}>
          <Text style={styles.textJoeLabel}>Text Joe  {shop.phoneDisplay}</Text>
        </Pressable>
        <Text style={styles.credit}>{HERO_CREDIT}</Text>
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
  hero: {
    justifyContent: 'flex-end',
    overflow: 'hidden',
    width: '100%',
  },
  heroDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  heroFade: {
    backgroundColor: colors.bg,
    bottom: 0,
    height: '46%',
    left: 0,
    opacity: 0.92,
    position: 'absolute',
    right: 0,
  },
  heroCopy: {
    gap: 10,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    zIndex: 1,
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
    fontSize: 56,
    fontWeight: '500',
    letterSpacing: -2.2,
    lineHeight: 58,
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
  stage: {
    gap: spacing.md,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
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
  hoursKicker: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 1.6,
    marginTop: spacing.sm,
    textTransform: 'uppercase',
  },
  hours: {
    color: colors.muted,
    fontSize: 12,
    letterSpacing: 0.2,
    lineHeight: 18,
  },
  hoursNote: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
  },
  textJoe: {
    marginTop: spacing.sm,
    minHeight: 44,
    justifyContent: 'center',
  },
  textJoeLabel: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  credit: {
    color: colors.muted,
    fontSize: 11,
    marginTop: spacing.xs,
  },
});
