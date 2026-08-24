import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Banner, Card, PageIntro, Screen } from '@/components/ui';
import { GUIDE_DISCLAIMER } from '@/constants/maintenance';
import { colors, radius } from '@/constants/theme';
import { useWideLayout } from '@/hooks/use-wide-layout';

export default function MaintenanceHomeScreen() {
  const router = useRouter();
  const wide = useWideLayout(400);

  return (
    <Screen>
      <PageIntro
        eyebrow="Maintenance guide"
        title="What should I check next?"
        body="Start with the kind of vehicle, then pick a system. Intervals are general — Joe still wants to look at the one in your driveway."
      />

      <View style={[styles.row, !wide && styles.rowStack]}>
        <Card
          style={styles.choice}
          onPress={() =>
            router.push({ pathname: '/maintenance/categories', params: { vehicleType: 'car' } })
          }>
          <View style={styles.iconWrap}>
            <Icon name="car-sport" color={colors.amber} size={28} />
          </View>
          <Text style={styles.choiceTitle}>Car</Text>
          <Text style={styles.choiceBody}>Sedans, coupes, crossovers, and family vehicles.</Text>
        </Card>
        <Card
          style={styles.choice}
          onPress={() =>
            router.push({ pathname: '/maintenance/categories', params: { vehicleType: 'truck' } })
          }>
          <View style={styles.iconWrap}>
            <Icon name="bus" color={colors.amber} size={28} />
          </View>
          <Text style={styles.choiceTitle}>Truck</Text>
          <Text style={styles.choiceBody}>Pickups, 4x4s, and light-duty work trucks.</Text>
        </Card>
      </View>

      <Banner>{GUIDE_DISCLAIMER}</Banner>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  rowStack: {
    flexDirection: 'column',
  },
  choice: {
    flex: 1,
    minHeight: 148,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: colors.navy,
    borderRadius: radius.sm,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  choiceTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  choiceBody: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
});
