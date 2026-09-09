import { StyleSheet, Text, View } from 'react-native';

import { Banner, Card, Chip, PageIntro, Screen, SecondaryButton } from '@/components/ui';
import { HOUR_OPTIONS, WEEKDAYS } from '@/constants/availability';
import { colors, spacing } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
import { formatTime } from '@/lib/format';
import type { Weekday, WeeklySlot } from '@/lib/types';

export default function AvailabilityScreen() {
  const { weeklySlots, setWeeklySlots, restoreDefaultHours } = useAppState();

  const toggle = (weekday: Weekday, start: string) => {
    const exists = weeklySlots.some((slot) => slot.weekday === weekday && slot.start === start);
    const next: WeeklySlot[] = exists
      ? weeklySlots.filter((slot) => !(slot.weekday === weekday && slot.start === start))
      : [...weeklySlots, { weekday, start }];
    void setWeeklySlots(next);
  };

  const clearDay = (weekday: Weekday) => {
    void setWeeklySlots(weeklySlots.filter((slot) => slot.weekday !== weekday));
  };

  const copyWeekdays = () => {
    const tuesday = weeklySlots.filter((slot) => slot.weekday === 2).map((slot) => slot.start);
    const starts = tuesday.length ? tuesday : ['09:00', '10:00', '13:00', '14:00'];
    const without = weeklySlots.filter((slot) => slot.weekday < 2 || slot.weekday > 5);
    const copied: WeeklySlot[] = [2, 3, 4, 5].flatMap((weekday) =>
      starts.map((start) => ({ weekday: weekday as Weekday, start })),
    );
    void setWeeklySlots([...without, ...copied]);
  };

  return (
    <Screen>
      <PageIntro
        eyebrow="Shop owner"
        title="Joe’s appointment windows"
        body="Tap times to offer or hide them. Customers request a slot up to about two months out. These are not store hours — Daily Drivin is by appointment, and windows can stay irregular."
      />

      <Banner tone="warn">
        Light admin for v1. Anyone with the app can change this board. A locked owner login can
        come later.
      </Banner>

      {WEEKDAYS.map((day) => {
        const selected = new Set(
          weeklySlots.filter((slot) => slot.weekday === day.value).map((slot) => slot.start),
        );
        return (
          <Card key={day.value}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayTitle}>{day.label}</Text>
              <Text style={styles.count}>
                {selected.size === 0
                  ? 'No windows'
                  : `${selected.size} window${selected.size === 1 ? '' : 's'}`}
              </Text>
            </View>
            <View style={styles.chipRow}>
              {HOUR_OPTIONS.map((hour) => (
                <Chip
                  key={hour}
                  label={formatTime(hour)}
                  selected={selected.has(hour)}
                  onPress={() => toggle(day.value, hour)}
                />
              ))}
            </View>
            {selected.size > 0 ? (
              <SecondaryButton title={`Clear ${day.label}`} onPress={() => clearDay(day.value)} />
            ) : null}
          </Card>
        );
      })}

      <SecondaryButton title="Copy Tuesday windows to Tue–Fri" onPress={copyWeekdays} />
      <SecondaryButton title="Restore starter windows" onPress={() => void restoreDefaultHours()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  dayHeader: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  dayTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  count: {
    color: colors.muted,
    fontWeight: '600',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
