import { Link } from 'expo-router';
import { useId } from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { GradientSurface } from '@/components/gradient-surface';
import { SinagIcon } from '@/components/sinag-icon';
import { SinagText } from '@/components/sinag-text';
import { colors, gradients, radii, shadows, spacing } from '@/constants/theme';

export function InsightPreview({ message }: { message: string }) {
  const starGradientId = `insight-star-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <Link href="/insights" asChild>
      <Pressable
        accessible
        accessibilityRole="button"
        accessibilityLabel={`Today's Insight. ${message}`}
        accessibilityHint="Opens Insights."
        style={{
          width: '100%',
          backgroundColor: gradients.card[0],
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radii.md,
          borderCurve: 'continuous',
          boxShadow: shadows.card,
        }}>
        {({ pressed }) => (
          // Keep row geometry outside Link's style merging and allow text to grow vertically.
          <View style={{
            minHeight: 100,
            width: '100%',
            padding: spacing.lg,
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.md,
            borderRadius: radii.md,
            borderCurve: 'continuous',
            overflow: 'hidden',
            opacity: pressed ? 0.7 : 1,
          }}>
            <GradientSurface colors={gradients.card} horizontal />

            <View
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              style={{ width: 36, height: 36, flexShrink: 0 }}>
              <Svg width={36} height={36} viewBox="0 0 32 32">
                <Defs>
                  <LinearGradient id={starGradientId} x1="0" y1="0" x2="0.75" y2="1">
                    <Stop offset="0" stopColor={colors.brandOrange} />
                    <Stop offset="1" stopColor={colors.brandCoral} />
                  </LinearGradient>
                </Defs>
                <Path
                  d="M14.4 3.8q1.6-3.3 3.2 0l3.1 6.3 7 .9q3.5.5 1 3l-5.1 5 .9 7q.6 3.6-2.6 1.9L16 24.6l-5.9 3.3q-3.2 1.7-2.6-1.9l.9-7-5.1-5q-2.5-2.5 1-3l7-.9 3.1-6.3z"
                  fill={`url(#${starGradientId})`}
                />
              </Svg>
            </View>

            <View style={{ flex: 1, minWidth: 0, gap: spacing.xs }}>
              <SinagText variant="insightTitle">{"Today's Insight"}</SinagText>
              <SinagText variant="insightBody">{message}</SinagText>
            </View>

            <View style={{ width: 16, flexShrink: 0, alignSelf: 'center' }}>
              <SinagIcon name="chevron-right" size={16} color={colors.brandPink} />
            </View>
          </View>
        )}
      </Pressable>
    </Link>
  );
}
