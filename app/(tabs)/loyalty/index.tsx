import { useRouter } from 'expo-router';
import { Alert, StyleSheet, Text, View } from 'react-native';

import {
  Banner,
  Card,
  PageIntro,
  PrimaryButton,
  Screen,
  SecondaryButton,
} from '@/components/ui';
import { colors } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
import { vehicleLabel } from '@/lib/format';

export default function LoyaltyScreen() {
  const router = useRouter();
  const { profile, clearMember } = useAppState();

  if (!profile) {
    return (
      <Screen>
        <PageIntro
          eyebrow="Shop list"
          title="Join Joe’s loyalty list"
          body="Leave your name, email, and vehicles on this device. No points, no fake discounts — just a local account so the shop has your info."
        />
        <Banner>
          This first version saves only on your device. There is no cloud login yet.
        </Banner>
        <PrimaryButton title="Sign up" onPress={() => router.push('/loyalty/signup')} />
      </Screen>
    );
  }

  const signedUp = new Date(profile.signedUpAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Screen>
      <PageIntro
        eyebrow="Shop list"
        title={`Hi, ${profile.name.split(' ')[0]}`}
        body="You’re on Joe’s local loyalty list. Update your vehicles anytime."
      />

      <Card>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{profile.name}</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{profile.email}</Text>
        <Text style={styles.label}>Joined</Text>
        <Text style={styles.value}>{signedUp}</Text>
      </Card>

      <Card>
        <Text style={styles.label}>Vehicles</Text>
        {profile.vehicles.map((vehicle) => (
          <View key={vehicle.id} style={styles.vehicle}>
            <Text style={styles.value}>
              {vehicleLabel(vehicle.year, vehicle.make, vehicle.model)}
            </Text>
          </View>
        ))}
      </Card>

      <Banner>
        Saved on this device only. Clearing the app storage or tapping remove will delete the
        account here.
      </Banner>

      <PrimaryButton title="Update account" onPress={() => router.push('/loyalty/signup')} />
      <SecondaryButton
        title="Remove from this device"
        onPress={() =>
          Alert.alert(
            'Remove this account?',
            'Your name, email, and vehicles will be deleted from this device.',
            [
              { text: 'Keep it', style: 'cancel' },
              {
                text: 'Remove',
                style: 'destructive',
                onPress: () => {
                  void clearMember();
                },
              },
            ],
          )
        }
      />
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
  vehicle: {
    paddingVertical: 2,
  },
});
