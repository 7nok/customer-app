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
      <Text style={styles.title}>
        {shop.name}
        {'\n'}
        {shop.locationLabel}
      </Text>
      <Text style={styles.tag}>{shop.tagline}</Text>

      {shop.placeholderBio.map((paragraph) => (
        <Text
          key={paragraph}
          style={[styles.bio, paragraph.startsWith('[PLACEHOLDER') && styles.placeholder]}>
          {paragraph}
        </Text>
      ))}

      <Text style={styles.kicker}>Work</Text>
      {shop.workList.map((item) => (
        <Text key={item} style={styles.item}>
          {item}
        </Text>
      ))}

      <Text style={styles.kicker}>Hours</Text>
      {hours.map((row) => (
        <View key={row.day} style={styles.hoursRow}>
          <Text style={styles.hoursDay}>{row.day}</Text>
          <Text style={styles.hoursTime}>{row.hours}</Text>
        </View>
      ))}

      <Text style={styles.kicker}>Contact</Text>
      <Text style={styles.item}>{shop.phone}</Text>
      <Text style={styles.note}>{shop.phoneNote}</Text>

      <View style={{ gap: spacing.sm, marginTop: spacing.lg }}>
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
    fontSize: 12,
    marginBottom: 8,
    marginTop: spacing.lg,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '500',
    letterSpacing: -0.4,
    lineHeight: 36,
  },
  tag: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
    marginTop: spacing.sm,
  },
  bio: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 28,
    marginTop: spacing.md,
  },
  placeholder: {
    color: colors.warn,
    fontWeight: '600',
  },
  item: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 26,
  },
  note: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  hoursDay: {
    color: colors.text,
    fontSize: 15,
  },
  hoursTime: {
    color: colors.muted,
    fontSize: 15,
  },
});
