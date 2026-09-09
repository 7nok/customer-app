import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts } from '@/constants/theme';

const LABELS: Record<string, string> = {
  index: 'HOME',
  book: 'BOOK',
  maintenance: 'GUIDE',
  loyalty: 'LIST',
  about: 'SHOP',
};

/**
 * Terminal strip — tabs only, no magazine masthead. Web top inset is 0 —
 * the shell is already pinned to the visible viewport.
 */
export function AppTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === 'web' ? 0 : insets.top;

  return (
    <View nativeID="app-tab-bar" style={[styles.wrap, { paddingTop: topInset + 8 }]}>
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
              style={[styles.item, focused && styles.itemOn]}>
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
    backgroundColor: colors.bg,
    borderBottomColor: colors.line,
    borderBottomWidth: 1,
    flexGrow: 0,
    flexShrink: 0,
    paddingBottom: 8,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  item: {
    justifyContent: 'center',
    minHeight: 32,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  itemOn: {
    backgroundColor: colors.amber,
  },
  label: {
    color: colors.tabInactive,
    fontFamily: fonts.mono,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  labelOn: {
    color: colors.bg,
  },
});
