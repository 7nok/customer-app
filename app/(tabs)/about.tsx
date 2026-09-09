import { useRouter } from 'expo-router';
import { Linking, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton, Screen, SecondaryButton } from '@/components/ui';
import { shop } from '@/constants/shop';
import { colors, spacing } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
import { openAppointmentWindows } from '@/lib/format';

export default function AboutScreen() {
  const router = useRouter();
  const { weeklySlots } = useAppState();
  const windows = openAppointmentWindows(weeklySlots);

  return (
    <Screen>
      <Text style={styles.kicker}>Shop</Text>
      <Text style={styles.title}>{shop.name}</Text>
      <Text style={styles.lede}>{shop.tagline}</Text>
      <Text style={styles.lede}>{shop.lede}</Text>

      <View style={styles.block}>
        {shop.bio.map((paragraph) => (
          <Text key={paragraph} style={styles.bio}>
            {paragraph}
          </Text>
        ))}
      </View>

      <View style={styles.rule} />
      <Text style={styles.kicker}>Work</Text>
      {shop.workList.map((item, index) => (
        <Text key={item} style={styles.line}>
          {String(index + 1).padStart(2, '0')}  {item}
        </Text>
      ))}
      <Text style={styles.muted}>{shop.exclusionsNote}</Text>
      <Text style={styles.line}>Pay with {shop.payment.toLowerCase()}.</Text>

      <View style={styles.rule} />
      <Text style={styles.kicker}>{shop.hoursHeadline}</Text>
      <Text style={styles.muted}>{shop.hoursBody}</Text>
      {windows.length ? (
        windows.map((row) => (
          <View key={row.day} style={styles.hoursRow}>
            <Text style={styles.hoursDay}>{row.day}</Text>
            <Text style={styles.hoursTime}>{row.hours}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.line}>No windows posted right now.</Text>
      )}

      <View style={styles.rule} />
      <Text style={styles.kicker}>Contact</Text>
      <Text style={styles.line}>{shop.serviceArea}</Text>
      <Text style={styles.line}>{shop.phoneDisplay}</Text>
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
  lede: {
    color: colors.muted,
    fontSize: 18,
    lineHeight: 26,
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
  rule: {
    backgroundColor: colors.line,
    height: 1,
    marginVertical: spacing.md,
  },
  line: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 26,
  },
  muted: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 6,
  },
  hoursDay: {
    color: colors.text,
    fontWeight: '500',
  },
  hoursTime: {
    color: colors.muted,
    flexShrink: 1,
    textAlign: 'right',
  },
});
