import { Platform } from 'react-native';

export const colors = {
  brandPink: '#F74F7A', brandCoral: '#FF6A6B', brandOrange: '#FF9862',
  background: '#FFF8F5', surface: '#FFFFFF', surfaceBlush: '#FFF0ED', border: '#F2DDD9',
  textPrimary: '#442730', textSecondary: '#70545B', textMuted: '#816B70',
  success: '#28734D', error: '#B42F48', focus: '#6A428D', onBrand: '#FFFFFF',
  brandText: '#9B263D',
  ringPink: '#FFB8C8', ringPeach: '#FFC398', ringPale: '#FFDDD6',
  iconPink: '#FF6686', iconCoral: '#FF785F',
  tabBackground: '#FFFAF7',
} as const;

export const gradients = {
  brand: [colors.brandPink, colors.brandOrange],
  soft: ['#FFF5F3', '#FFE2D3'],
  home: ['#FFF9F6', '#FFF2EB'],
  card: ['#FFFCFA', '#FFF5F0'],
  period: ['#FF849A', '#F74F7A'],
  mood: ['#FF8B99', '#F74F7A'],
} as const;
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radii = { sm: 10, md: 16, lg: 22, xl: 28, pill: 999 } as const;
export const typography = {
  hero: { fontSize: 34, lineHeight: 40, fontWeight: '700' as const },
  screenTitle: { fontSize: 24, lineHeight: 30, fontWeight: '700' as const },
  cardTitle: { fontSize: 17, lineHeight: 22, fontWeight: '700' as const },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' as const },
  label: { fontSize: 14, lineHeight: 18, fontWeight: '600' as const },
  helper: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
  greeting: { fontSize: 16, lineHeight: 23, fontWeight: '400' as const },
  trackerTitle: { fontSize: 26, lineHeight: 34, fontWeight: '600' as const },
  trackerLabel: { fontSize: 14, lineHeight: 21, fontWeight: '400' as const },
  trackerDetail: { fontSize: 18, lineHeight: 25, fontWeight: '500' as const },
  actionLabel: { fontSize: 13, lineHeight: 18, fontWeight: '500' as const },
  insightTitle: { fontSize: 15, lineHeight: 21, fontWeight: '600' as const },
  insightBody: { fontSize: 13, lineHeight: 19, fontWeight: '400' as const },
  tabLabel: { fontSize: 11, lineHeight: 16, fontWeight: '400' as const },
} as const;
export const motion = { fast: 140, base: 240 } as const;
export const shadows = { card: '0 3px 12px rgba(107, 52, 62, 0.07)' } as const;
export const maxContentWidth = 560;
export const homeLayout = {
  maxWidth: 420,
  gutter: 22,
  ringSize: 314,
  ringWidthRatio: 0.77,
  actionHeight: 106,
  actionIconSize: 44,
  tabHeight: 64,
} as const;

// Compatibility exports for untouched starter utilities.
export const Colors = {
  light: { text: colors.textPrimary, background: colors.background, backgroundElement: colors.surfaceBlush, backgroundSelected: colors.border, textSecondary: colors.textSecondary },
  dark: { text: colors.textPrimary, background: colors.background, backgroundElement: colors.surfaceBlush, backgroundSelected: colors.border, textSecondary: colors.textSecondary },
} as const;
export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;
export const Fonts = Platform.select({
  ios: { sans: 'system-ui', serif: 'ui-serif', rounded: 'ui-rounded', mono: 'ui-monospace' },
  default: { sans: 'normal', serif: 'serif', rounded: 'normal', mono: 'monospace' },
  web: { sans: 'var(--font-display)', serif: 'var(--font-serif)', rounded: 'var(--font-rounded)', mono: 'var(--font-mono)' },
});
export const Spacing = { half: 2, one: 4, two: 8, three: 16, four: 24, five: 32, six: 64 } as const;
export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
