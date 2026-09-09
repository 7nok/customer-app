import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

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
import { shop } from '@/constants/shop';
import { colors, spacing } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
import {
  appointmentStatusLabel,
  bookingGaps,
  formatDate,
  formatTime,
  vehicleLabel,
} from '@/lib/format';
import { BOOKING_LOOKAHEAD_DAYS } from '@/lib/slots';
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
  const [attempted, setAttempted] = useState(false);

  const selectedVehicle = profile?.vehicles.find((item) => item.id === selectedVehicleId) ?? null;
  const usingSavedVehicle = Boolean(selectedVehicle);

  const groupedSlots = useMemo(() => groupSlots(bookableSlots), [bookableSlots]);
  const selectedSlot = bookableSlots.find((slot) => slot.id === selectedSlotId) ?? null;

  const effectiveYear = usingSavedVehicle ? selectedVehicle!.year : year;
  const effectiveMake = usingSavedVehicle ? selectedVehicle!.make : make;
  const effectiveModel = usingSavedVehicle ? selectedVehicle!.model : model;

  const gaps = bookingGaps({
    year: effectiveYear,
    make: effectiveMake,
    model: effectiveModel,
    notes,
    hasSlot: Boolean(selectedSlot),
  });
  const canSubmit = gaps.length === 0;

  const applyVehicle = (vehicle: Vehicle | null) => {
    setSelectedVehicleId(vehicle?.id ?? null);
    if (vehicle) {
      setYear(vehicle.year);
      setMake(vehicle.make);
      setModel(vehicle.model);
    }
  };

  const onBook = async () => {
    setAttempted(true);
    if (!selectedSlot || !canSubmit) {
      Alert.alert('A few details are missing', `Please add ${gaps.join(', ')}.`);
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
    <Screen
      footer={
        <PrimaryButton
          title={
            selectedSlot
              ? `Request ${formatDate(selectedSlot.date)} at ${formatTime(selectedSlot.start)}`
              : 'Request appointment'
          }
          onPress={() => {
            void onBook();
          }}
          loading={submitting}
        />
      }>
        <PageIntro
          eyebrow="Appointments"
          title="Request a time with Joe"
          body={`${shop.bookingPendingNote} ${shop.bookingWindowNote} ${shop.checkoverNote} Year, make, model, and a short note stay on this device.`}
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
                  <Text style={styles.muted}>{appointmentStatusLabel(item.status)}</Text>
                  <Text style={styles.muted}>
                    {vehicleLabel(item.year, item.make, item.model)}
                  </Text>
                </View>
                <SecondaryButton
                  title="Cancel"
                  onPress={() =>
                    Alert.alert('Cancel this visit?', 'The slot will open back up on this device.', [
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
                keyboardType="numeric"
                placeholder="YYYY"
                maxLength={4}
              />
              <Field label="Make" value={make} onChangeText={setMake} placeholder="e.g. Ford" />
              <Field
                label="Model"
                value={model}
                onChangeText={setModel}
                placeholder="e.g. F-150"
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
          placeholder="Squeal, leak, inspection, or whatever you are noticing"
          multiline
        />

        <Card>
          <Text style={styles.sectionTitle}>Open times</Text>
          <Text style={styles.muted}>
            These are Joe’s posted windows for about the next {Math.round(BOOKING_LOOKAHEAD_DAYS / 30)}{' '}
            months (Central Time). Same-day can appear when a window is still open today. Requests stay
            pending until Joe confirms. Daily Drivin comes to you in {shop.serviceArea}.
          </Text>
          {bookableSlots.length === 0 ? (
            <EmptyState
              title="No open slots right now"
              body="Joe may have no open windows on this device, or the weekly board needs an update."
              action={
                <SecondaryButton
                  title="Review appointment windows"
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

        {attempted && gaps.length > 0 ? (
          <Banner tone="warn">Still needed: {gaps.join(', ')}.</Banner>
        ) : null}
      </Screen>
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
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
    marginTop: 4,
  },
  visit: {
    alignItems: 'stretch',
    flexDirection: 'column',
    gap: 10,
  },
  visitWhen: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
});
