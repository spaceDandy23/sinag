# Codex implementation prompt — Sinag Phase 1

You are implementing **Sinag**, an original React Native / Expo / TypeScript menstrual cycle tracker.

## Visual references
- `design/sinag_reference.png` is a **concept moodboard**, not a screenshot to paste into the UI.
- `docs/SINAG_DESIGN_SYSTEM.md` is the working design system and source of visual constraints.
- Do not duplicate competitor logos/assets. Recreate the layout as real, reusable, responsive React Native components.

## First: inspect, then plan
1. Inspect existing project files, Expo SDK and dependencies. **Do not destroy an existing app.** If this is a blank folder, explain the clean Expo scaffolding needed and do it.
2. State a brief implementation plan and any meaningful architectural choices, then execute Phase 1 only.
3. Use versions compatible with the installed Expo SDK; prefer Expo Router if present. Avoid heavyweight UI frameworks and extra abstractions.

## Phase 1 goal: a REAL working home-screen vertical slice
1. Implement central design tokens (colors, gradients, typography, spacing, radii), a custom star logo, and reusable card/button primitives.
2. Build an accessible, responsive home screen inspired by the design reference: greeting/header, a prominent pink-orange circular tracker built with `react-native-svg`, three actions, an insight preview empty state, and four-tab navigation.
3. Implement a SQLite-backed **minimal Period model** (`id`, `startDate`, `endDate` nullable) using date-only strings `YYYY-MM-DD` as local calendar dates. Use a versioned migration/init path. Explain any constraints that prevent overlapping open periods.
4. Make **Log Period** actually functional: allow start of an active period and end of the active period. Each local write must confirm success before the saved UI is updated (pessimistic updates). Provide loading/disabled/error states. No fake records.
5. Show a real cycle day only where it can be calculated from the latest valid recorded period start; if there are no records, show a friendly empty state instead. Do not fabricate average cycle lengths, ovulation/fertility phases, predictions, or hormonal insights. The ring can remain a decorative visualization until we have enough records for calibrated progress.
6. Log Symptom, Log Mood, Calendar, Insights, and Account should navigate to intentional, clearly labeled placeholder screens **rather than inert buttons**. Do not claim these features work yet.
7. Keep the structure maintainable and feature-oriented but modest in scope. Separate date calculations and SQLite access from presentation components. No giant screen file.

## Out of scope
- Supabase, authentication, cloud backup, sync queues/outbox, multi-device syncing
- AI, cycle prediction API, machine learning, fertility/ovulation guesses, medical advice
- Full symptom/mood implementation and all additional screens in the moodboard
- Detailed animations until accessibility and core UI are validated

## Acceptance criteria / tests
- App starts on Android, with iOS-compatible implementation choices.
- Navigation works for Home, Calendar, Insights, Account and any quick-action placeholder destinations.
- No period: empty state, no invented cycle day.
- Start period: persists to SQLite and survives reload/app restart.
- End period: updates the same active period and survives restart.
- Starting a second active period is prevented or clearly resolved.
- Display updates only after successful local commit; failure preserves prior persisted state and shows feedback.
- Date-only handling does not shift a period date across time zones. Include unit tests for the day calculation and simple date boundaries.
- No tiny tap targets or clipped content on a small Android device; safe-area and dynamic font sizing considered.
- Run TypeScript checking, linting, and available tests. If any command cannot run, state this honestly.

## End with
- Files added/changed, packages installed with reasons
- How the date calculation and SQLite migration work
- Actual test commands and results, known limitations
- Three manual QA steps for a real Android device
- Stop after Phase 1; ask for review before adding features
