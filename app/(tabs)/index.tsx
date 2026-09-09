import { useRouter } from 'expo-router';
import { Linking, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { HeroImage } from '@/components/hero-image';
import { Screen } from '@/components/ui';
import { HERO_CREDIT } from '@/constants/media';
import { shop } from '@/constants/shop';
import { colors, fonts, spacing } from '@/constants/theme';
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
  const { width } = useWindowDimensions();
  const { profile, upcomingAppointments, weeklySlots } = useAppState();
  const nextAppointment = upcomingAppointments[0];
  const windows = openAppointmentWindows(weeklySlots);
  const plateHeight = Math.max(220, Math.min(Math.round(width * 0.52), 340));

  return (
    <Screen padded={false}>
      <View style={styles.page}>
        <View style={styles.ticker}>
          <Text style={styles.tickerText}>
            BY APPT  ·  {shop.serviceAreaShort.toUpperCase()}  ·  TEXT {shop.phoneDisplay}
          </Text>
        </View>

        <View style={[styles.plate, { height: plateHeight }]}>
          <View style={[styles.corner, styles.tl]} />
          <View style={[styles.corner, styles.tr]} />
          <View style={[styles.corner, styles.bl]} />
          <View style={[styles.corner, styles.br]} />
          <HeroImage style={StyleSheet.absoluteFillObject} contentPosition={{ top: '45%', left: '55%' }} />
        </View>
        <Text style={styles.credit}>{HERO_CREDIT}</Text>

        <Text style={styles.job}>JOB / MOBILE UNIT</Text>
        <Text style={styles.wordmark}>{shop.name.toUpperCase()}</Text>
        <Text style={styles.tag}>{shop.tagline.toUpperCase()}</Text>

        <Pressable
          onPress={() => router.push('/book')}
          style={({ pressed }) => [styles.dispatch, pressed && { opacity: 0.75 }]}>
          <Text style={styles.dispatchLabel}>REQUEST A VISIT</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            void Linking.openURL(shop.smsUrl);
          }}
          style={({ pressed }) => [styles.textLink, pressed && { opacity: 0.6 }]}>
          <Text style={styles.textLinkLabel}>TEXT JOE  {shop.phoneDisplay}</Text>
        </Pressable>

        {nextAppointment ? (
          <Pressable onPress={() => router.push('/book')} style={styles.pending}>
            <Text style={styles.job}>{appointmentStatusLabel(nextAppointment.status).toUpperCase()}</Text>
            <Text style={styles.pendingWhen}>
              {formatDate(nextAppointment.date)}  {formatTime(nextAppointment.start)}
            </Text>
            <Text style={styles.pendingCar}>
              {vehicleLabel(nextAppointment.year, nextAppointment.make, nextAppointment.model)}
            </Text>
          </Pressable>
        ) : null}

        <View style={styles.bays}>
          <Bay n="01" title="REQUEST VISIT" detail="Window + vehicle + notes" onPress={() => router.push('/book')} />
          <Bay n="02" title="MAINTENANCE GUIDE" detail="Cars / trucks / intervals" onPress={() => router.push('/maintenance')} />
          <Bay
            n="03"
            title="REWARDS LIST"
            detail={profile ? profile.name.split(' ')[0].toUpperCase() : 'DISCOUNTS SIGNUP'}
            onPress={() => router.push('/loyalty')}
          />
          <Bay n="04" title="THE SHOP" detail={shop.serviceArea.toUpperCase()} onPress={() => router.push('/about')} />
        </View>

        <Text style={styles.job}>DISPATCH BOARD</Text>
        <Text style={styles.boardNote}>{shop.hoursBody}</Text>
        {windows.length ? (
          windows.map((row) => (
            <View key={row.day} style={styles.boardRow}>
              <Text style={styles.boardDay}>{row.day.toUpperCase()}</Text>
              <Text style={styles.boardTime}>{row.hours}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.boardNote}>NO WINDOWS POSTED — TEXT TO ASK.</Text>
        )}
      </View>
    </Screen>
  );
}

function Bay({
  n,
  title,
  detail,
  onPress,
}: {
  n: string;
  title: string;
  detail: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.bay, pressed && { opacity: 0.65 }]}>
      <Text style={styles.bayN}>{n}</Text>
      <View style={styles.bayCopy}>
        <Text style={styles.bayTitle}>{title}</Text>
        <Text style={styles.bayDetail}>{detail}</Text>
      </View>
      <Text style={styles.bayGo}>→</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  ticker: {
    borderColor: colors.line,
    borderWidth: 1,
    marginBottom: spacing.md,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  tickerText: {
    color: colors.amber,
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 0.6,
  },
  plate: {
    borderColor: colors.line,
    borderWidth: 1,
    overflow: 'hidden',
    width: '100%',
  },
  corner: {
    borderColor: colors.amber,
    height: 14,
    position: 'absolute',
    width: 14,
    zIndex: 2,
  },
  tl: { borderLeftWidth: 2, borderTopWidth: 2, left: 4, top: 4 },
  tr: { borderRightWidth: 2, borderTopWidth: 2, right: 4, top: 4 },
  bl: { borderBottomWidth: 2, borderLeftWidth: 2, bottom: 4, left: 4 },
  br: { borderBottomWidth: 2, borderRightWidth: 2, bottom: 4, right: 4 },
  credit: {
    color: colors.muted,
    fontFamily: fonts.mono,
    fontSize: 10,
    marginTop: 6,
  },
  job: {
    color: colors.amber,
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1.6,
    marginTop: spacing.lg,
  },
  wordmark: {
    color: colors.text,
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: 1.2,
    lineHeight: 46,
    marginTop: 6,
  },
  tag: {
    color: colors.muted,
    fontFamily: fonts.mono,
    fontSize: 12,
    letterSpacing: 0.8,
    lineHeight: 18,
    marginTop: 8,
  },
  dispatch: {
    alignItems: 'center',
    backgroundColor: colors.amber,
    marginTop: spacing.lg,
    minHeight: 50,
    justifyContent: 'center',
  },
  dispatchLabel: {
    color: colors.bg,
    fontFamily: fonts.mono,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  textLink: {
    marginTop: 12,
    minHeight: 36,
    justifyContent: 'center',
  },
  textLinkLabel: {
    color: colors.amber,
    fontFamily: fonts.mono,
    fontSize: 12,
    letterSpacing: 1,
  },
  pending: {
    borderColor: colors.amber,
    borderWidth: 1,
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  pendingWhen: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 6,
  },
  pendingCar: {
    color: colors.muted,
    fontFamily: fonts.mono,
    fontSize: 12,
    marginTop: 4,
  },
  bays: {
    borderTopColor: colors.line,
    borderTopWidth: 1,
    marginTop: spacing.xl,
  },
  bay: {
    alignItems: 'center',
    borderBottomColor: colors.line,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 16,
  },
  bayN: {
    color: colors.amber,
    fontFamily: fonts.mono,
    fontSize: 13,
    width: 28,
  },
  bayCopy: {
    flex: 1,
    gap: 4,
  },
  bayTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  bayDetail: {
    color: colors.muted,
    fontFamily: fonts.mono,
    fontSize: 11,
  },
  bayGo: {
    color: colors.amber,
    fontSize: 18,
  },
  boardNote: {
    color: colors.muted,
    fontFamily: fonts.mono,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 8,
  },
  boardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  boardDay: {
    color: colors.text,
    fontFamily: fonts.mono,
    fontSize: 12,
  },
  boardTime: {
    color: colors.muted,
    flexShrink: 1,
    fontFamily: fonts.mono,
    fontSize: 12,
    textAlign: 'right',
  },
});
