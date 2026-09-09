import { useLocalSearchParams, useRouter } from 'expo-router';
import { Linking, StyleSheet, Text } from 'react-native';

import { Banner, Card, PageIntro, PrimaryButton, Screen, SecondaryButton } from '@/components/ui';
import { shop } from '@/constants/shop';
import { colors } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
import { appointmentStatusLabel, formatDateLong, formatTime, vehicleLabel } from '@/lib/format';

export default function BookingConfirmationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { appointments } = useAppState();
  const appointment = appointments.find((item) => item.id === id);

  if (!appointment) {
    return (
      <Screen>
        <PageIntro title="We could not find that request" />
        <PrimaryButton title="Back to booking" onPress={() => router.replace('/book')} />
      </Screen>
    );
  }

  return (
    <Screen>
      <PageIntro
        eyebrow={appointmentStatusLabel(appointment.status)}
        title="Request sent"
        body={`${shop.bookingPendingNote} Joe does not get a text or email from this first version — text him if you want a faster yes.`}
      />

      <Card>
        <Text style={styles.label}>When</Text>
        <Text style={styles.value}>
          {formatDateLong(appointment.date)}
          {'\n'}
          {formatTime(appointment.start)} – {formatTime(appointment.end)}
        </Text>
        <Text style={styles.label}>Vehicle</Text>
        <Text style={styles.value}>
          {vehicleLabel(appointment.year, appointment.make, appointment.model)}
        </Text>
        <Text style={styles.label}>Concern</Text>
        <Text style={styles.value}>{appointment.notes}</Text>
        <Text style={styles.label}>Status</Text>
        <Text style={styles.value}>{appointmentStatusLabel(appointment.status)}</Text>
      </Card>

      <Banner>
        Appointments are saved on this device only. If you delete the app, the request list goes
        with it.
      </Banner>

      <PrimaryButton
        title={`Text Joe  ${shop.phoneDisplay}`}
        onPress={() => {
          void Linking.openURL(shop.smsUrl);
        }}
      />
      <PrimaryButton title="Back to home" onPress={() => router.replace('/')} />
      <SecondaryButton title="Request another visit" onPress={() => router.replace('/book')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.amberDeep,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  value: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 24,
  },
});
