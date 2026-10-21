import type { PeriodRecord } from '@/data/periods';
import type { LocalDate } from '@/domain/cycle';

export type PeriodAction = 'start' | 'end' | 'recorded';

export function getPeriodAction(
  records: readonly PeriodRecord[],
  activePeriod: PeriodRecord | null,
  today: LocalDate,
): PeriodAction {
  if (activePeriod !== null) return 'end';
  // Any existing start date blocks a duplicate, regardless of list ordering.
  if (records.some((record) => record.startDate === today)) return 'recorded';
  return 'start';
}
