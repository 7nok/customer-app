import { Platform } from 'react-native';

export const colors = {
  navy: '#F3EEE4',
  navyMid: '#E4DCCE',
  charcoal: '#FFFFFF',
  bg: '#F3EEE4',
  cream: '#14110E',
  card: '#FFFBF5',
  cardWarm: '#EAE3D6',
  text: '#14110E',
  muted: '#6F675C',
  line: '#D9D0C2',
  amber: '#E23B14',
  amberDeep: '#B82E0F',
  amberSoft: '#F8D8CF',
  success: '#2F5D42',
  successSoft: '#DCE8E0',
  warn: '#8A5A12',
  warnSoft: '#F4E6C8',
  danger: '#9B2C2C',
  tabInactive: '#9A9186',
  white: '#FFFBF5',
};

export const spacing = {
  xs: 8,
  sm: 14,
  md: 22,
  lg: 32,
  xl: 48,
};

export const radius = {
  sm: 18,
  md: 22,
  lg: 28,
};

export const fonts = {
  display: Platform.select({
    ios: 'HelveticaNeue-CondensedBold',
    android: 'sans-serif-condensed',
    web: '"Arial Narrow", "Franklin Gothic Medium", "Helvetica Neue", sans-serif',
    default: 'sans-serif-condensed',
  }),
};

export const type = {
  header: {
    fontFamily: fonts.display,
    fontWeight: '700' as const,
    letterSpacing: -0.4,
  },
};
