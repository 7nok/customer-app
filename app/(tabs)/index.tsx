import { useRouter } from 'expo-router';
import { Linking, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { HeroImage } from '@/components/hero-image';
import { Screen } from '@/components/ui';
import { HERO_CREDIT } from '@/constants/media';
import { shop } from '@/constants/shop';
import { colors, fonts, spacing } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
import { useWideLayout } from '@/hooks/use-wide-layout';
import {
  appointmentStatusLabel,
  formatDate,
  formatTime,
  openAppointmentWindows,
  vehicleLabel,
} from '@/lib/format';

export default function HomeScreen() {
  const router = useRouter();
  const wide = useWideLayout(720);
  const { width } = useWindowDimensions();
  const { profile, upcomingAppointments, weeklySlots } = useAppState();
  const nextAppointment = upcomingAppointments[0];
  const windows = openAppointmentWindows(weeklySlots);
  const photoHeight = Math.max(200, Math.min(Math.round(width * 0.42), 320));

  return (
    <Screen padded={false}>
    <View style={styles.page}>
      <View style={styles.mast}>
        <Text style={styles.brand}>{shop.name}</Text>
        <Text style={styles.place}>{shop.serviceAreaShort}</Text>
      </View>

      <Text style={styles.poster}>WE{'\n'}COME{'\n'}TO YOU</Text>
      <Text style={styles.sub}>{shop.tagline}</Text>

      <View style={[styles.photoPlate, { height: photoHeight }]}>
        <View style={styles.photoRule} />
        <HeroImage style={styles.photo} contentPosition={{ top: '40%', left: '70%' }} />
      </View>

      <View style={styles.ctaRow}>
        <Pressable
          onPress={() => router.push('/book')}
          style={({ pressed }) => [styles.ctaFill, pressed && styles.pressed]}>
          <Text style={styles.ctaFillLabel}>Request a visit</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            void Linking.openURL(shop.smsUrl);
          }}
          style={({ pressed }) => [styles.ctaGhost, pressed && styles.pressed]}>
          <Text style={styles.ctaGhostLabel}>Text Joe</Text>
        </Pressable>
      </View>

      {nextAppointment ? (
        <Pressable onPress={() => router.push('/book')} style={styles.ticket}>
          <Text style={styles.ticketKicker}>{appointmentStatusLabel(nextAppointment.status)}</Text>
          <Text style={styles.ticketWhen}>
            {formatDate(nextAppointment.date)} · {formatTime(nextAppointment.start)}
          </Text>
          <Text style={styles.ticketCar}>
            {vehicleLabel(nextAppointment.year, nextAppointment.make, nextAppointment.model)}
          </Text>
        </Pressable>
      ) : null}

      <View style={[styles.grid, wide && styles.gridWide]}>
        <Tile
          span={wide ? 2 : 1}
          index="01"
          title="Request a visit"
          detail="Pick a window. Joe confirms."
          accent
          onPress={() => router.push('/book')}
        />
        <Tile
          index="02"
          title="Guide"
          detail="Cars, trucks, intervals"
          onPress={() => router.push('/maintenance')}
        />
        <Tile
          index="03"
          title="Rewards"
          detail={profile ? profile.name.split(' ')[0] : 'Discounts signup'}
          onPress={() => router.push('/loyalty')}
        />
        <Tile
          span={wide ? 2 : 1}
          index="04"
          title="The shop"
          detail={shop.serviceArea}
          onPress={() => router.push('/about')}
        />
      </View>

      <View style={styles.windows}>
        <Text style={styles.windowsKicker}>{shop.hoursHeadline}</Text>
        <Text style={styles.windowsBody}>{shop.hoursBody}</Text>
        <Text style={styles.windowsList}>
          {windows.length
            ? windows.map((row) => `${row.day} ${row.hours}`).join('  ·  ')
            : 'No windows posted — text Joe to ask.'}
        </Text>
        <Text style={styles.credit}>{HERO_CREDIT}</Text>
      </View>
    </View>
    </Screen>
  );
}

function Tile({
  index,
  title,
  detail,
  onPress,
  accent,
  span = 1,
}: {
  index: string;
  title: string;
  detail: string;
  onPress: () => void;
  accent?: boolean;
  span?: 1 | 2;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        span === 2 && styles.tileSpan,
        accent && styles.tileAccent,
        pressed && styles.pressed,
      ]}>
      <Text style={[styles.tileIndex, accent && styles.tileIndexOn]}>{index}</Text>
      <Text style={[styles.tileTitle, accent && styles.tileTitleOn]}>{title}</Text>
      <Text style={[styles.tileDetail, accent && styles.tileDetailOn]}>{detail}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.bg,
    flexGrow: 1,
    paddingBottom: 36,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  mast: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: spacing.md,
  },
  brand: {
    color: colors.amber,
    fontFamily: fonts.display,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  place: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  poster: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 72,
    fontWeight: '700',
    letterSpacing: -2.4,
    lineHeight: 64,
  },
  sub: {
    color: colors.text,
    fontSize: 18,
    lineHeight: 26,
    marginTop: spacing.sm,
    maxWidth: 360,
  },
  photoPlate: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    overflow: 'hidden',
  },
  photoRule: {
    backgroundColor: colors.amber,
    width: 10,
  },
  photo: {
    flex: 1,
    height: '100%',
  },
  ctaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: spacing.lg,
  },
  ctaFill: {
    backgroundColor: colors.amber,
    borderRadius: 999,
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  ctaFillLabel: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  ctaGhost: {
    borderColor: colors.text,
    borderRadius: 999,
    borderWidth: 1.5,
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  ctaGhostLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  ticket: {
    backgroundColor: colors.card,
    borderLeftColor: colors.amber,
    borderLeftWidth: 6,
    gap: 4,
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  ticketKicker: {
    color: colors.amberDeep,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  ticketWhen: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 24,
    fontWeight: '700',
  },
  ticketCar: {
    color: colors.muted,
    fontSize: 14,
  },
  grid: {
    gap: 12,
    marginTop: spacing.xl,
  },
  gridWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tile: {
    backgroundColor: colors.card,
    flexGrow: 1,
    gap: 6,
    minWidth: '46%',
    padding: spacing.md,
  },
  tileSpan: {
    minWidth: '100%',
  },
  tileAccent: {
    backgroundColor: colors.cream,
  },
  tileIndex: {
    color: colors.amber,
    fontFamily: fonts.display,
    fontSize: 14,
    fontWeight: '700',
  },
  tileIndexOn: {
    color: colors.amber,
  },
  tileTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.6,
  },
  tileTitleOn: {
    color: colors.white,
  },
  tileDetail: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  tileDetailOn: {
    color: '#D9D0C2',
  },
  windows: {
    gap: 8,
    marginTop: spacing.xl,
  },
  windowsKicker: {
    color: colors.amber,
    fontFamily: fonts.display,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  windowsBody: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
  windowsList: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
  },
  credit: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 8,
  },
  pressed: {
    opacity: 0.72,
  },
});
