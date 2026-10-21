import { useId } from 'react';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { colors } from '@/constants/theme';

export function BrandStar({ size = 28, accents = false }: { size?: number; accents?: boolean }) {
  const id = `star-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="0.75" y2="1">
          <Stop offset="0" stopColor={colors.brandOrange} />
          <Stop offset="1" stopColor={colors.brandPink} />
        </LinearGradient>
      </Defs>
      <Path d="M14.4 3.8q1.6-3.3 3.2 0l3.1 6.3 7 .9q3.5.5 1 3l-5.1 5 .9 7q.6 3.6-2.6 1.9L16 24.6l-5.9 3.3q-3.2 1.7-2.6-1.9l.9-7-5.1-5q-2.5-2.5 1-3l7-.9 3.1-6.3z" fill={`url(#${id})`} />
      {accents && <Path d="m3 2 .7 1.8L5.5 4l-1.8.8L3 6.5l-.7-1.7L.5 4l1.8-.2L3 2zm26 3 .6 1.4 1.4.6-1.4.6L29 9l-.6-1.4L27 7l1.4-.6L29 5zM29 25l.5 1.4 1.5.6-1.5.5L29 29l-.5-1.5L27 27l1.5-.6L29 25z" fill={colors.brandOrange} />}
    </Svg>
  );
}
