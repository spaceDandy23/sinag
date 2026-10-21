import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import test from 'node:test';

import './helpers/register-aliases.mjs';

const { migrateDatabase, getActivePeriod, getPeriodRecords, startPeriod, endActivePeriod } = await import('../src/data/periods.ts');
const { getPeriodAction } = await import('../src/domain/period-action.ts');

function asAsyncDatabase(connection) {
  return {
    execAsync: async (sql) => connection.exec(sql),
    runAsync: async (sql, ...params) => connection.prepare(sql).run(...params),
    getFirstAsync: async (sql, ...params) => connection.prepare(sql).get(...params) ?? null,
    getAllAsync: async (sql, ...params) => connection.prepare(sql).all(...params),
  };
}

async function fixture(t) {
  const connection = new DatabaseSync(':memory:');
  t.after(() => connection.close());
  const db = asAsyncDatabase(connection);
  await migrateDatabase(db);
  return { db, connection };
}

test('simultaneous starts create exactly one active record', async (t) => {
  const { db } = await fixture(t);
  await Promise.all(Array.from({ length: 5 }, () => startPeriod(db, '2026-10-20')));
  const records = await getPeriodRecords(db);
  assert.equal(records.length, 1);
  assert.equal(records[0].startDate, '2026-10-20');
  assert.equal(records[0].endDate, null);
});

test('an active record is returned from persisted NULL end_date', async (t) => {
  const { db } = await fixture(t);
  await startPeriod(db, '2026-10-20');
  assert.deepEqual(await getActivePeriod(db), {
    id: 1,
    startDate: '2026-10-20',
    endDate: null,
  });
});

test('a completed period is not returned as active and remains in history', async (t) => {
  const { db } = await fixture(t);
  await startPeriod(db, '2026-10-20');
  await endActivePeriod(db, '2026-10-23');
  assert.equal(await getActivePeriod(db), null);
  assert.deepEqual(await getPeriodRecords(db), [{ id: 1, startDate: '2026-10-20', endDate: '2026-10-23' }]);
});

test('a stale Start command preserves the original active period', async (t) => {
  const { db } = await fixture(t);
  await startPeriod(db, '2026-10-19');
  await startPeriod(db, '2026-10-20');
  assert.deepEqual((await getPeriodRecords(db)).map(({ startDate, endDate }) => ({ startDate, endDate })), [
    { startDate: '2026-10-19', endDate: null },
  ]);
});

test('Start then End persists the end date; duplicate End is harmless', async (t) => {
  const { db } = await fixture(t);
  await startPeriod(db, '2026-10-19');
  await endActivePeriod(db, '2026-10-20');
  await endActivePeriod(db, '2026-10-20');
  assert.equal((await getPeriodRecords(db))[0].endDate, '2026-10-20');
});

test('same-day start/end cannot be duplicated or silently reopened', async (t) => {
  const { db } = await fixture(t);
  await startPeriod(db, '2026-10-20');
  await endActivePeriod(db, '2026-10-20');
  await assert.rejects(startPeriod(db, '2026-10-20'), /already recorded/);
  const records = await getPeriodRecords(db);
  assert.equal(records.length, 1);
  assert.equal(records[0].endDate, '2026-10-20');
});

test('a new period can start later while completed history stays intact', async (t) => {
  const { db } = await fixture(t);
  await startPeriod(db, '2026-09-20');
  await endActivePeriod(db, '2026-09-24');
  await startPeriod(db, '2026-10-20');
  const records = await getPeriodRecords(db);
  assert.equal(records.length, 2);
  assert.equal(records[0].endDate, null);
  assert.equal(records[1].endDate, '2026-09-24');
});

test('an invalid end date leaves the active record untouched', async (t) => {
  const { db } = await fixture(t);
  await startPeriod(db, '2026-10-20');
  await assert.rejects(endActivePeriod(db, '2026-10-19'), /before it starts/);
  assert.equal((await getPeriodRecords(db))[0].endDate, null);
});

test('running the existing migration again preserves saved records', async (t) => {
  const { db } = await fixture(t);
  await startPeriod(db, '2026-10-20');
  const before = await getPeriodRecords(db);
  await migrateDatabase(db);
  assert.deepEqual(await getPeriodRecords(db), before);
});

test('an active period is still active after the app database is reopened', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'sinag-periods-'));
  const filename = join(directory, 'sinag.db');

  const firstConnection = new DatabaseSync(filename);
  const firstDb = asAsyncDatabase(firstConnection);
  await migrateDatabase(firstDb);
  await startPeriod(firstDb, '2026-10-20');
  firstConnection.close();

  const restartedConnection = new DatabaseSync(filename);
  t.after(async () => {
    if (restartedConnection.isOpen) restartedConnection.close();
    await rm(directory, { recursive: true, force: true });
  });
  const restartedDb = asAsyncDatabase(restartedConnection);
  await migrateDatabase(restartedDb);
  assert.deepEqual(await getActivePeriod(restartedDb), {
    id: 1,
    startDate: '2026-10-20',
    endDate: null,
  });
  assert.equal(getPeriodAction(await getPeriodRecords(restartedDb), await getActivePeriod(restartedDb), '2026-10-20'), 'end');
  await endActivePeriod(restartedDb, '2026-10-20');
  restartedConnection.close();

  // Reopen again to verify the device's completed-same-day scenario.
  const completedConnection = new DatabaseSync(filename);
  const completedDb = asAsyncDatabase(completedConnection);
  try {
    const history = await getPeriodRecords(completedDb);
    assert.equal(getPeriodAction(history, await getActivePeriod(completedDb), '2026-10-20'), 'recorded');
    assert.equal(getPeriodAction(history, await getActivePeriod(completedDb), '2026-10-21'), 'start');
    assert.deepEqual(history, [{ id: 1, startDate: '2026-10-20', endDate: '2026-10-20' }]);
  } finally {
    completedConnection.close();
  }
});

test('Home action follows saved Start, End, and next-day Start while preserving history', async (t) => {
  const { db } = await fixture(t);
  const action = async (today) => getPeriodAction(await getPeriodRecords(db), await getActivePeriod(db), today);
  assert.equal(await action('2026-10-20'), 'start');
  await startPeriod(db, '2026-10-20');
  assert.equal(await action('2026-10-20'), 'end');
  await endActivePeriod(db, '2026-10-20');
  assert.equal(await action('2026-10-20'), 'recorded');
  const completedHistory = await getPeriodRecords(db);
  await assert.rejects(startPeriod(db, '2026-10-20'), /already recorded/);
  assert.deepEqual(await getPeriodRecords(db), completedHistory);
  assert.equal(await action('2026-10-21'), 'start');
  await startPeriod(db, '2026-10-21');
  assert.equal(await action('2026-10-21'), 'end');
  assert.deepEqual((await getPeriodRecords(db))[1], completedHistory[0]);
});
