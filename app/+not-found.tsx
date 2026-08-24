import { Stack, useRouter } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { PageIntro, PrimaryButton, Screen } from '@/components/ui';
import { colors } from '@/constants/theme';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <Screen>
        <PageIntro
          eyebrow="Joe’s"
          title="That page is not on the lot"
          body="The link may be old, or the address was typed a little off. Head back to the shop home and try again."
        />
        <PrimaryButton title="Back to home" onPress={() => router.replace('/')} />
        <Text style={styles.hint}>Joe’s · Hillsboro, Texas</Text>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  hint: {
    color: colors.muted,
    textAlign: 'center',
  },
});
