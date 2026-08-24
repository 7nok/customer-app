import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

import {
  Banner,
  Card,
  Chip,
  EmptyState,
  Field,
  PageIntro,
  PrimaryButton,
  Screen,
  SecondaryButton,
} from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
import { formatDate, formatTime, isValidYear, vehicleLabel } from '@/lib/format';
import type { BookableSlot, Vehicle } from '@/lib/types';

export default function BookScreen() {
  const router = useRouter();
  const { profile, bookableSlots, upcomingAppointments, bookAppointment, cancelAppointment } =
    useAppState();

  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    profile?.vehicles[0]?.id ?? null,
  );
  const [submitting, setSubmitting] = useState(false);

  const selectedVehicle = profile?.vehicles.find((item) => item.id === selectedVehicleId) ?? null;
  const usingSavedVehicle = Boolean(selectedVehicle);

  const groupedSlots = useMemo(() => groupSlots(bookableSlots), [bookableSlots]);
  const selectedSlot = bookableSlots.find((slot) => slot.id === selectedSlotId) ?? null;

  const effectiveYear = usingSavedVehicle ? selectedVehicle!.year : year;
  const effectiveMake = usingSavedVehicle ? selectedVehicle!.make : make;
  const effectiveModel = usingSavedVehicle ? selectedVehicle!.model : model;

  const canSubmit =
    Boolean(selectedSlot) &&
    isValidYear(effectiveYear) &&
    effectiveMake.trim().length > 1 &&
    effectiveModel.trim().length > 1 &&
    notes.trim().length > 3;

  const applyVehicle = (vehicle: Vehicle | null) => {
    setSelectedVehicleId(vehicle?.id ?? null);
    if (vehicle) {
      setYear(vehicle.year);
      setMake(vehicle.make);
      setModel(vehicle.model);
    }
  };

  const onBook = async () => {
    if (!selectedSlot || !canSubmit) {
      return;
    }
    setSubmitting(true);
    try {
      const appointment = await bookAppointment({
        year: effectiveYear,
        make: effectiveMake,
        model: effectiveModel,
        notes,
        customerName: profile?.name,
        slot: selectedSlot,
      });
      setNotes('');
      setSelectedSlotId(null);
      router.push({ pathname: '/book/confirmation', params: { id: appointment.id } });
    } catch (error) {
      Alert.alert('Could not book', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen>
        <PageIntro
          eyebrow="Appointments"
          title="Book a time with Joe"
          body="Choose an open slot, tell us about the vehicle, and describe what is going on. This stays on your phone for now — no payments or texts yet."
        />

        {upcomingAppointments.length > 0 ? (
          <Card>
            <Text style={styles.sectionTitle}>On the calendar</Text>
            {upcomingAppointments.map((item) => (
              <View key={item.id} style={styles.visit}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.visitWhen}>
                    {formatDate(item.date)} · {formatTime(item.start)}–{formatTime(item.end)}
                  </Text>
                  <Text style={styles.muted}>
                    {vehicleLabel(item.year, item.make, item.model)}
                  </Text>
                </View>
                <SecondaryButton
                  title="Cancel"
                  onPress={() =>
                    Alert.alert('Cancel this visit?', 'The slot will open back up on this phone.', [
                      { text: 'Keep it', style: 'cancel' },
                      {
                        text: 'Cancel visit',
                        style: 'destructive',
                        onPress: () => {
                          void cancelAppointment(item.id);
                        },
                      },
                    ])
                  }
                />
              </View>
            ))}
          </Card>
        ) : null}

        <Card>
          <Text style={styles.sectionTitle}>Vehicle</Text>
          {profile?.vehicles.length ? (
            <View style={styles.chipRow}>
              {profile.vehicles.map((vehicle) => (
                <Chip
                  key={vehicle.id}
                  label={vehicleLabel(vehicle.year, vehicle.make, vehicle.model)}
                  selected={selectedVehicleId === vehicle.id}
                  onPress={() => applyVehicle(vehicle)}
                />
              ))}
              <Chip
                label="Different vehicle"
                selected={!usingSavedVehicle}
                onPress={() => applyVehicle(null)}
              />
            </View>
          ) : null}
          {!usingSavedVehicle ? (
            <View style={{ gap: spacing.md }}>
              <Field
                label="Year"
                value={year}
                onChangeText={setYear}
                keyboardType="number-pad"
                placeholder="2016"
                maxLength={4}
              />
              <Field label="Make" value={make} onChangeText={setMake} placeholder="Ford" />
              <Field
                label="Model"
                value={model}
                onChangeText={setModel}
                placeholder="F-150"
              />
            </View>
          ) : (
            <Text style={styles.muted}>
              Using {vehicleLabel(selectedVehicle!.year, selectedVehicle!.make, selectedVehicle!.model)} from
              your loyalty account. Pick “Different vehicle” to type another one.
            </Text>
          )}
        </Card>

        <Field
          label="What is going on?"
          value={notes}
          onChangeText={setNotes}
          placeholder="Example: grind when braking, or due for an inspection"
          multiline
        />

        <Card>
          <Text style={styles.sectionTitle}>Open times</Text>
          <Text style={styles.muted}>
            Times follow Joe’s weekly availability and hide slots already booked on this phone.
            Shop is in Hillsboro, TX (Central Time).
          </Text>
          {bookableSlots.length === 0 ? (
            <EmptyState
              title="No open slots right now"
              body="Joe may be fully booked on this phone, or weekly hours need an update."
              action={
                <SecondaryButton
                  title="Review shop hours"
                  onPress={() => router.push('/availability')}
                />
              }
            />
          ) : (
            groupedSlots.map((group) => (
              <View key={group.date} style={{ gap: 8 }}>
                <Text style={styles.dayLabel}>{formatDate(group.date)}</Text>
                <View style={styles.chipRow}>
                  {group.slots.map((slot) => (
                    <Chip
                      key={slot.id}
                      label={`${formatTime(slot.start)}–${formatTime(slot.end)}`}
                      selected={selectedSlotId === slot.id}
                      onPress={() => setSelectedSlotId(slot.id)}
                    />
                  ))}
                </View>
              </View>
            ))
          )}
        </Card>

        {!canSubmit ? (
          <Banner tone="warn">
            Add the vehicle year, make, model, a short note, and a time before booking.
          </Banner>
        ) : null}

        <PrimaryButton
          title={
            selectedSlot
              ? `Book ${formatDate(selectedSlot.date)} at ${formatTime(selectedSlot.start)}`
              : 'Book appointment'
          }
          onPress={() => {
            void onBook();
          }}
          disabled={!canSubmit}
          loading={submitting}
        />
      </Screen>
    </KeyboardAvoidingView>
  );
}

function groupSlots(slots: BookableSlot[]): { date: string; slots: BookableSlot[] }[] {
  const map = new Map<string, BookableSlot[]>();
  slots.forEach((slot) => {
    const list = map.get(slot.date) ?? [];
    list.push(slot);
    map.set(slot.date, list);
  });
  return [...map.entries()].map(([date, group]) => ({ date, slots: group }));
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  muted: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayLabel: {
    color: colors.navy,
    fontSize: 15,
    fontWeight: '800',
    marginTop: 4,
  },
  visit: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  visitWhen: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
});
