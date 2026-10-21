# Home rebuild: visual review

The Home composition follows the second phone in `design/sinag_reference.png`.
The UI uses native React Native components and SVG vectors. The background, closed
pastel ring, brighter upper-right arc, compact action cards, star insight row, and
flat four-tab navigation are implemented as interface elements.

## Development preview

Run `npm start` (or `npm run web`) and open either route in the development app:

- `/?preview=home`: clearly labeled sample cycle day 5 and an active period.
- `/?preview=home&state=empty`: empty tracker and first-entry copy.
- `/`: real saved records.

Preview mode requires `__DEV__`. It shows a persistent SAMPLE DATA banner and disables
period saving. It never seeds or modifies SQLite. The production bundle ignores
these preview parameters. The ring is decorative and never represents an estimate
of cycle length, a phase, or fertility.

## Review targets

- Compare Home at widths 320, 390, and 420, including a short screen.
- Confirm the greeting, circular tracker, all three actions, insight row, and tab
  icons follow the reference's order and proportions.
- Check the empty state, active period, completed period, loading, and retry states.
- Check large system text: actions stack and tracker text moves below its ring.
- Check screen-reader names, reduced motion, and both iOS/Android safe areas.
- On a disposable test installation, rapidly tap Start Period; confirm a single
  record and the End Period label. End it, reload the app, and confirm persistence.

## Architecture and scope

The existing SQLite file name, schema, migration, and cycle-date calculations are
preserved. Explicit start/end commands, an immediate in-flight write lock, atomic
idempotent starts, and reload error handling prevent duplicate or stale operations.
An existing same-day completed record is preserved with a readable error if a user
tries to start it again. There is no new health prediction or logging feature.

Automated regression tests use Node 24's native TypeScript handling and SQLite to
exercise the actual repository SQL in an isolated in-memory database.
