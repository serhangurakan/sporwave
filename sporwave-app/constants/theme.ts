export const T = {
  // Semantic — dark theme
  accent: '#86EE60',
  onAccent: '#0F1A0A',
  secondaryButton: '#242426',
  onSecondary: '#F5F5F5',
  bg: '#0F0F0F',
  bgAlt: '#161616',
  card: '#1C1C1E',
  cardElevated: '#242426',
  cardBorder: '#2C2C2E',
  progressTrack: '#2C2C2E',
  text: '#F5F5F5',
  textDim: '#ABABAB',
  textMuted: '#6B6B6B',
  icon: '#F5F5F5',
  overlayHeader: 'rgba(15,15,15,.92)',

  // Shared / semantic colors
  white: '#FFFFFF',
  black: '#0F0F0F',
  red: '#FF453A',
  green: '#30D158',
  orange: '#FF9F0A',
  gold: '#FFD60A',
  purple: '#BF5AF2',
  success: '#30D158',
  guestBg: '#6B7280',
  googleBlue: '#4285F4',
  googleGreen: '#34A853',
  googleYellow: '#FBBC05',
  googleRed: '#EA4335',
  overlayScrim: 'rgba(0,0,0,.5)',
  overlayScrimStrong: 'rgba(0,0,0,.65)',
  overlayDark: 'rgba(0,0,0,.75)',
} as const;

export type ThemeTokens = typeof T;
