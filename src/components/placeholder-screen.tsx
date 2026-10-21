import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandStar } from '@/components/brand-star';
import { SinagText } from '@/components/sinag-text';
import { colors, maxContentWidth, radii, spacing } from '@/constants/theme';

export function PlaceholderScreen({ title, description }: { title: string; description: string }) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentInsetAdjustmentBehavior="never" contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingTop: insets.top + spacing.xl, paddingBottom: spacing.xl, paddingLeft: insets.left + spacing.xl, paddingRight: insets.right + spacing.xl }}>
      <View style={{ width: '100%', maxWidth: maxContentWidth, flex: 1, gap: spacing.xl }}>
        <SinagText variant="screenTitle" accessibilityRole="header">{title}</SinagText>
        <View style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radii.lg, borderCurve: 'continuous', padding: spacing.xl, gap: spacing.lg, alignItems: 'center' }}>
          <BrandStar size={40} />
          <SinagText variant="cardTitle">Coming in a later phase</SinagText>
          <SinagText style={{ color: colors.textSecondary, textAlign: 'center' }}>{description}</SinagText>
        </View>
      </View>
    </ScrollView>
  );
}
