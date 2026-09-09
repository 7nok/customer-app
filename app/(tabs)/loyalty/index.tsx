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
        <Text style={styles.kicker}>Rewards</Text>
        <Text style={styles.title}>JOIN{'\n'}THE LIST</Text>
        <Text style={styles.body}>{shop.rewardsNote}</Text>
        <Text style={styles.note}>Name, vehicles, and your email — saved on this device only.</Text>
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
      <Text style={styles.kicker}>Rewards</Text>
      <Text style={styles.title}>{profile.name.split(' ')[0].toUpperCase()}</Text>
      <Text style={styles.body}>On the Daily Drivin list. Update vehicles anytime.</Text>
      <Text style={styles.note}>{shop.rewardsNote}</Text>

      <View style={styles.card}>
        <Text style={styles.meta}>{profile.name}</Text>
        <Text style={styles.meta}>{profile.email}</Text>
        <Text style={styles.note}>Joined {signedUp}</Text>
        {profile.vehicles.map((vehicle) => (
          <Text key={vehicle.id} style={styles.car}>
            {vehicleLabel(vehicle.year, vehicle.make, vehicle.model)}
          </Text>
        ))}
      </View>

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
    color: colors.amber,
    fontFamily: fonts.display,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 56,
    fontWeight: '700',
    letterSpacing: -1.6,
    lineHeight: 54,
  },
  body: {
    color: colors.text,
    fontSize: 17,
    lineHeight: 26,
  },
  note: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  card: {
    backgroundColor: colors.card,
    gap: 6,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  meta: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
  car: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 8,
  },
});
