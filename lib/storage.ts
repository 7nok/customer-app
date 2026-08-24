import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_WEEKLY_SLOTS } from '@/constants/availability';
import type { Appointment, Profile, WeeklySlot } from '@/lib/types';

const KEYS = {
  profile: '@joes/profile',
  appointments: '@joes/appointments',
  weeklySlots: '@joes/weeklySlots',
} as const;

async function readJson<T>(key: string, fallback: T): Promise<T> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) {
    return fallback;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function loadProfile(): Promise<Profile | null> {
  return readJson<Profile | null>(KEYS.profile, null);
}

export async function saveProfile(profile: Profile | null): Promise<void> {
  if (!profile) {
    await AsyncStorage.removeItem(KEYS.profile);
    return;
  }
  await AsyncStorage.setItem(KEYS.profile, JSON.stringify(profile));
}

export async function loadAppointments(): Promise<Appointment[]> {
  const items = await readJson<Appointment[]>(KEYS.appointments, []);
  return items.sort((a, b) => `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`));
}

export async function saveAppointments(appointments: Appointment[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.appointments, JSON.stringify(appointments));
}

export async function loadWeeklySlots(): Promise<WeeklySlot[]> {
  return readJson<WeeklySlot[]>(KEYS.weeklySlots, DEFAULT_WEEKLY_SLOTS);
}

export async function saveWeeklySlots(slots: WeeklySlot[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.weeklySlots, JSON.stringify(slots));
}
