import { useRouter } from 'expo-router';
import { Linking, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton, Screen, SecondaryButton } from '@/components/ui';
import { shop } from '@/constants/shop';
import { colors, fonts, spacing } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
import { summarizeHours } from '@/lib/format';

export default function AboutScreen() {
  const router = useRouter();
  const { weeklySlots } = useAppState();
  const hours = summarizeHours(weeklySlots);

  return (
    <Screen>
      <Text style={styles.folio}>The shop</Text>
      <Text style={styles.title}>{shop.name}</Text>
      <Text style={styles.deck}>{shop.tagline}</Text>

      {shop.placeholderBio.map((paragraph) => (
        <Text
          key={paragraph}
          style={[styles.story, paragraph.startsWith('[PLACEHOLDER') && styles.placeholder]}>
          {paragraph}
        </Text>
      ))}

      <Text style={styles.chapter}>What we take on</Text>
      {shop.workList.map((item, index) => (
        <Text key={item} style={styles.catalog}>
          {String(index + 1).padStart(2, '0')}  {item}
        </Text>
      ))}

      <View style={styles.plaque}>
        <Text style={styles.plaqueKicker}>Find us</Text>
        <Text style={styles.plaqueValue}>{shop.locationLabel}</Text>
        <Text style={styles.plaqueMuted}>Street address can be added when a shop line is on the books.</Text>
        <Text style={styles.plaqueKicker}>Telephone</Text>
        <Text style={styles.plaqueValue}>{shop.phone}</Text>
        <Text style={styles.plaqueMuted}>{shop.phoneNote}</Text>
        <Text style={styles.plaqueKicker}>Weekly hours</Text>
        {hours.map((row) => (
          <View key={row.day} style={styles.hoursRow}>
            <Text style={styles.hoursDay}>{row.day}</Text>
            <Text style={styles.hoursTime}>{row.hours}</Text>
          </View>
        ))}
      </View>

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
  folio: {
    color: colors.amberDeep,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 40,
    fontWeight: '600',
    marginTop: 6,
  },
  deck: {
    color: colors.muted,
    fontFamily: fonts.display,
    fontSize: 20,
    lineHeight: 28,
    marginTop: 8,
    marginBottom: spacing.md,
  },
  story: {
    color: colors.text,
    fontSize: 17,
    lineHeight: 28,
    marginBottom: spacing.md,
  },
  placeholder: {
    color: colors.warn,
    fontWeight: '700',
  },
  chapter: {
    color: colors.amberDeep,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.8,
    marginBottom: 8,
    marginTop: spacing.sm,
    textTransform: 'uppercase',
  },
  catalog: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 28,
  },
  plaque: {
    backgroundColor: colors.navy,
    gap: 6,
    marginTop: spacing.xl,
    padding: spacing.md,
  },
  plaqueKicker: {
    color: colors.amber,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.4,
    marginTop: 8,
    textTransform: 'uppercase',
  },
  plaqueValue: {
    color: colors.cream,
    fontFamily: fonts.display,
    fontSize: 20,
  },
  plaqueMuted: {
    color: colors.tabInactive,
    fontSize: 13,
    lineHeight: 20,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hoursDay: {
    color: colors.cream,
    fontSize: 13,
  },
  hoursTime: {
    color: colors.tabInactive,
    fontSize: 13,
  },
});
