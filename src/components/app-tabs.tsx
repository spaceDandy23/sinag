import { Tabs, TabList, TabSlot, TabTrigger, type TabTriggerSlotProps } from 'expo-router/ui';
import type { ComponentProps } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SinagIcon, type SinagIconName } from '@/components/sinag-icon';
import { SinagText } from '@/components/sinag-text';
import { colors, homeLayout, spacing } from '@/constants/theme';

const tabs = [
  { name: 'home', href: '/', label: 'Home', icon: 'home' },
  { name: 'calendar', href: '/calendar', label: 'Calendar', icon: 'calendar' },
  { name: 'insights', href: '/insights', label: 'Insights', icon: 'insights' },
  { name: 'account', href: '/account', label: 'Account', icon: 'account' },
] as const;

type TabButtonProps = Omit<TabTriggerSlotProps, 'ref'> & {
  ref?: ComponentProps<typeof Pressable>['ref'];
  icon: SinagIconName;
};

function TabButton({ isFocused, icon, children, ...props }: TabButtonProps) {
  return (
    <Pressable {...props} accessibilityRole="tab" accessibilityState={{ selected: Boolean(isFocused) }}
      style={({ pressed }) => ({ flex: 1, minHeight: homeLayout.tabHeight, alignItems: 'center', justifyContent: 'center', gap: spacing.xs, paddingVertical: spacing.sm, opacity: pressed ? 0.65 : 1 })}>
      <SinagIcon name={icon} size={25} color={isFocused ? colors.brandCoral : colors.textSecondary} filled={isFocused && icon === 'home'} />
      <SinagText variant="tabLabel" style={{ color: isFocused ? colors.brandText : colors.textSecondary }}>{children}</SinagText>
    </Pressable>
  );
}

export default function AppTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs nativeID="sinag-app" style={{ flex: 1, backgroundColor: colors.background }}>
      <TabSlot style={{ flex: 1, minHeight: 0 }} />
      {/* Router's headless tabs reproduce the approved flat bar on every platform. */}
      <TabList asChild>
        <View nativeID="sinag-tab-bar" style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.tabBackground, paddingBottom: insets.bottom, paddingLeft: insets.left, paddingRight: insets.right }}>
          {tabs.map((tab) => (
            <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
              <TabButton icon={tab.icon} accessibilityLabel={tab.label}>{tab.label}</TabButton>
            </TabTrigger>
          ))}
        </View>
      </TabList>
    </Tabs>
  );
}
