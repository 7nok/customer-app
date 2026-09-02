import { BottomTabBar, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/theme';

/** Icon + label row. Keep this compact — do not stretch to leftover viewport. */
export const TAB_BAR_CONTENT_HEIGHT = 56;

/**
 * Bottom tabs with intrinsic height. Safe-area padding is capped so a bogus
 * web inset cannot turn the bar into a tall navy block.
 */
export function AppTabBar(props: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomInset = Platform.OS === 'web' ? 0 : insets.bottom;

  return (
    <View
      nativeID="app-tab-bar"
      style={{
        backgroundColor: colors.navy,
        flexGrow: 0,
        flexShrink: 0,
        overflow: 'visible',
        paddingBottom: bottomInset,
      }}>
      <BottomTabBar {...props} insets={{ ...props.insets, bottom: 0 }} />
    </View>
  );
}
