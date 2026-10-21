import { Link, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandStar } from '@/components/brand-star';
import { CycleRing, type TrackerState } from '@/components/cycle-ring';
import { GradientSurface } from '@/components/gradient-surface';
import { QuickAction } from '@/components/quick-action';
import { SinagIcon } from '@/components/sinag-icon';
import { SinagText } from '@/components/sinag-text';
import { colors, gradients, homeLayout, radii, spacing } from '@/constants/theme';
import { calculateCycleDay, parseLocalDate, toLocalDate } from '@/domain/cycle';
import { getPeriodAction } from '@/domain/period-action';
import { usePeriods } from '@/providers/periods-provider';
import { InsightPreview } from '@/screens/home/insight-preview';

function formatStartDate(value: string | null): string | null {
  const parts = value ? parseLocalDate(value) : null;
  if (!parts) return null;
  return new Date(parts.year, parts.month - 1, parts.day).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function greeting() {
  const hour = new Date().getHours();
  return hour < 12 ? 'Good morning,' : hour < 18 ? 'Good afternoon,' : 'Good evening,';
}

export default function HomeScreen() {
  const { width, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ preview?: string; state?: string }>();
  const { records, activePeriod, loading, loadFailed, saving, error, saveToday, reload, dismissError } = usePeriods();
  const [notice, setNotice] = useState<string | null>(null);
  // Opt-in only; these sample values never enter SQLite or any save handler.
  const preview = __DEV__ && params.preview === 'home';
  const previewEmpty = preview && params.state === 'empty';
  const latest = records[0] ?? null;
  // The primary action reflects the database's active-period query, not a visual toggle.
  const active = preview ? !previewEmpty : activePeriod !== null;
  const today = toLocalDate(new Date());
  const periodAction = preview ? (previewEmpty ? 'start' : 'end') : getPeriodAction(records, activePeriod, today);
  const periodLabel = periodAction === 'end' ? 'End Period' : periodAction === 'recorded' ? 'Period Recorded' : 'Start Period';
  const cycleDay = preview ? (previewEmpty ? null : 5)
    : calculateCycleDay(latest?.startDate ?? null, today);
  const state: TrackerState = preview ? (previewEmpty ? 'empty' : 'active')
    : loading ? 'loading' : loadFailed ? 'error' : cycleDay === null ? 'empty' : active ? 'active' : 'tracked';
  const pageWidth = Math.min(width - insets.left - insets.right, homeLayout.maxWidth);
  const contentWidth = pageWidth - homeLayout.gutter * 2;
  const ringSize = Math.max(0, Math.min(homeLayout.ringSize, contentWidth, pageWidth * homeLayout.ringWidthRatio));
  const largeActions = fontScale > 1.35;
  const startLabel = preview ? (previewEmpty ? null : 'Oct 16') : formatStartDate(latest?.startDate ?? null);
  const insightMessage = state === 'loading' ? 'Your saved cycle summary will appear here.'
    : state === 'error' ? 'Reload your records to see your cycle summary.'
    : cycleDay === null ? 'A little self-care starts with you. Log a period to begin your cycle story.'
    : active ? `You’re on cycle day ${cycleDay}. Your period is marked as ongoing.`
    : `You’re on cycle day ${cycleDay}, counted from your last logged period.`;

  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: colors.background }}>
      <GradientSurface colors={gradients.home} />
      <ScrollView
        style={{ flex: 1 }}
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1, alignItems: 'center', paddingTop: spacing.xl,
          paddingBottom: spacing.xl, paddingLeft: insets.left, paddingRight: insets.right,
        }}>
        <View style={{ width: '100%', maxWidth: homeLayout.maxWidth, paddingHorizontal: homeLayout.gutter, gap: spacing.lg }}>
          {preview && (
            <View style={{ padding: spacing.md, gap: spacing.sm, borderWidth: 1, borderColor: colors.focus, borderRadius: radii.sm, backgroundColor: colors.surface }}>
              <SinagText variant="helper" style={{ color: colors.focus }}>SAMPLE DATA · Visual preview · Saving disabled</SinagText>
              <Pressable accessibilityRole="button" onPress={() => router.setParams({ preview: undefined, state: undefined })} style={{ minHeight: 48, justifyContent: 'center' }}>
                <SinagText variant="label" style={{ color: colors.focus }}>Return to my records</SinagText>
              </Pressable>
            </View>
          )}

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md }}>
            <View style={{ flex: 1 }}>
              <SinagText variant="greeting" accessibilityRole="header" style={{ color: colors.brandText }}>{preview ? 'Good morning,' : greeting()}</SinagText>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <SinagText variant="greeting" style={{ color: colors.brandText, flexShrink: 1 }}>You got this!</SinagText>
                <BrandStar size={24} accents />
              </View>
            </View>
            <Link href="/calendar" asChild>
              <Pressable accessibilityRole="button" accessibilityLabel="Open Calendar" style={({ pressed }) => ({ width: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.6 : 1 })}>
                <SinagIcon name="calendar" size={28} color={colors.brandText} />
              </Pressable>
            </Link>
          </View>

          <CycleRing cycleDay={cycleDay} size={ringSize} state={state} startLabel={startLabel} />

          <View style={{ flexDirection: largeActions ? 'column' : 'row', alignItems: 'stretch', gap: spacing.md }}>
            <QuickAction icon="period" label={periodLabel}
              style={largeActions ? { flex: 0 } : undefined}
              hint={preview ? 'Saving is disabled in visual preview.' : periodAction === 'recorded'
                ? 'A period starting today is already completed and saved. Editing is not available yet.'
                : `Record your period ${periodAction} for today.`}
              disabled={preview || loading || loadFailed || periodAction === 'recorded'} loading={saving}
              onPress={() => { if (!preview && periodAction !== 'recorded') void saveToday(periodAction); }} />
            <QuickAction icon="symptom" label="Log Symptom" hint="Coming soon. Tap for details."
              style={largeActions ? { flex: 0 } : undefined}
              onPress={() => setNotice('Symptom logging is coming soon. No symptom entry has been saved.')} />
            <QuickAction icon="mood" label="Log Mood" hint="Coming soon. Tap for details."
              style={largeActions ? { flex: 0 } : undefined}
              onPress={() => setNotice('Mood logging is coming soon. No mood entry has been saved.')} />
          </View>

          <View style={{ paddingTop: spacing.xs }}><InsightPreview message={insightMessage} /></View>

          {notice && (
            <View accessibilityLiveRegion="polite" style={{ padding: spacing.md, borderRadius: radii.md, backgroundColor: colors.surfaceBlush, flexDirection: 'row', gap: spacing.sm, alignItems: 'center' }}>
              <SinagText variant="helper" style={{ flex: 1 }}>{notice}</SinagText>
              <Pressable accessibilityRole="button" accessibilityLabel="Dismiss message" onPress={() => setNotice(null)} style={{ width: 48, minHeight: 48, justifyContent: 'center', alignItems: 'center' }}><SinagIcon name="close" size={18} /></Pressable>
            </View>
          )}

          {(error || loadFailed) && !preview && (
            <View accessibilityRole="alert" style={{ padding: spacing.lg, gap: spacing.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <SinagText variant="helper" selectable style={{ color: colors.error, flex: 1 }}>{error ?? 'Reload your records to continue.'}</SinagText>
                {error && <Pressable accessibilityRole="button" accessibilityLabel="Dismiss period message" onPress={dismissError} style={{ width: 48, minHeight: 48, justifyContent: 'center', alignItems: 'center' }}><SinagIcon name="close" size={18} /></Pressable>}
              </View>
              {loadFailed && <Pressable accessibilityRole="button" disabled={loading || saving} onPress={() => void reload()} style={({ pressed }) => ({ minHeight: 48, justifyContent: 'center', opacity: pressed ? 0.6 : 1 })}><SinagText variant="label" style={{ color: colors.brandText }}>{loading ? 'Loading…' : 'Reload records'}</SinagText></Pressable>}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
