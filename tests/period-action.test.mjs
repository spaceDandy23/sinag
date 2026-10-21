import assert from 'node:assert/strict';
import test from 'node:test';
import './helpers/register-aliases.mjs';
import { getPeriodAction } from '../src/domain/period-action.ts';

const completed = { id: 1, startDate: '2026-10-20', endDate: '2026-10-20' };
const active = { id: 2, startDate: '2026-10-21', endDate: null };

test('an active period offers End, including on its start date', () => {
  assert.equal(getPeriodAction([active, completed], active, '2026-10-21'), 'end');
  assert.equal(getPeriodAction([active, completed], active, '2026-10-22'), 'end');
});

test('a completed period starting today offers only the recorded state', () => {
  assert.equal(getPeriodAction([completed], null, '2026-10-20'), 'recorded');
  // Search all records, not just the first row.
  assert.equal(getPeriodAction([active, completed], null, '2026-10-20'), 'recorded');
});

test('empty history and completed history from an earlier day offer Start', () => {
  assert.equal(getPeriodAction([], null, '2026-10-20'), 'start');
  assert.equal(getPeriodAction([completed], null, '2026-10-21'), 'start');
});

test('the recorded state expires on the next local date without modifying history', () => {
  const history = Object.freeze([Object.freeze({ ...completed, startDate: '2026-12-31', endDate: '2026-12-31' })]);
  assert.equal(getPeriodAction(history, null, '2026-12-31'), 'recorded');
  assert.equal(getPeriodAction(history, null, '2027-01-01'), 'start');
  assert.equal(history[0].endDate, '2026-12-31');
});
