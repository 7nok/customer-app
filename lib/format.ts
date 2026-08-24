import { WEEKDAYS } from '@/constants/availability';
import type { WeeklySlot } from '@/lib/types';

export function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function formatTime(hhmm: string): string {
  const [hourText, minuteText] = hhmm.split(':');
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, '0')} ${suffix}`;
}

export function addHour(hhmm: string): string {
  const [hourText, minuteText] = hhmm.split(':');
  const next = (Number(hourText) + 1) % 24;
  return `${String(next).padStart(2, '0')}:${minuteText}`;
}

export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateLong(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidYear(value: string): boolean {
  const year = Number(value.trim());
  const max = new Date().getFullYear() + 1;
  return Number.isInteger(year) && year >= 1970 && year <= max;
}

export function bookingGaps(input: {
  year: string;
  make: string;
  model: string;
  notes: string;
  hasSlot: boolean;
}): string[] {
  const gaps: string[] = [];
  if (!isValidYear(input.year)) {
    gaps.push('a 4-digit vehicle year');
  }
  if (input.make.trim().length < 2) {
    gaps.push('the vehicle make');
  }
  if (input.model.trim().length < 2) {
    gaps.push('the vehicle model');
  }
  if (input.notes.trim().length < 2) {
    gaps.push('a short note about the concern');
  }
  if (!input.hasSlot) {
    gaps.push('an open time');
  }
  return gaps;
}

export function vehicleLabel(year: string, make: string, model: string): string {
  return `${year} ${make} ${model}`.trim();
}

export function summarizeHours(slots: WeeklySlot[]): { day: string; hours: string }[] {
  return WEEKDAYS.map(({ value, label }) => {
    const starts = slots
      .filter((slot) => slot.weekday === value)
      .map((slot) => slot.start)
      .sort();

    if (starts.length === 0) {
      return { day: label, hours: 'Closed' };
    }

    const ranges: string[] = [];
    let rangeStart = starts[0];
    let previous = starts[0];

    const flush = (endStart: string) => {
      ranges.push(`${formatTime(rangeStart)} – ${formatTime(addHour(endStart))}`);
    };

    for (let index = 1; index < starts.length; index += 1) {
      const current = starts[index];
      if (current !== addHour(previous)) {
        flush(previous);
        rangeStart = current;
      }
      previous = current;
    }
    flush(previous);

    return { day: label, hours: ranges.join(', ') };
  });
}
