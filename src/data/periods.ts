import type { SQLiteDatabase } from 'expo-sqlite';
import { compareLocalDates, type LocalDate } from '@/domain/cycle';

export type PeriodRecord = { id: number; startDate: LocalDate; endDate: LocalDate | null };
type PeriodRow = { id: number; startDate: LocalDate; endDate: LocalDate | null | undefined };

export async function migrateDatabase(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS periods (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      start_date TEXT NOT NULL UNIQUE,
      end_date TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CHECK (end_date IS NULL OR end_date >= start_date)
    );
    CREATE UNIQUE INDEX IF NOT EXISTS periods_single_active ON periods ((1)) WHERE end_date IS NULL;
    PRAGMA user_version = 1;
  `);
}

export async function getPeriodRecords(db: SQLiteDatabase): Promise<PeriodRecord[]> {
  const rows = await db.getAllAsync<PeriodRow>(`
    SELECT id, start_date AS startDate, end_date AS endDate
    FROM periods
    ORDER BY start_date DESC
  `);
  return rows.map(normalizePeriodRow);
}

export async function getActivePeriod(db: SQLiteDatabase): Promise<PeriodRecord | null> {
  // Query the persisted status directly. Home uses this as its action source of truth,
  // rather than inferring it from a potentially stale or differently shaped list row.
  const row = await db.getFirstAsync<PeriodRow>(`
    SELECT id, start_date AS startDate, end_date AS endDate
    FROM periods
    WHERE end_date IS NULL
    ORDER BY start_date DESC
    LIMIT 1
  `);
  return row ? normalizePeriodRow(row) : null;
}

function normalizePeriodRow(row: PeriodRow): PeriodRecord {
  return { id: row.id, startDate: row.startDate, endDate: row.endDate ?? null };
}

export async function startPeriod(db: SQLiteDatabase, startDate: LocalDate) {
  // One atomic statement makes retries and simultaneous Start commands idempotent.
  // An existing active period is left untouched; the caller reloads it for the UI.
  const result = await db.runAsync(`
    INSERT INTO periods (start_date)
    SELECT ? WHERE NOT EXISTS (SELECT 1 FROM periods WHERE end_date IS NULL)
    ON CONFLICT (start_date) DO NOTHING
  `, startDate);

  if (result.changes === 0) {
    const active = await db.getFirstAsync<{ id: number }>('SELECT id FROM periods WHERE end_date IS NULL');
    if (!active) {
      throw new Error('A period starting today is already recorded. You can start a new period on a later date.');
    }
  }
}

export async function endActivePeriod(db: SQLiteDatabase, endDate: LocalDate) {
  const active = await db.getFirstAsync<{ id: number; start_date: LocalDate }>('SELECT id, start_date FROM periods WHERE end_date IS NULL ORDER BY start_date DESC LIMIT 1');
  // A repeated End command is also safe after the first one has committed.
  if (!active) return;
  if (compareLocalDates(endDate, active.start_date) < 0) throw new Error('A period cannot end before it starts.');
  await db.runAsync('UPDATE periods SET end_date = ? WHERE id = ?', endDate, active.id);
}
