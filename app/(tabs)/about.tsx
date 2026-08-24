import { useRouter } from 'expo-router';
import { Linking, StyleSheet, Text, View } from 'react-native';

import { Banner, Card, PageIntro, PrimaryButton, Screen, SecondaryButton } from '@/components/ui';
import { shop } from '@/constants/shop';
import { colors } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
import { summarizeHours } from '@/lib/format';

export default function AboutScreen() {
  const router = useRouter();
  const { weeklySlots } = useAppState();
  const hours = summarizeHours(weeklySlots);

  return (
    <Screen>
      <PageIntro eyebrow="About Me" title={`${shop.name} · ${shop.locationLabel}`} body={shop.tagline} />

      <Card>
        {shop.placeholderBio.map((paragraph) => (
          <Text
            key={paragraph}
            style={[styles.bio, paragraph.startsWith('[PLACEHOLDER') && styles.placeholder]}>
            {paragraph}
          </Text>
        ))}
      </Card>

      <Card>
        <Text style={styles.label}>What we work on</Text>
        {shop.workList.map((item) => (
          <Text key={item} style={styles.body}>
            • {item}
          </Text>
        ))}
      </Card>

      <Card>
        <Text style={styles.label}>Find us</Text>
        <Text style={styles.value}>{shop.locationLabel}</Text>
        <Text style={styles.muted}>Street address can be added when Joe has a shop line on the books.</Text>
        <Text style={styles.label}>Phone</Text>
        <Text style={styles.value}>{shop.phone}</Text>
        <Text style={styles.muted}>{shop.phoneNote}</Text>
      </Card>

      <Card>
        <Text style={styles.label}>Weekly hours</Text>
        {hours.map((row) => (
          <View key={row.day} style={styles.hoursRow}>
            <Text style={styles.hoursDay}>{row.day}</Text>
            <Text style={styles.hoursTime}>{row.hours}</Text>
          </View>
        ))}
      </Card>

      <Banner>
        Hours and open appointment slots are the same weekly schedule Joe can edit in Shop hours.
      </Banner>

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
    </Screen>
  );
}

const styles = StyleSheet.create({
  bio: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
  placeholder: {
    color: colors.warn,
    fontWeight: '700',
  },
  label: {
    color: colors.amberDeep,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  value: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  body: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 22,
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
  },
  hoursDay: {
    color: colors.text,
    fontWeight: '700',
  },
  hoursTime: {
    color: colors.muted,
    flex: 1,
    textAlign: 'right',
  },
});
