import { ThemeProvider } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import '@/global.css';
import AppTabs from '@/components/app-tabs';
import { colors } from '@/constants/theme';
import { migrateDatabase } from '@/data/periods';
import { PeriodsProvider } from '@/providers/periods-provider';

const sinagNavigationTheme = {
  dark: false,
  colors: { primary: colors.brandPink, background: colors.background, card: colors.surface, text: colors.textPrimary, border: colors.border, notification: colors.brandCoral },
  fonts: {
    regular: { fontFamily: 'system-ui', fontWeight: '400' as const },
    medium: { fontFamily: 'system-ui', fontWeight: '500' as const },
    bold: { fontFamily: 'system-ui', fontWeight: '700' as const },
    heavy: { fontFamily: 'system-ui', fontWeight: '800' as const },
  },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={sinagNavigationTheme}>
      <SQLiteProvider databaseName="sinag.db" onInit={migrateDatabase}>
        <PeriodsProvider><StatusBar style="dark" /><AppTabs /></PeriodsProvider>
      </SQLiteProvider>
    </ThemeProvider>
  );
}
