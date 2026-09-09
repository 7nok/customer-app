import { useRouter } from 'expo-router';
import { Linking, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton, Screen, SecondaryButton } from '@/components/ui';
import { shop } from '@/constants/shop';
import { colors, fonts, spacing } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
import { openAppointmentWindows } from '@/lib/format';

export default function AboutScreen() {
  const router = useRouter();
  const { weeklySlots } = useAppState();
  const windows = openAppointmentWindows(weeklySlots);

  return (
    <Screen>
      <Text style={styles.job}>UNIT FILE</Text>
      <Text style={styles.title}>{shop.name.toUpperCase()}</Text>
      <Text style={styles.lede}>{shop.tagline.toUpperCase()}</Text>

      <View style={styles.block}>
        {shop.bio.map((paragraph) => (
          <Text key={paragraph} style={styles.bio}>
            {paragraph}
          </Text>
        ))}
      </View>

      <Text style={styles.job}>SCOPE</Text>
      {shop.workList.map((item, index) => (
        <Text key={item} style={styles.line}>
          {String(index + 1).padStart(2, '0')}  {item.toUpperCase()}
        </Text>
      ))}
      <Text style={styles.muted}>{shop.exclusionsNote}</Text>
      <Text style={styles.line}>PAY  {shop.payment.toUpperCase()}</Text>

      <Text style={styles.job}>WINDOWS</Text>
      <Text style={styles.muted}>{shop.hoursBody}</Text>
      {windows.length ? (
        windows.map((row) => (
          <View key={row.day} style={styles.hoursRow}>
            <Text style={styles.hoursDay}>{row.day.toUpperCase()}</Text>
            <Text style={styles.hoursTime}>{row.hours}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.line}>NO WINDOWS POSTED</Text>
      )}

      <Text style={styles.job}>CONTACT</Text>
      <Text style={styles.line}>{shop.serviceArea.toUpperCase()}</Text>
      <Text style={styles.phone}>{shop.phoneDisplay}</Text>
      <Text style={styles.muted}>{shop.noEmergencyNote}</Text>
      <Text style={styles.muted}>{shop.emailNote}</Text>
      <Text style={styles.muted}>{shop.instagramNote}</Text>

      <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
        <PrimaryButton
          title={`TEXT JOE  ${shop.phoneDisplay}`}
          onPress={() => {
            void Linking.openURL(shop.smsUrl);
          }}
        />
        <SecondaryButton
          title="CALL JOE"
          onPress={() => {
            void Linking.openURL(shop.telUrl);
          }}
        />
        <SecondaryButton title="JOE: SET WINDOWS" onPress={() => router.push('/availability')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  job: {
    color: colors.amber,
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1.8,
    marginTop: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: 1,
    lineHeight: 44,
    marginTop: 6,
  },
  lede: {
    color: colors.muted,
    fontFamily: fonts.mono,
    fontSize: 12,
    letterSpacing: 0.8,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  block: {
    gap: 14,
  },
  bio: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 26,
  },
  line: {
    color: colors.text,
    fontFamily: fonts.mono,
    fontSize: 12,
    letterSpacing: 0.4,
    lineHeight: 20,
    marginTop: 6,
  },
  muted: {
    color: colors.muted,
    fontFamily: fonts.mono,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 8,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 6,
  },
  hoursDay: {
    color: colors.text,
    fontFamily: fonts.mono,
    fontSize: 12,
  },
  hoursTime: {
    color: colors.muted,
    flexShrink: 1,
    fontFamily: fonts.mono,
    fontSize: 12,
    textAlign: 'right',
  },
  phone: {
    color: colors.amber,
    fontFamily: fonts.mono,
    fontSize: 18,
    marginTop: 8,
  },
});
