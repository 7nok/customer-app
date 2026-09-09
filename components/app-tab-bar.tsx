import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WebDockPortal } from '@/components/web-dock-portal';
import { colors } from '@/constants/theme';

const LABELS: Record<string, string> = {
  index: 'Home',
  book: 'Book',
  maintenance: 'Guide',
  loyalty: 'List',
  about: 'Shop',
};

/**
 * Floating text capsule. On web the bar portals into `#app-dock-host` so
 * first paint sits on the visible viewport bottom (dock-correct-bottom.png).
 */
export function AppTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomInset = Platform.OS === 'web' ? 10 : Math.max(insets.bottom, 10);

  const bar = (
    <View nativeID="app-tab-bar" style={styles.wrap}>
      <View style={styles.pill}>
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
              style={[styles.item, focused && styles.itemOn]}>
              <Text style={[styles.label, focused && styles.labelOn]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={{ height: bottomInset }} />
    </View>
  );

  if (Platform.OS === 'web') {
    return <WebDockPortal>{bar}</WebDockPortal>;
  }

  return bar;
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.bg,
    flexGrow: 0,
    flexShrink: 0,
    paddingHorizontal: 14,
    paddingTop: 8,
    pointerEvents: 'auto',
    width: '100%',
  },
  pill: {
    backgroundColor: colors.cream,
    borderRadius: 999,
    flexDirection: 'row',
    padding: 4,
  },
  item: {
    alignItems: 'center',
    borderRadius: 999,
    flex: 1,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  itemOn: {
    backgroundColor: colors.amber,
  },
  label: {
    color: colors.tabInactive,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  labelOn: {
    color: colors.white,
  },
});
