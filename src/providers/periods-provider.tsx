import { useSQLiteContext } from 'expo-sqlite';
import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { endActivePeriod, getActivePeriod, getPeriodRecords, startPeriod, type PeriodRecord } from '@/data/periods';
import { toLocalDate } from '@/domain/cycle';
import { getPeriodAction } from '@/domain/period-action';

type PeriodsState = {
  records: PeriodRecord[];
  activePeriod: PeriodRecord | null;
  loading: boolean;
  loadFailed: boolean;
  saving: boolean;
  error: string | null;
  saveToday: (action: 'start' | 'end') => Promise<void>;
  reload: () => Promise<void>;
  dismissError: () => void;
};
const PeriodsContext = createContext<PeriodsState | null>(null);

export function PeriodsProvider({ children }: React.PropsWithChildren) {
  const db = useSQLiteContext();
  const [records, setRecords] = useState<PeriodRecord[]>([]);
  const [activePeriod, setActivePeriod] = useState<PeriodRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const writeInFlight = useRef(false);
  const readInFlight = useRef(false);
  const dismissError = useCallback(() => setError(null), []);

  const getSavedPeriods = useCallback(async () => {
    const [nextRecords, nextActivePeriod] = await Promise.all([
      getPeriodRecords(db),
      getActivePeriod(db),
    ]);
    return { nextRecords, nextActivePeriod };
  }, [db]);

  const reload = useCallback(async () => {
    // A save already refreshes both queries. Avoid a competing stale read.
    if (writeInFlight.current || readInFlight.current) return;
    readInFlight.current = true;
    setLoading(true);
    try {
      const { nextRecords, nextActivePeriod } = await getSavedPeriods();
      setRecords(nextRecords);
      setActivePeriod(nextActivePeriod);
      setError(null);
      setLoadFailed(false);
    }
    catch {
      setError('Your saved records could not be loaded. Please try again.');
      setLoadFailed(true);
    }
    finally { readInFlight.current = false; setLoading(false); }
  }, [getSavedPeriods]);

  useEffect(() => {
    let previous = AppState.currentState;
    const subscription = AppState.addEventListener('change', (next) => {
      const returning = previous !== 'active' && next === 'active';
      previous = next;
      if (returning) void reload();
    });
    return () => subscription.remove();
  }, [reload]);

  useEffect(() => {
    let mounted = true;
    getSavedPeriods().then(({ nextRecords, nextActivePeriod }) => {
      if (!mounted) return;
      setRecords(nextRecords);
      setActivePeriod(nextActivePeriod);
      setLoadFailed(false);
      setError(null);
    }).catch(() => {
      if (!mounted) return;
      setError('Your saved records could not be loaded. Please try again.');
      setLoadFailed(true);
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, [getSavedPeriods]);

  const saveToday = useCallback(async (action: 'start' | 'end') => {
    // React's disabled state updates on the next render; this lock is immediate.
    if (writeInFlight.current || readInFlight.current || loading || loadFailed) return;
    const today = toLocalDate(new Date());
    // Also guard stale callbacks; never turn a repeated Start into an End.
    if (getPeriodAction(records, activePeriod, today) !== action) return;
    writeInFlight.current = true;
    setSaving(true); setError(null);
    let committed = false;
    try {
      if (action === 'end') await endActivePeriod(db, today);
      else await startPeriod(db, today);
      committed = true;
      const { nextRecords, nextActivePeriod } = await getSavedPeriods();
      setRecords(nextRecords);
      setActivePeriod(nextActivePeriod);
      setLoadFailed(false);
    } catch (reason) {
      if (committed) {
        setLoadFailed(true);
        setError('Your period was saved, but the screen could not refresh. Reload your records below.');
      } else {
        setError(toSaveMessage(reason, action));
      }
    } finally {
      writeInFlight.current = false;
      setSaving(false);
    }
  }, [activePeriod, db, getSavedPeriods, loading, loadFailed, records]);

  const value = useMemo(
    () => ({ records, activePeriod, loading, loadFailed, saving, error, saveToday, reload, dismissError }),
    [activePeriod, dismissError, error, loading, loadFailed, records, reload, saving, saveToday],
  );
  return <PeriodsContext value={value}>{children}</PeriodsContext>;
}

function toSaveMessage(reason: unknown, action: 'start' | 'end') {
  if (reason instanceof Error && (
    reason.message === 'A period starting today is already recorded. You can start a new period on a later date.'
    || reason.message === 'A period cannot end before it starts.'
  )) return reason.message;
  return action === 'end'
    ? 'We could not end your period. Your saved records have not been changed. Please try again.'
    : 'We could not start your period. Your saved records have not been changed. Please try again.';
}

export function usePeriods() {
  const value = React.use(PeriodsContext);
  if (!value) throw new Error('usePeriods must be used inside PeriodsProvider.');
  return value;
}
