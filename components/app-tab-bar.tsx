import { BottomTabBar, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/theme';

/** Icon + label row; extra bottom inset is applied on the wrapper. */
export const TAB_BAR_CONTENT_HEIGHT = 58;

/**
 * Bottom tabs that sit above the home indicator and (on web) above overlapping
 * in-app browser chrome. Inner bar keeps a fixed content height so labels are
 * not squashed; padding for insets lives on the wrapper (`#app-tab-bar`).
 */
export function AppTabBar(props: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomInset = Platform.OS === 'web' ? 0 : insets.bottom;

  return (
    <View
      nativeID="app-tab-bar"
      style={{
        backgroundColor: colors.navy,
        paddingBottom: bottomInset,
      }}>
      <BottomTabBar {...props} insets={{ ...props.insets, bottom: 0 }} />
    </View>
  );
}
