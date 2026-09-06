import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/theme';

const LABELS: Record<string, string> = {
  index: 'Home',
  book: 'Visit',
  maintenance: 'Guide',
  loyalty: 'List',
  about: 'Shop',
};

/**
 * Swiss top text nav. Web top inset is 0 — the shell is already pinned to the
 * visible viewport.
 */
export function AppTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === 'web' ? 0 : insets.top;

  return (
    <View nativeID="app-tab-bar" style={[styles.wrap, { paddingTop: topInset + 10 }]}>
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
              <View style={[styles.rule, focused && styles.ruleOn]} />
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
    paddingBottom: 0,
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    alignItems: 'center',
    flex: 1,
    minHeight: 40,
    paddingVertical: 8,
  },
  label: {
    color: colors.tabInactive,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.8,
  },
  labelOn: {
    color: colors.text,
  },
  rule: {
    backgroundColor: 'transparent',
    height: 1,
    marginTop: 8,
    width: '100%',
  },
  ruleOn: {
    backgroundColor: colors.text,
  },
});
