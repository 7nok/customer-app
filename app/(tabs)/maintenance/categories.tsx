import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';

import { Banner, Card, ListRow, PageIntro, Screen } from '@/components/ui';
import { categoriesFor, GUIDE_DISCLAIMER, isVehicleType } from '@/constants/maintenance';

export default function MaintenanceCategoriesScreen() {
  const router = useRouter();
  const { vehicleType } = useLocalSearchParams<{ vehicleType?: string }>();
  const valid = vehicleType && isVehicleType(vehicleType);

  useEffect(() => {
    if (!valid) {
      router.replace('/maintenance');
    }
  }, [router, valid]);

  if (!valid) {
    return null;
  }

  const categories = categoriesFor(vehicleType);
  const label = vehicleType === 'car' ? 'Car' : 'Truck';

  return (
    <Screen>
      <PageIntro
        eyebrow={`${label} maintenance`}
        title="Pick a category"
        body="Fluids, brakes, engine, and the other systems Joe sees most often."
      />
      <Card>
        {categories.map((category) => (
          <ListRow
            key={category.id}
            title={category.name}
            subtitle={category.summary}
            icon={category.icon}
            onPress={() =>
              router.push({
                pathname: '/maintenance/items',
                params: { vehicleType, categoryId: category.id },
              })
            }
          />
        ))}
      </Card>
      <Banner>{GUIDE_DISCLAIMER}</Banner>
    </Screen>
  );
}
