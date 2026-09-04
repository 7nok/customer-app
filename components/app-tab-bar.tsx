import { BottomTabBar, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/theme';

/** Icon-only dock. Keep compact — do not stretch to leftover viewport. */
export const TAB_BAR_CONTENT_HEIGHT = 52;

/**
 * Minimal bottom chrome. Web padding is 0 — the shell is already pinned to the
 * visible viewport; extra safe-area padding was painting a slab under the dock.
 */
export function AppTabBar(props: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomInset = Platform.OS === 'web' ? 0 : insets.bottom;

  return (
    <View
      nativeID="app-tab-bar"
      style={{
        backgroundColor: colors.bg,
        borderTopColor: colors.line,
        borderTopWidth: 1,
        flexGrow: 0,
        flexShrink: 0,
        overflow: 'visible',
        paddingBottom: bottomInset,
      }}>
      <BottomTabBar {...props} insets={{ ...props.insets, bottom: 0 }} />
    </View>
  );
}
