import { useId } from 'react';
import { ActivityIndicator, Pressable, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { cubicBezier, useReducedMotion } from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { GradientSurface } from '@/components/gradient-surface';
import { SinagText } from '@/components/sinag-text';
import { colors, gradients, homeLayout, motion, radii, spacing } from '@/constants/theme';

type IconName = 'period' | 'symptom' | 'mood';

function ActionIcon({ name }: { name: IconName }) {
  const id = `action-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const palette = name === 'mood' ? gradients.mood : gradients.period;
  return (
    <Svg width={homeLayout.actionIconSize} height={homeLayout.actionIconSize} viewBox="0 0 44 44" fill="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="0.8" y2="1">
          <Stop offset="0" stopColor={palette[0]} /><Stop offset="1" stopColor={palette[1]} />
        </LinearGradient>
      </Defs>
      <Circle cx="22" cy="22" r="21" fill={name === 'symptom' ? gradients.soft[1] : `url(#${id})`} />
      {name === 'period' && <>
        <Path d="M22 8c-3 5-8 11-8 17a8 8 0 0 0 16 0c0-6-5-12-8-17z" stroke={colors.onBrand} strokeWidth="1.5" />
        <Path d="M18 24c-.5 4 1.5 6 4 6" stroke={colors.onBrand} strokeWidth="1.2" strokeLinecap="round" />
      </>}
      {name === 'symptom' && <Path d="M24 5 13 24h8l-2 15 12-21h-9l2-13z" fill={colors.brandOrange} stroke={colors.brandCoral} strokeWidth="1.2" strokeLinejoin="round" />}
      {name === 'mood' && <>
        <Circle cx="15.5" cy="18" r="2" fill={colors.textPrimary} />
        <Circle cx="28.5" cy="18" r="2" fill={colors.textPrimary} />
        <Path d="M15 27q7 8 14 0" stroke={colors.textPrimary} strokeWidth="2" strokeLinecap="round" />
        <Path d="M18 29q4 3 8 0" stroke={colors.onBrand} strokeWidth="2.5" strokeLinecap="round" />
      </>}
    </Svg>
  );
}

type QuickActionProps = {
  icon: IconName;
  label: string;
  hint?: string;
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export function QuickAction({ icon, label, hint, disabled = false, loading = false, onPress, style }: QuickActionProps) {
  const reducedMotion = useReducedMotion();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityHint={hint} accessibilityState={{ disabled: disabled || loading, busy: loading }} disabled={disabled || loading} onPress={onPress} pressRetentionOffset={spacing.lg} style={[{ flex: 1 }, style]}>
      {({ pressed }) => (
        <Animated.View style={{
          flex: 1, minHeight: homeLayout.actionHeight, paddingHorizontal: spacing.xs,
          paddingVertical: spacing.lg, borderRadius: radii.lg, borderCurve: 'continuous',
          overflow: 'hidden', borderWidth: 1, borderColor: colors.border,
          alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
          opacity: disabled ? 0.55 : pressed ? 0.82 : 1,
          transform: [{ scale: pressed && !reducedMotion ? 0.97 : 1 }],
          transitionProperty: 'transform', transitionDuration: reducedMotion ? 0 : motion.fast,
          transitionTimingFunction: cubicBezier(0.23, 1, 0.32, 1),
        }}>
          <GradientSurface colors={gradients.card} />
          {loading ? <ActivityIndicator color={colors.brandText} style={{ height: homeLayout.actionIconSize }} /> : <ActionIcon name={icon} />}
          <SinagText variant="actionLabel" style={{ textAlign: 'center' }}>{label}</SinagText>
        </Animated.View>
      )}
    </Pressable>
  );
}
