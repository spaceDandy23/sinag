# Sinag — Design system v1

**Product:** Privacy-conscious menstrual cycle tracker with free, automatic, explainable insights.

**Brand direction:** Filipino-inspired name *Sinag* (ray of light); a **star** is the chosen logo motif. Pink-to-orange warmth, generous whitespace, accessible components, and an elegant circular cycle display. The reference mockup is visual inspiration only: it is not pixel-perfect source code, and some example calendar dates/insights in it are fictional or inconsistent.

## 1. Design tokens

```ts
export const colors = {
  brandPink: '#F74F7A',
  brandCoral: '#FF6A6B',
  brandOrange: '#FF9862',
  background: '#FFF8F5',
  surface: '#FFFFFF',
  surfaceBlush: '#FFF0ED',
  border: '#F2DDD9',
  textPrimary: '#442730',
  textSecondary: '#70545B',
  textMuted: '#816B70',
  success: '#28734D',
  error: '#B42F48',
  focus: '#6A428D',
} as const;
export const gradients = {
  brand: ['#F74F7A', '#FF9862'] as const,
  soft: ['#FFF5F3', '#FFE2D3'] as const,
} as const;
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radii = { sm: 10, md: 16, lg: 22, xl: 28, pill: 999 } as const;
```

These are working design tokens—not measurements extracted pixel-for-pixel from the generated image. Check text/gradient contrast on real screens. Use deep plum text on light surfaces, and don't place small white text over pale orange unless contrast has been verified.

## 2. Type and iconography

- Prefer system fonts for first implementation: avoid custom font installation until needed.
- H1 / hero number: 28–36sp, semibold/bold; screen heading: 22–26sp; card title: 16–18sp; body: 14–16sp; helper: 12–13sp.
- Never force fixed text heights; test font scaling and longer translated strings.
- Consistent rounded line icons; use one icon family and a custom star SVG or simple local vector component.
- Star logo: one five-point star with three small accent stars/dots, gradient pink → orange. Keep iconography distinctly original instead of cloning Flo.

## 3. Layout and components

- Screen background: warm ivory. Horizontal screen gutter: 20–24dp, scalable.
- Cards: light surface, 16–24dp corners, subtle borders and restrained elevation/shadow.
- Buttons: minimum 48dp height, generous tap area; gradient primary button and outlined secondary variant. Display loading/disabled/pressed states.
- Tab bar: Home, Calendar, Insights, Account. All tabs must navigate to valid screens; placeholder sections must be labeled, not dead-end taps.
- Home: welcome/header, centered circular cycle tracker, three quick actions (Log Period, Log Symptom, Log Mood), one small insight preview card, bottom tabs.
- Cycle ring: use `react-native-svg` vectors; animate only if accessibility and device performance permit. Show "Cycle day N" only if the relevant real period start date exists. Do **not** show fake data, invented fertility windows, hormone claims, or medical phases by default. With no records show "Start tracking your cycle" plus explanatory empty state.
- Mood/symptom events are optional and can be entered outside a period; never require daily entries.
- Insights: neutral empty state until enough valid historical data exists; label estimates and uncertainty when they are later implemented.
- Account: design for mandatory account + automatic backup in a later phase; no cloud functionality in phase 1.

## 4. Accessibility & trust

- Touch targets approximately 44–48dp or larger; correct roles and accessible labels.
- Text contrast aim for WCAG AA (4.5:1 for normal-size text). Don't use color as the only status indicator.
- Respect safe areas, keyboard avoidance, reduced motion, and smaller Android screens.
- Store no invented or real-looking sample health records as user data. If preview data is ever used for development, mark it obviously DEMO and keep it out of persisted production records.
- Explain uncertainty of future estimates. Calendar-based cycle predictions are **not** reliable contraception and do not diagnose medical conditions.
- Privacy, authentication, secure cloud backup, and account recovery need explicit security design before production launch.

## 5. Scope control

### Phase 1
- Theme/tokens, navigation, responsive home and cycle ring
- Local `Period` record and Start/End Period action backed by SQLite (if practical within one contained slice)
- Correct empty states, period UI states, one nonfunctional labeled placeholder for insights and logging features
- Tests for local date handling and period transitions

### Later
- Full period editing/history, symptoms & mood quick logging, automatic insight engine, authentication, encrypted cloud backup/recovery, offline sync worker, and additional QA.
