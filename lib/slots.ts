import type { Appointment, BookableSlot, WeeklySlot } from '@/lib/types';
import { addHour, toIsoDate } from '@/lib/format';

/** Customers can request a window about two months out. */
export const BOOKING_LOOKAHEAD_DAYS = 60;

function isPastToday(start: string): boolean {
  const now = new Date();
  const [hour, minute] = start.split(':').map(Number);
  const slot = new Date(now);
  slot.setHours(hour, minute, 0, 0);
  return slot.getTime() <= now.getTime();
}

export function getBookableSlots(
  weeklySlots: WeeklySlot[],
  appointments: Appointment[],
  days = BOOKING_LOOKAHEAD_DAYS,
): BookableSlot[] {
  const booked = new Set(appointments.map((item) => `${item.date}|${item.start}`));
  const results: BookableSlot[] = [];
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  for (let offset = 0; offset < days; offset += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + offset);
    const isoDate = toIsoDate(date);
    const weekday = date.getDay() as WeeklySlot['weekday'];

    weeklySlots
      .filter((slot) => slot.weekday === weekday)
      .sort((a, b) => a.start.localeCompare(b.start))
      .forEach((slot) => {
        if (offset === 0 && isPastToday(slot.start)) {
          return;
        }
        if (booked.has(`${isoDate}|${slot.start}`)) {
          return;
        }
        results.push({
          id: `${isoDate}-${slot.start}`,
          date: isoDate,
          weekday,
          start: slot.start,
          end: addHour(slot.start),
        });
      });
  }

  return results;
}
