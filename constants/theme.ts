import { Platform } from 'react-native';

export const colors = {
  navy: '#2A2218',
  navyMid: '#3D3428',
  charcoal: '#231C14',
  bg: '#F3EBDD',
  cream: '#F7F1E6',
  card: '#FBF6EC',
  cardWarm: '#E8DFD0',
  text: '#241C14',
  muted: '#6B5E4E',
  line: '#D4C8B4',
  amber: '#8C6A2F',
  amberDeep: '#6F5424',
  amberSoft: '#E8D9B0',
  success: '#3E5C45',
  successSoft: '#DCE6DC',
  warn: '#8A4B12',
  warnSoft: '#F0E0C8',
  danger: '#7A3329',
  tabInactive: '#A89880',
  white: '#FFFBF4',
};

export const spacing = {
  xs: 8,
  sm: 12,
  md: 18,
  lg: 26,
  xl: 36,
};

export const radius = {
  sm: 4,
  md: 6,
  lg: 8,
};

export const fonts = {
  display: Platform.select({
    ios: 'Georgia',
    android: 'serif',
    web: 'Georgia, "Times New Roman", Times, serif',
    default: 'Georgia',
  }),
};

export const type = {
  header: {
    fontFamily: fonts.display,
    fontWeight: '600' as const,
    letterSpacing: 0.2,
  },
};
