import { useRouter } from 'expo-router';
import { Linking, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton, Screen, SecondaryButton } from '@/components/ui';
import { shop } from '@/constants/shop';
import { colors, spacing } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
import { summarizeHours } from '@/lib/format';

export default function AboutScreen() {
  const router = useRouter();
  const { weeklySlots } = useAppState();
  const hours = summarizeHours(weeklySlots);

  return (
    <Screen>
      <Text style={styles.kicker}>Shop</Text>
      <Text style={styles.title}>{shop.name}</Text>
      <Text style={styles.lede}>{shop.tagline}</Text>

      <View style={styles.block}>
        {shop.placeholderBio.map((paragraph) => (
          <Text
            key={paragraph}
            style={[styles.bio, paragraph.startsWith('[PLACEHOLDER') && styles.placeholder]}>
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

      <View style={styles.rule} />
      <Text style={styles.kicker}>Hours</Text>
      {hours.map((row) => (
        <View key={row.day} style={styles.hoursRow}>
          <Text style={styles.hoursDay}>{row.day}</Text>
          <Text style={styles.hoursTime}>{row.hours}</Text>
        </View>
      ))}

      <View style={styles.rule} />
      <Text style={styles.kicker}>Contact</Text>
      <Text style={styles.line}>{shop.locationLabel}</Text>
      <Text style={styles.muted}>{shop.phone}</Text>
      <Text style={styles.muted}>{shop.phoneNote}</Text>

      <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
        <PrimaryButton
          title="Call the placeholder line"
          onPress={() => {
            void Linking.openURL(`tel:${shop.phoneTel}`);
          }}
        />
        <SecondaryButton
          title="Open Hillsboro, TX in maps"
          onPress={() => {
            void Linking.openURL(
              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.mapsQuery)}`,
            );
          }}
        />
        <SecondaryButton title="Joe: set available times" onPress={() => router.push('/availability')} />
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
  placeholder: {
    color: colors.warn,
    fontWeight: '600',
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
