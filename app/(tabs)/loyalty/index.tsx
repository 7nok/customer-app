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
        <Text style={styles.title}>Join.</Text>
        <Text style={styles.body}>
          Name, email, and vehicles on this device. No points, no fake discounts — just a local
          account so the shop has your info.
        </Text>
        <Text style={styles.note}>This first version saves only on your device.</Text>
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
      <Text style={styles.kicker}>List</Text>
      <Text style={styles.title}>{profile.name.split(' ')[0]}.</Text>
      <Text style={styles.body}>On Joe’s local list. Update vehicles anytime.</Text>

      <View style={styles.rule} />
      <Text style={styles.meta}>{profile.name}</Text>
      <Text style={styles.meta}>{profile.email}</Text>
      <Text style={styles.note}>Joined {signedUp}</Text>

      <View style={styles.rule} />
      {profile.vehicles.map((vehicle) => (
        <Text key={vehicle.id} style={styles.meta}>
          {vehicleLabel(vehicle.year, vehicle.make, vehicle.model)}
        </Text>
      ))}

      <Text style={styles.note}>
        Saved on this device only. Clearing app storage or tapping remove deletes the account here.
      </Text>

      <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
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
  body: {
    color: colors.muted,
    fontSize: 17,
    lineHeight: 26,
    marginBottom: spacing.sm,
  },
  note: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  rule: {
    backgroundColor: colors.line,
    height: 1,
    marginVertical: spacing.md,
  },
  meta: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
});
