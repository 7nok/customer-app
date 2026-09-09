import { BottomTabBar, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WebDockPortal } from '@/components/web-dock-portal';
import { colors } from '@/constants/theme';

/** Icon-only dock. Keep compact — do not stretch to leftover viewport. */
export const TAB_BAR_CONTENT_HEIGHT = 52;

/**
 * Minimal bottom chrome. On web the bar is portaled into `#app-dock-host`
 * so it paints at the visible viewport bottom on first mount (see
 * dock-correct-bottom.png). Native keeps the in-flow tab bar.
 */
export function AppTabBar(props: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomInset = Platform.OS === 'web' ? 0 : insets.bottom;

  const bar = (
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
        pointerEvents: 'auto',
        width: '100%',
      }}>
      <BottomTabBar {...props} insets={{ ...props.insets, bottom: 0 }} />
    </View>
  );

  if (Platform.OS === 'web') {
    return <WebDockPortal>{bar}</WebDockPortal>;
  }

  return bar;
}
