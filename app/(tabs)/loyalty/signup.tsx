import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

import {
  Banner,
  Card,
  Field,
  PageIntro,
  PrimaryButton,
  Screen,
  SecondaryButton,
} from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
import { isValidEmail, isValidYear, newId } from '@/lib/format';
import type { Vehicle } from '@/lib/types';

type VehicleDraft = { key: string; year: string; make: string; model: string };

function toDraft(vehicle: Vehicle): VehicleDraft {
  return { key: vehicle.id, year: vehicle.year, make: vehicle.make, model: vehicle.model };
}

export default function LoyaltySignupScreen() {
  const router = useRouter();
  const { profile, saveMember } = useAppState();
  const isEdit = Boolean(profile);

  const [name, setName] = useState(profile?.name ?? '');
  const [email, setEmail] = useState(profile?.email ?? '');
  const [vehicles, setVehicles] = useState<VehicleDraft[]>(
    profile?.vehicles.map(toDraft) ?? [{ key: newId(), year: '', make: '', model: '' }],
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validVehicles = useMemo(
    () =>
      vehicles.filter(
        (item) => isValidYear(item.year) && item.make.trim().length > 1 && item.model.trim().length > 1,
      ),
    [vehicles],
  );

  const canSave =
    name.trim().length > 1 && isValidEmail(email) && validVehicles.length > 0 && !saving;

  const updateVehicle = (key: string, patch: Partial<VehicleDraft>) => {
    setVehicles((current) => current.map((item) => (item.key === key ? { ...item, ...patch } : item)));
  };

  const onSave = async () => {
    if (!canSave) {
      setError('Add your name, a real email, and at least one complete vehicle.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await saveMember({
        name,
        email,
        signedUpAt: profile?.signedUpAt,
        vehicles: validVehicles.map((item) => ({
          id: item.key,
          year: item.year.trim(),
          make: item.make.trim(),
          model: item.model.trim(),
        })),
      });
      router.replace('/loyalty/confirmation');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen>
        <PageIntro
          eyebrow={isEdit ? 'Update account' : 'Loyalty signup'}
          title={isEdit ? 'Keep your info current' : 'Tell Joe who you are'}
          body="Name, email, and the vehicles you bring in. Nothing leaves this phone in v1."
        />

        <Field label="Your name" value={name} onChangeText={setName} placeholder="Jordan Hale" autoCapitalize="words" />
        <Field
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        {vehicles.map((vehicle, index) => (
          <Card key={vehicle.key}>
            <Text style={styles.cardTitle}>Vehicle {index + 1}</Text>
            <View style={{ gap: spacing.md }}>
              <Field
                label="Year"
                value={vehicle.year}
                onChangeText={(year) => updateVehicle(vehicle.key, { year })}
                keyboardType="number-pad"
                maxLength={4}
                placeholder="2018"
              />
              <Field
                label="Make"
                value={vehicle.make}
                onChangeText={(make) => updateVehicle(vehicle.key, { make })}
                placeholder="Chevrolet"
              />
              <Field
                label="Model"
                value={vehicle.model}
                onChangeText={(model) => updateVehicle(vehicle.key, { model })}
                placeholder="Silverado"
              />
            </View>
            {vehicles.length > 1 ? (
              <SecondaryButton
                title="Remove this vehicle"
                onPress={() => setVehicles((current) => current.filter((item) => item.key !== vehicle.key))}
              />
            ) : null}
          </Card>
        ))}

        <SecondaryButton
          title="Add another vehicle"
          onPress={() =>
            setVehicles((current) => [...current, { key: newId(), year: '', make: '', model: '' }])
          }
        />

        {error ? <Banner tone="warn">{error}</Banner> : null}

        <PrimaryButton
          title={isEdit ? 'Save account' : 'Create account'}
          onPress={() => {
            void onSave();
          }}
          disabled={!canSave}
          loading={saving}
        />
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
});
