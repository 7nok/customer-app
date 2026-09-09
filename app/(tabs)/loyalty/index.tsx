import { useRouter } from 'expo-router';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton, Screen, SecondaryButton } from '@/components/ui';
import { shop } from '@/constants/shop';
import { colors, fonts, spacing } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
import { vehicleLabel } from '@/lib/format';

export default function LoyaltyScreen() {
  const router = useRouter();
  const { profile, clearMember } = useAppState();

  if (!profile) {
    return (
      <Screen>
        <Text style={styles.job}>REWARDS</Text>
        <Text style={styles.title}>JOIN THE LIST</Text>
        <Text style={styles.body}>{shop.rewardsNote}</Text>
        <Text style={styles.muted}>NAME, VEHICLES, EMAIL — THIS DEVICE ONLY</Text>
        <PrimaryButton title="SIGN UP" onPress={() => router.push('/loyalty/signup')} />
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
      <Text style={styles.job}>REWARDS</Text>
      <Text style={styles.title}>{profile.name.split(' ')[0].toUpperCase()}</Text>
      <Text style={styles.body}>On the Daily Drivin list. Update vehicles anytime.</Text>
      <Text style={styles.muted}>{shop.rewardsNote}</Text>

      <View style={styles.file}>
        <Text style={styles.meta}>{profile.name.toUpperCase()}</Text>
        <Text style={styles.meta}>{profile.email}</Text>
        <Text style={styles.muted}>JOINED {signedUp.toUpperCase()}</Text>
        {profile.vehicles.map((vehicle) => (
          <Text key={vehicle.id} style={styles.car}>
            {vehicleLabel(vehicle.year, vehicle.make, vehicle.model).toUpperCase()}
          </Text>
        ))}
      </View>

      <Text style={styles.muted}>
        SAVED ON THIS DEVICE ONLY. REMOVE DELETES THE ACCOUNT HERE.
      </Text>

      <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
        <PrimaryButton title="UPDATE ACCOUNT" onPress={() => router.push('/loyalty/signup')} />
        <SecondaryButton
          title="REMOVE FROM THIS DEVICE"
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
  job: {
    color: colors.amber,
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1.8,
  },
  title: {
    color: colors.text,
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 6,
  },
  body: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
    marginTop: spacing.sm,
  },
  muted: {
    color: colors.muted,
    fontFamily: fonts.mono,
    fontSize: 11,
    lineHeight: 16,
    marginTop: spacing.sm,
  },
  file: {
    borderColor: colors.line,
    borderWidth: 1,
    gap: 6,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  meta: {
    color: colors.text,
    fontFamily: fonts.mono,
    fontSize: 13,
  },
  car: {
    color: colors.amber,
    fontFamily: fonts.mono,
    fontSize: 13,
    marginTop: 8,
  },
});
