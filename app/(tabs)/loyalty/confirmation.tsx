import { useRouter } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { Banner, Card, PageIntro, PrimaryButton, Screen, SecondaryButton } from '@/components/ui';
import { colors } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
import { vehicleLabel } from '@/lib/format';

export default function LoyaltyConfirmationScreen() {
  const router = useRouter();
  const { profile } = useAppState();

  if (!profile) {
    return (
      <Screen>
        <PageIntro title="No account on this device yet" />
        <PrimaryButton title="Sign up" onPress={() => router.replace('/loyalty/signup')} />
      </Screen>
    );
  }

  return (
    <Screen>
      <PageIntro
        eyebrow="You’re on the list"
        title={`Thanks, ${profile.name.split(' ')[0]}`}
        body="Your loyalty account is saved on this device. Joe can read it when you show him the app."
      />

      <Card>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{profile.email}</Text>
        <Text style={styles.label}>Vehicles</Text>
        {profile.vehicles.map((vehicle) => (
          <Text key={vehicle.id} style={styles.value}>
            {vehicleLabel(vehicle.year, vehicle.make, vehicle.model)}
          </Text>
        ))}
      </Card>

      <Banner tone="success">
        Confirmation is local only — no welcome email or text is sent in this version.
      </Banner>

      <PrimaryButton title="Book a visit" onPress={() => router.replace('/book')} />
      <SecondaryButton title="View account" onPress={() => router.replace('/loyalty')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
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
    fontWeight: '600',
  },
});
