import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { DEFAULT_WEEKLY_SLOTS } from '@/constants/availability';
import { addHour, newId } from '@/lib/format';
import { getBookableSlots } from '@/lib/slots';
import {
  loadAppointments,
  loadProfile,
  loadWeeklySlots,
  saveAppointments,
  saveProfile,
  saveWeeklySlots,
} from '@/lib/storage';
import type { Appointment, BookableSlot, Profile, WeeklySlot } from '@/lib/types';

export type BookingDraft = {
  year: string;
  make: string;
  model: string;
  notes: string;
  customerName?: string;
  slot: BookableSlot;
};

type AppStateValue = {
  ready: boolean;
  profile: Profile | null;
  appointments: Appointment[];
  weeklySlots: WeeklySlot[];
  upcomingAppointments: Appointment[];
  bookableSlots: BookableSlot[];
  saveMember: (profile: Omit<Profile, 'signedUpAt'> & { signedUpAt?: string }) => Promise<Profile>;
  clearMember: () => Promise<void>;
  bookAppointment: (draft: BookingDraft) => Promise<Appointment>;
  cancelAppointment: (id: string) => Promise<void>;
  setWeeklySlots: (slots: WeeklySlot[]) => Promise<void>;
  restoreDefaultHours: () => Promise<void>;
};

const AppStateContext = createContext<AppStateValue | null>(null);

function isUpcoming(appointment: Appointment): boolean {
  const now = new Date();
  const [hour, minute] = appointment.start.split(':').map(Number);
  const [year, month, day] = appointment.date.split('-').map(Number);
  const start = new Date(year, month - 1, day, hour, minute);
  return start.getTime() >= now.getTime() - 30 * 60 * 1000;
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [weeklySlots, setWeeklySlotsState] = useState<WeeklySlot[]>(DEFAULT_WEEKLY_SLOTS);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [nextProfile, nextAppointments, nextSlots] = await Promise.all([
        loadProfile(),
        loadAppointments(),
        loadWeeklySlots(),
      ]);
      if (cancelled) {
        return;
      }
      setProfile(nextProfile);
      setAppointments(nextAppointments);
      setWeeklySlotsState(nextSlots);
      setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<AppStateValue>(() => {
    const upcomingAppointments = appointments.filter(isUpcoming);
    const bookableSlots = getBookableSlots(weeklySlots, appointments);

    return {
      ready,
      profile,
      appointments,
      weeklySlots,
      upcomingAppointments,
      bookableSlots,
      saveMember: async (input) => {
        const next: Profile = {
          name: input.name.trim(),
          email: input.email.trim(),
          vehicles: input.vehicles,
          signedUpAt: input.signedUpAt ?? new Date().toISOString(),
        };
        await saveProfile(next);
        setProfile(next);
        return next;
      },
      clearMember: async () => {
        await saveProfile(null);
        setProfile(null);
      },
      bookAppointment: async (draft) => {
        const taken = appointments.some(
          (item) => item.date === draft.slot.date && item.start === draft.slot.start,
        );
        if (taken) {
          throw new Error('That time was just booked. Please pick another slot.');
        }
        const appointment: Appointment = {
          id: newId(),
          createdAt: new Date().toISOString(),
          date: draft.slot.date,
          start: draft.slot.start,
          end: draft.slot.end ?? addHour(draft.slot.start),
          year: draft.year.trim(),
          make: draft.make.trim(),
          model: draft.model.trim(),
          notes: draft.notes.trim(),
          customerName: draft.customerName?.trim() || profile?.name,
        };
        const next = [...appointments, appointment].sort((a, b) =>
          `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`),
        );
        await saveAppointments(next);
        setAppointments(next);
        return appointment;
      },
      cancelAppointment: async (id) => {
        const next = appointments.filter((item) => item.id !== id);
        await saveAppointments(next);
        setAppointments(next);
      },
      setWeeklySlots: async (slots) => {
        await saveWeeklySlots(slots);
        setWeeklySlotsState(slots);
      },
      restoreDefaultHours: async () => {
        await saveWeeklySlots(DEFAULT_WEEKLY_SLOTS);
        setWeeklySlotsState(DEFAULT_WEEKLY_SLOTS);
      },
    };
  }, [appointments, profile, ready, weeklySlots]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateValue {
  const value = useContext(AppStateContext);
  if (!value) {
    throw new Error('useAppState must be used inside AppStateProvider');
  }
  return value;
}
