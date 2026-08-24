import type { Weekday, WeeklySlot } from '@/lib/types';

/** Hourly appointment starts Joe can offer (local time). */
export const HOUR_OPTIONS = [
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
] as const;

export const WEEKDAYS: { value: Weekday; label: string; short: string }[] = [
  { value: 0, label: 'Sunday', short: 'Sun' },
  { value: 1, label: 'Monday', short: 'Mon' },
  { value: 2, label: 'Tuesday', short: 'Tue' },
  { value: 3, label: 'Wednesday', short: 'Wed' },
  { value: 4, label: 'Thursday', short: 'Thu' },
  { value: 5, label: 'Friday', short: 'Fri' },
  { value: 6, label: 'Saturday', short: 'Sat' },
];

const weekdayHours = (weekday: Weekday, hours: readonly string[]): WeeklySlot[] =>
  hours.map((start) => ({ weekday, start }));

/** Starter week: Tue–Fri 8–5 with lunch at noon, Saturday morning. Joe can edit this in-app. */
export const DEFAULT_WEEKLY_SLOTS: WeeklySlot[] = [
  ...weekdayHours(2, ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00']),
  ...weekdayHours(3, ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00']),
  ...weekdayHours(4, ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00']),
  ...weekdayHours(5, ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00']),
  ...weekdayHours(6, ['08:00', '09:00', '10:00', '11:00']),
];
