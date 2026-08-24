import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';

import { Banner, Card, PageIntro, PrimaryButton, Screen, SecondaryButton } from '@/components/ui';
import {
  categoryById,
  GUIDE_DISCLAIMER,
  isVehicleType,
  itemById,
} from '@/constants/maintenance';
import { colors } from '@/constants/theme';

export default function MaintenanceDetailScreen() {
  const router = useRouter();
  const { itemId, vehicleType } = useLocalSearchParams<{ itemId?: string; vehicleType?: string }>();
  const item = itemId ? itemById(itemId) : undefined;
  const category = item ? categoryById(item.categoryId) : undefined;
  const validType = vehicleType && isVehicleType(vehicleType);

  useEffect(() => {
    if (!item) {
      router.replace('/maintenance');
    }
  }, [item, router]);

  if (!item || !category) {
    return null;
  }

  return (
    <Screen>
      <PageIntro
        eyebrow={category.name}
        title={item.name}
        body={validType ? `${vehicleType === 'car' ? 'Car' : 'Truck'} recommendation` : undefined}
      />

      <Card>
        <Text style={styles.label}>Typical interval</Text>
        <Text style={styles.interval}>{item.interval}</Text>
      </Card>

      <Card>
        <Text style={styles.label}>What it is</Text>
        <Text style={styles.body}>{item.whatItIs}</Text>
        <Text style={styles.label}>What to watch for</Text>
        <Text style={styles.body}>{item.watchFor}</Text>
      </Card>

      <Banner tone="warn">{GUIDE_DISCLAIMER}</Banner>

      <PrimaryButton title="Book a visit about this" onPress={() => router.push('/book')} />
      <SecondaryButton title="Back to categories" onPress={() => router.replace('/maintenance')} />
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
  interval: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  body: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 23,
  },
});
