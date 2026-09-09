import { Platform } from 'react-native';

export const colors = {
  navy: '#121410',
  navyMid: '#2A2E26',
  charcoal: '#1A1E18',
  bg: '#121410',
  cream: '#E6FF4A',
  card: '#1C211A',
  cardWarm: '#242A20',
  text: '#E7E2D4',
  muted: '#8B9180',
  line: '#3A4034',
  amber: '#E6FF4A',
  amberDeep: '#C8DE3A',
  amberSoft: '#2A3210',
  success: '#7DFF9A',
  successSoft: '#1A2A1C',
  warn: '#E6B84A',
  warnSoft: '#2A2410',
  danger: '#FF6B4A',
  tabInactive: '#6B7164',
  white: '#E7E2D4',
};

export const spacing = {
  xs: 8,
  sm: 12,
  md: 18,
  lg: 26,
  xl: 36,
};

export const radius = {
  sm: 0,
  md: 0,
  lg: 0,
};

export const fonts = {
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    web: 'ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace',
    default: 'monospace',
  }),
};

export const type = {
  header: {
    fontFamily: fonts.mono,
    fontWeight: '600' as const,
    letterSpacing: 1,
  },
};
