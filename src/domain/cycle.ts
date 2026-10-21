export type LocalDate = `${number}-${number}-${number}`;

const LOCAL_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function toLocalDate(date: Date): LocalDate {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}` as LocalDate;
}

export function parseLocalDate(value: string): { year: number; month: number; day: number } | null {
  const match = LOCAL_DATE_PATTERN.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const candidate = new Date(Date.UTC(year, month - 1, day));
  if (candidate.getUTCFullYear() !== year || candidate.getUTCMonth() !== month - 1 || candidate.getUTCDate() !== day) return null;
  return { year, month, day };
}

export function compareLocalDates(left: string, right: string): number {
  if (!parseLocalDate(left) || !parseLocalDate(right)) throw new Error('Expected dates in YYYY-MM-DD format.');
  return left.localeCompare(right);
}

export function daysBetweenLocalDates(start: string, end: string): number | null {
  const startDate = parseLocalDate(start);
  const endDate = parseLocalDate(end);
  if (!startDate || !endDate) return null;
  const startUtc = Date.UTC(startDate.year, startDate.month - 1, startDate.day);
  const endUtc = Date.UTC(endDate.year, endDate.month - 1, endDate.day);
  return Math.floor((endUtc - startUtc) / 86_400_000);
}

export function calculateCycleDay(periodStart: string | null, today: string): number | null {
  if (!periodStart) return null;
  const elapsedDays = daysBetweenLocalDates(periodStart, today);
  return elapsedDays === null || elapsedDays < 0 ? null : elapsedDays + 1;
}
