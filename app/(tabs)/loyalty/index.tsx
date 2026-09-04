import { useRouter } from 'expo-router';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton, Screen, SecondaryButton } from '@/components/ui';
import { colors, fonts, spacing } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
import { vehicleLabel } from '@/lib/format';

export default function LoyaltyScreen() {
  const router = useRouter();
  const { profile, clearMember } = useAppState();

  if (!profile) {
    return (
      <Screen>
        <Text style={styles.folio}>Register</Text>
        <Text style={styles.title}>The shop list</Text>
        <Text style={styles.story}>
          Leave your name, email, and vehicles on this device. No points, no fake discounts — a
          local register so the bench has your info.
        </Text>
        <Text style={styles.note}>This first version saves only on your device.</Text>
        <View style={{ marginTop: spacing.lg }}>
          <PrimaryButton title="Sign the register" onPress={() => router.push('/loyalty/signup')} />
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
      <Text style={styles.folio}>Register</Text>
      <Text style={styles.title}>{profile.name.split(' ')[0]}</Text>
      <Text style={styles.story}>On Joe’s local list. Update the vehicles anytime.</Text>
      <Text style={styles.item}>{profile.name}</Text>
      <Text style={styles.item}>{profile.email}</Text>
      <Text style={styles.note}>Entered {signedUp}</Text>
      {profile.vehicles.map((vehicle) => (
        <Text key={vehicle.id} style={styles.item}>
          {vehicleLabel(vehicle.year, vehicle.make, vehicle.model)}
        </Text>
      ))}
      <Text style={styles.note}>
        Saved on this device only. Clearing storage or tapping remove deletes the account here.
      </Text>
      <View style={{ gap: spacing.sm, marginTop: spacing.lg }}>
        <PrimaryButton title="Update the register" onPress={() => router.push('/loyalty/signup')} />
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
    fontSize: 36,
    fontWeight: '600',
    marginTop: 6,
  },
  story: {
    color: colors.text,
    fontSize: 17,
    lineHeight: 28,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  item: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 18,
    lineHeight: 26,
  },
  note: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
});
