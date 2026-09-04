import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/ui';
import { shop } from '@/constants/shop';
import { colors, fonts, spacing } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
import { formatDate, formatTime, summarizeHours, vehicleLabel } from '@/lib/format';

export default function HomeScreen() {
  const router = useRouter();
  const { profile, upcomingAppointments, weeklySlots } = useAppState();
  const nextAppointment = upcomingAppointments[0];
  const hours = summarizeHours(weeklySlots);
  const story = shop.placeholderBio.find((p) => !p.startsWith('[PLACEHOLDER')) ?? shop.tagline;

  return (
    <Screen>
      <Text style={styles.folio}>{shop.locationLabel}</Text>
      <Text style={styles.headline}>{shop.tagline}</Text>

      <View style={styles.plaque}>
        <Text style={styles.plaqueKicker}>Hours & place</Text>
        <Text style={styles.plaquePlace}>{shop.locationLabel}</Text>
        {hours.map((row) => (
          <View key={row.day} style={styles.hoursRow}>
            <Text style={styles.hoursDay}>{row.day}</Text>
            <Text style={styles.hoursTime}>{row.hours}</Text>
          </View>
        ))}
        <Pressable onPress={() => router.push('/availability')}>
          <Text style={styles.plaqueLink}>Adjust the weekly board</Text>
        </Pressable>
      </View>

      <Text style={styles.chapter}>From the bench</Text>
      <Text style={styles.story}>{story}</Text>
      <Pressable onPress={() => router.push('/about')}>
        <Text style={styles.more}>Continue the shop story</Text>
      </Pressable>

      {nextAppointment ? (
        <Pressable onPress={() => router.push('/book')} style={styles.visit}>
          <Text style={styles.chapter}>Your next visit</Text>
          <Text style={styles.visitWhen}>
            {formatDate(nextAppointment.date)} · {formatTime(nextAppointment.start)}
          </Text>
          <Text style={styles.visitCar}>
            {vehicleLabel(nextAppointment.year, nextAppointment.make, nextAppointment.model)}
          </Text>
        </Pressable>
      ) : null}

      <Text style={styles.chapter}>In the catalog</Text>
      {shop.workList.map((item, index) => (
        <Text key={item} style={styles.catalog}>
          {String(index + 1).padStart(2, '0')}  {item}
        </Text>
      ))}

      <Pressable onPress={() => router.push('/book')} style={styles.bookRule}>
        <Text style={styles.bookCta}>Request a visit</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/maintenance')}>
        <Text style={styles.more}>Read the maintenance guide</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/loyalty')}>
        <Text style={styles.colophon}>
          {profile ? `On the list as ${profile.name.split(' ')[0]}` : 'Register the household'}
        </Text>
      </Pressable>
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
  headline: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 32,
    fontWeight: '600',
    letterSpacing: -0.3,
    lineHeight: 40,
    marginTop: 8,
  },
  plaque: {
    backgroundColor: colors.navy,
    gap: 6,
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  plaqueKicker: {
    color: colors.amber,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  plaquePlace: {
    color: colors.cream,
    fontFamily: fonts.display,
    fontSize: 20,
    marginBottom: 6,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  hoursDay: {
    color: colors.cream,
    fontSize: 13,
  },
  hoursTime: {
    color: colors.tabInactive,
    fontSize: 13,
    textAlign: 'right',
  },
  plaqueLink: {
    color: colors.amber,
    fontSize: 13,
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  chapter: {
    color: colors.amberDeep,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.8,
    marginTop: spacing.xl,
    textTransform: 'uppercase',
  },
  story: {
    color: colors.text,
    fontSize: 17,
    lineHeight: 28,
    marginTop: 8,
  },
  more: {
    color: colors.amberDeep,
    fontFamily: fonts.display,
    fontSize: 16,
    marginTop: 10,
  },
  visit: {
    marginTop: 4,
  },
  visitWhen: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 20,
    marginTop: 6,
  },
  visitCar: {
    color: colors.muted,
    fontSize: 14,
  },
  catalog: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 28,
  },
  bookRule: {
    borderColor: colors.amber,
    borderWidth: 1,
    marginTop: spacing.xl,
    paddingVertical: 14,
    alignItems: 'center',
  },
  bookCta: {
    color: colors.navy,
    fontFamily: fonts.display,
    fontSize: 18,
  },
  colophon: {
    color: colors.muted,
    fontSize: 13,
    marginTop: spacing.md,
  },
});
