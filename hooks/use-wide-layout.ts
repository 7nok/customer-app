import { useWindowDimensions } from 'react-native';

/** True when the window is wide enough for two-up cards (phones in landscape, tablets, desktop). */
export function useWideLayout(minWidth = 420): boolean {
  const { width } = useWindowDimensions();
  return width >= minWidth;
}
