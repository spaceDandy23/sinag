import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { colors } from '@/constants/theme';

export type SinagIconName = 'home' | 'calendar' | 'insights' | 'account' | 'chevron-right' | 'close';

/** One rounded line family for the branded navigation and Home controls. */
export function SinagIcon({ name, size = 24, color = colors.textSecondary, filled = false }: {
  name: SinagIconName;
  size?: number;
  color?: string;
  filled?: boolean;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.65} strokeLinecap="round" strokeLinejoin="round" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {name === 'home' && <Path d="M3 10.5L12 3l9 7.5M5.5 9v12h4.3v-7h4.4v7h4.3V9" fill={filled ? color : 'none'} />}
      {name === 'calendar' && <>
        <Rect x="4" y="5" width="16" height="16" rx="2" />
        <Path d="M8 3v4m8-4v4M4 10h16m-11 4h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01m3-1 1 1 2-2" />
      </>}
      {name === 'insights' && <>
        <Path d="M12 21C9 17 3.5 20 3.5 15V5.5c3-1 5.5 0 6.5 1.5v10M12 21c3-4 8.5-1 8.5-6V5.5c-3-1-5.5 0-6.5 1.5v10" />
        <Path d="M11 4.5c0-2 3-2 3 0 0 1.5-1.5 2-1.5 2S11 6 11 4.5z" />
      </>}
      {name === 'account' && <><Circle cx="12" cy="7" r="3.5" /><Path d="M4.5 21v-2.5c0-6 15-6 15 0V21h-15z" /></>}
      {name === 'chevron-right' && <Path d="m9 6 6 6-6 6" />}
      {name === 'close' && <Path d="m6 6 12 12M18 6 6 18" />}
    </Svg>
  );
}
