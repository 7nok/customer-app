import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { Banner, Card, PageIntro, PrimaryButton, Screen, SecondaryButton } from '@/components/ui';
import { colors } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
import { formatDateLong, formatTime, vehicleLabel } from '@/lib/format';

export default function BookingConfirmationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { appointments } = useAppState();
  const appointment = appointments.find((item) => item.id === id);

  if (!appointment) {
    return (
      <Screen>
        <PageIntro title="We could not find that booking" />
        <PrimaryButton title="Back to booking" onPress={() => router.replace('/book')} />
      </Screen>
    );
  }

  return (
    <Screen>
      <PageIntro
        eyebrow="Confirmed on this phone"
        title="You’re on the calendar"
        body="Joe does not get a text or email from this first version. Bring the details with you, or show him this screen."
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
      </Card>

      <Banner>
        Appointments are saved on this device only. If you delete the app, the booking list goes
        with it.
      </Banner>

      <PrimaryButton title="Back to home" onPress={() => router.replace('/')} />
      <SecondaryButton title="Book another visit" onPress={() => router.replace('/book')} />
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
