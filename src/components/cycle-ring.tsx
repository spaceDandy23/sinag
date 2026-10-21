import { useId } from 'react';
import { useWindowDimensions, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { SinagText } from '@/components/sinag-text';
import { colors, spacing } from '@/constants/theme';

export type TrackerState = 'loading' | 'error' | 'empty' | 'active' | 'tracked';

export function CycleRing({ cycleDay, size, state, startLabel }: {
  cycleDay: number | null;
  size: number;
  state: TrackerState;
  startLabel: string | null;
}) {
  const id = `cycle-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const { fontScale } = useWindowDimensions();
  const expandedText = fontScale > 1.5;
  const hasRecord = state === 'active' || state === 'tracked';
  const title = state === 'loading' ? 'Getting your\ncycle ready'
    : state === 'error' ? 'Your records\nare unavailable'
    : state === 'empty' ? 'Start tracking\nyour cycle'
    : state === 'active' ? 'Period in\nprogress' : 'Your cycle,\nat a glance';

  const content = (
    <View style={{ width: expandedText ? '100%' : '76%', alignItems: 'center', gap: spacing.md }}>
      <SinagText variant="trackerLabel" selectable style={{ color: colors.brandText, textAlign: 'center' }}>
        {hasRecord && cycleDay !== null ? `Cycle day ${cycleDay}` : 'Your cycle'}
      </SinagText>
      <SinagText variant="trackerTitle" style={{ textAlign: 'center' }}>{title}</SinagText>
      <View style={{ alignItems: 'center', gap: spacing.xs }}>
        <SinagText variant="helper" style={{ color: colors.brandText, textAlign: 'center' }}>
          {hasRecord ? 'Latest period started' : state === 'loading' ? 'Loading your saved records'
            : state === 'error' ? 'Try loading them again below' : 'Log your period to begin'}
        </SinagText>
        {hasRecord && startLabel && (
          <SinagText variant="trackerDetail" selectable style={{ color: colors.brandText, textAlign: 'center' }}>{startLabel}</SinagText>
        )}
      </View>
    </View>
  );

  return (
    <View style={{ alignItems: 'center', gap: spacing.lg, width: '100%' }}>
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        {/* Decorative brand ring: the arc never encodes a predicted cycle length or phase. */}
        <Svg width={size} height={size} viewBox="0 0 314 314" style={{ position: 'absolute' }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <Defs>
            <LinearGradient id={`${id}-soft`} x1="0" y1="0" x2="0.85" y2="1">
              <Stop offset="0" stopColor={colors.ringPale} />
              <Stop offset="0.48" stopColor={colors.ringPink} />
              <Stop offset="1" stopColor={colors.ringPeach} />
            </LinearGradient>
            <LinearGradient id={`${id}-bright`} x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={colors.brandCoral} />
              <Stop offset="1" stopColor={colors.brandOrange} />
            </LinearGradient>
          </Defs>
          <Circle cx="157" cy="157" r="147" fill="none" stroke={`url(#${id}-soft)`} strokeWidth="18" />
          <Path d="M157 10a147 147 0 0 1 147 147" fill="none" stroke={`url(#${id}-bright)`} strokeWidth="18" strokeLinecap="round" />
        </Svg>
        {!expandedText && content}
      </View>
      {expandedText && content}
    </View>
  );
}
