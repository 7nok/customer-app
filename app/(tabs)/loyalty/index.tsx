import { useRouter } from 'expo-router';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton, Screen, SecondaryButton } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
import { vehicleLabel } from '@/lib/format';

export default function LoyaltyScreen() {
  const router = useRouter();
  const { profile, clearMember } = useAppState();

  if (!profile) {
    return (
      <Screen>
        <Text style={styles.kicker}>List</Text>
        <Text style={styles.title}>Join the shop list</Text>
        <Text style={styles.body}>
          Leave your name, email, and vehicles on this device. No points, no fake discounts — just a
          local account so the shop has your info.
        </Text>
        <Text style={styles.note}>This first version saves only on your device.</Text>
        <View style={{ marginTop: spacing.lg }}>
          <PrimaryButton title="Sign up" onPress={() => router.push('/loyalty/signup')} />
        </View>
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
      <Text style={styles.kicker}>List</Text>
      <Text style={styles.title}>Hi, {profile.name.split(' ')[0]}</Text>
      <Text style={styles.body}>You’re on Joe’s local loyalty list.</Text>
      <Text style={styles.item}>{profile.name}</Text>
      <Text style={styles.item}>{profile.email}</Text>
      <Text style={styles.note}>Joined {signedUp}</Text>
      {profile.vehicles.map((vehicle) => (
        <Text key={vehicle.id} style={styles.item}>
          {vehicleLabel(vehicle.year, vehicle.make, vehicle.model)}
        </Text>
      ))}
      <Text style={styles.note}>
        Saved on this device only. Clearing the app storage or tapping remove will delete the
        account here.
      </Text>
      <View style={{ gap: spacing.sm, marginTop: spacing.lg }}>
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
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    color: colors.muted,
    fontSize: 12,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '500',
    letterSpacing: -0.4,
    lineHeight: 36,
    marginTop: 8,
  },
  body: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 26,
    marginTop: spacing.md,
    marginBottom: spacing.md,
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
    marginTop: spacing.sm,
  },
});
