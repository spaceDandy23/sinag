import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateCycleDay, daysBetweenLocalDates, parseLocalDate } from '../src/domain/cycle.ts';

test('the period start date is cycle day one', () => {
  assert.equal(calculateCycleDay('2026-10-20', '2026-10-20'), 1);
});

test('cycle day crosses month and year boundaries', () => {
  assert.equal(calculateCycleDay('2025-12-31', '2026-01-02'), 3);
});

test('UTC-normalized date math is stable across daylight-saving boundaries', () => {
  assert.equal(daysBetweenLocalDates('2026-03-07', '2026-03-09'), 2);
  assert.equal(daysBetweenLocalDates('2026-11-01', '2026-11-02'), 1);
});

test('leap day is accepted and counted', () => {
  assert.deepEqual(parseLocalDate('2028-02-29'), { year: 2028, month: 2, day: 29 });
  assert.equal(calculateCycleDay('2028-02-28', '2028-03-01'), 3);
});

test('invalid dates and future starts do not produce a cycle day', () => {
  assert.equal(parseLocalDate('2026-02-29'), null);
  assert.equal(calculateCycleDay('2026-10-21', '2026-10-20'), null);
  assert.equal(calculateCycleDay(null, '2026-10-20'), null);
});
