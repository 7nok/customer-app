import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';

import { Banner, Card, ListRow, PageIntro, Screen } from '@/components/ui';
import {
  categoryById,
  GUIDE_DISCLAIMER,
  isVehicleType,
  itemsFor,
} from '@/constants/maintenance';

export default function MaintenanceItemsScreen() {
  const router = useRouter();
  const { vehicleType, categoryId } = useLocalSearchParams<{
    vehicleType?: string;
    categoryId?: string;
  }>();
  const valid = vehicleType && isVehicleType(vehicleType) && Boolean(categoryId);
  const category = categoryId ? categoryById(categoryId) : undefined;

  useEffect(() => {
    if (!valid || !category) {
      router.replace('/maintenance');
    }
  }, [category, router, valid]);

  if (!valid || !category) {
    return null;
  }

  const items = itemsFor(vehicleType, category.id);
  const label = vehicleType === 'car' ? 'Car' : 'Truck';

  return (
    <Screen>
      <PageIntro
        eyebrow={`${label} · ${category.name}`}
        title={category.name}
        body="Choose an item to see a typical interval and what to watch for."
      />
      <Card>
        {items.map((item) => (
          <ListRow
            key={item.id}
            title={item.name}
            subtitle={item.interval}
            onPress={() =>
              router.push({
                pathname: '/maintenance/detail',
                params: { itemId: item.id, vehicleType },
              })
            }
          />
        ))}
      </Card>
      <Banner>{GUIDE_DISCLAIMER}</Banner>
    </Screen>
  );
}
