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
      <Text style={styles.kicker}>{shop.serviceAreaShort}</Text>
      <Text style={styles.title}>{shop.name}</Text>
      <Text style={styles.lede}>{shop.tagline}</Text>

      <View style={styles.block}>
        {shop.bio.map((paragraph) => (
          <Text key={paragraph} style={styles.bio}>
            {paragraph}
          </Text>
        ))}
      </View>

      <Text style={styles.section}>Work</Text>
      {shop.workList.map((item) => (
        <Text key={item} style={styles.work}>
          {item}
        </Text>
      ))}
      <Text style={styles.muted}>{shop.exclusionsNote}</Text>
      <Text style={styles.pay}>Pay with {shop.payment.toLowerCase()}.</Text>

      <Text style={styles.section}>{shop.hoursHeadline}</Text>
      <Text style={styles.muted}>{shop.hoursBody}</Text>
      {windows.length ? (
        windows.map((row) => (
          <View key={row.day} style={styles.hoursRow}>
            <Text style={styles.hoursDay}>{row.day}</Text>
            <Text style={styles.hoursTime}>{row.hours}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.muted}>No windows posted right now.</Text>
      )}

      <Text style={styles.section}>Contact</Text>
      <Text style={styles.bio}>{shop.serviceArea}</Text>
      <Text style={styles.phone}>{shop.phoneDisplay}</Text>
      <Text style={styles.muted}>{shop.noEmergencyNote}</Text>
      <Text style={styles.muted}>{shop.emailNote}</Text>
      <Text style={styles.muted}>{shop.instagramNote}</Text>

      <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
        <PrimaryButton
          title={`Text Joe  ${shop.phoneDisplay}`}
          onPress={() => {
            void Linking.openURL(shop.smsUrl);
          }}
        />
        <SecondaryButton
          title="Call Joe"
          onPress={() => {
            void Linking.openURL(shop.telUrl);
          }}
        />
        <SecondaryButton title="Joe: set appointment windows" onPress={() => router.push('/availability')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    color: colors.amber,
    fontFamily: fonts.display,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 56,
    fontWeight: '700',
    letterSpacing: -1.6,
    lineHeight: 54,
  },
  lede: {
    color: colors.text,
    fontSize: 20,
    lineHeight: 28,
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
  section: {
    color: colors.amber,
    fontFamily: fonts.display,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginTop: spacing.lg,
    textTransform: 'uppercase',
  },
  work: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.4,
    lineHeight: 30,
    marginTop: 8,
  },
  muted: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  pay: {
    color: colors.text,
    fontSize: 16,
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
    fontWeight: '700',
  },
  hoursTime: {
    color: colors.muted,
    flexShrink: 1,
    textAlign: 'right',
  },
  phone: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 28,
    fontWeight: '700',
  },
});
