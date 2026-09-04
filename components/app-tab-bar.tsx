import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { shop } from '@/constants/shop';
import { colors, fonts } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
import { summarizeHours } from '@/lib/format';

const LABELS: Record<string, string> = {
  index: 'Atelier',
  book: 'Visit',
  maintenance: 'Guide',
  loyalty: 'Register',
  about: 'The shop',
};

/**
 * Sticky atelier masthead + text rail. Web top inset is 0 — the shell is
 * already pinned to the visible viewport.
 */
export function AppTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === 'web' ? 0 : insets.top;
  const { weeklySlots } = useAppState();
  const hours = summarizeHours(weeklySlots);
  const today = hours[new Date().getDay()] ?? hours[0];

  return (
    <View nativeID="app-tab-bar" style={[styles.wrap, { paddingTop: topInset + 10 }]}>
      <View style={styles.masthead}>
        <Text style={styles.wordmark}>{shop.name}</Text>
        <Text style={styles.today}>
          {today.day} · {today.hours}
        </Text>
      </View>
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const label = LABELS[route.name] ?? descriptors[route.key].options.title ?? route.name;
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };
          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              onPress={onPress}
              style={styles.item}>
              <Text style={[styles.label, focused && styles.labelOn]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.navy,
    flexGrow: 0,
    flexShrink: 0,
    paddingHorizontal: 14,
    paddingBottom: 8,
  },
  masthead: {
    alignItems: 'baseline',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 10,
  },
  wordmark: {
    color: colors.cream,
    fontFamily: fonts.display,
    fontSize: 22,
    fontWeight: '600',
  },
  today: {
    color: colors.amber,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  item: {
    minHeight: 32,
    justifyContent: 'center',
    paddingVertical: 4,
  },
  label: {
    color: colors.tabInactive,
    fontSize: 13,
    fontWeight: '500',
  },
  labelOn: {
    color: colors.cream,
    borderBottomColor: colors.amber,
    borderBottomWidth: 1,
  },
});
