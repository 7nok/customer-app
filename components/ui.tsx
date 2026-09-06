import type { ComponentProps, ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { colors, radius, spacing } from '@/constants/theme';
import { useWideLayout } from '@/hooks/use-wide-layout';

export function Screen({
  children,
  scroll = true,
  padded = true,
  footer,
}: {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  footer?: ReactNode;
}) {
  const body = (
    <View style={[styles.screenInner, padded && styles.screenPad]}>{children}</View>
  );

  return (
    <SafeAreaView style={styles.screen} edges={['left', 'right']}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, footer ? styles.scrollWithFooter : null]}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}>
          {body}
        </ScrollView>
      ) : (
        body
      )}
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </SafeAreaView>
  );
}

export function PageIntro({
  eyebrow,
  title,
  body,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
}) {
  const wide = useWideLayout(400);
  return (
    <View style={styles.intro}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={[styles.title, !wide && styles.titleNarrow]}>{title}</Text>
      {body ? <Text style={styles.introBody}>{body}</Text> : null}
    </View>
  );
}

export function Card({
  children,
  style,
  onPress,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.card, style, pressed && styles.pressed]}>
        {children}
      </Pressable>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
}

export function PrimaryButton({
  title,
  onPress,
  disabled,
  loading,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  const isBusy = Boolean(loading);
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => {
        if (isBusy) {
          return;
        }
        onPress();
      }}
      style={({ pressed }) => [
        styles.primary,
        disabled && !isBusy && styles.primaryMuted,
        isBusy && styles.disabled,
        pressed && !isBusy && styles.pressed,
      ]}>
      {isBusy ? (
        <ActivityIndicator color={colors.navy} />
      ) : (
        <Text style={styles.primaryLabel}>{title}</Text>
      )}
    </Pressable>
  );
}

export function SecondaryButton({
  title,
  onPress,
  disabled,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.secondary,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}>
      <Text style={styles.secondaryLabel}>{title}</Text>
    </Pressable>
  );
}

export function Field({
  label,
  hint,
  ...inputProps
}: TextInputProps & { label: string; hint?: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.muted}
        style={[styles.input, inputProps.multiline && styles.multiline]}
        {...inputProps}
        onChange={(event) => {
          inputProps.onChange?.(event);
          const next = event.nativeEvent.text;
          if (typeof next === 'string') {
            inputProps.onChangeText?.(next);
          }
        }}
      />
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

export function Banner({
  tone = 'info',
  children,
}: {
  tone?: 'info' | 'warn' | 'success';
  children: ReactNode;
}) {
  const palette = {
    info: { bg: colors.cardWarm, fg: colors.text },
    warn: { bg: colors.warnSoft, fg: colors.warn },
    success: { bg: colors.successSoft, fg: colors.success },
  }[tone];

  return (
    <View style={[styles.banner, { backgroundColor: palette.bg }]}>
      <Text style={[styles.bannerText, { color: palette.fg }]}>{children}</Text>
    </View>
  );
}

export function ListRow({
  title,
  subtitle,
  onPress,
  icon,
}: {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  icon?: IconName;
}) {
  const content = (
    <>
      {icon ? (
        <View style={styles.rowIcon}>
          <Icon name={icon} color={colors.text} size={20} />
        </View>
      ) : null}
      <View style={styles.rowCopy}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>
      {onPress ? <Icon name="chevron-forward" color={colors.muted} size={18} /> : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
        {content}
      </Pressable>
    );
  }

  return <View style={styles.row}>{content}</View>;
}

type IconName = ComponentProps<typeof Icon>['name'];

export function Chip({
  label,
  selected,
  onPress,
  disabled,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || !onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        disabled && styles.chipDisabled,
        pressed && !disabled && styles.pressed,
      ]}>
      <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>{label}</Text>
    </Pressable>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <Card>
      <Text style={styles.rowTitle}>{title}</Text>
      <Text style={[styles.rowSubtitle, { marginTop: 6 }]}>{body}</Text>
      {action ? <View style={{ marginTop: spacing.md }}>{action}</View> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    maxWidth: '100%',
    overflow: 'hidden',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 48,
  },
  scrollWithFooter: {
    paddingBottom: 24,
  },
  footer: {
    backgroundColor: colors.bg,
    borderTopColor: colors.line,
    borderTopWidth: 1,
    gap: spacing.sm,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  screenInner: {
    flexGrow: 1,
    gap: spacing.md,
  },
  screenPad: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  intro: {
    gap: 6,
    marginBottom: 4,
  },
  eyebrow: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '500',
    letterSpacing: -0.5,
  },
  titleNarrow: {
    fontSize: 24,
  },
  introBody: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
    gap: 10,
  },
  pressed: {
    opacity: 0.82,
  },
  primary: {
    alignItems: 'center',
    backgroundColor: colors.amber,
    borderRadius: radius.sm,
    cursor: 'pointer',
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  primaryMuted: {
    opacity: 0.78,
  },
  primaryLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  secondary: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: colors.line,
    borderRadius: radius.sm,
    borderWidth: 1,
    cursor: 'pointer',
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  secondaryLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '500',
  },
  disabled: {
    opacity: 0.45,
  },
  field: {
    gap: 6,
  },
  fieldLabel: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '500',
  },
  input: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: radius.sm,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  multiline: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  hint: {
    color: colors.muted,
    fontSize: 13,
  },
  banner: {
    borderRadius: radius.sm,
    padding: spacing.md,
  },
  bannerText: {
    fontSize: 14,
    lineHeight: 20,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    minHeight: 44,
    paddingVertical: 8,
  },
  rowIcon: {
    alignItems: 'center',
    backgroundColor: colors.amberSoft,
    borderRadius: 10,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  rowCopy: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  rowSubtitle: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  chip: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 999,
    borderWidth: 1,
    cursor: 'pointer',
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipSelected: {
    backgroundColor: colors.amber,
    borderColor: colors.amber,
  },
  chipDisabled: {
    opacity: 0.4,
  },
  chipLabel: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '500',
  },
  chipLabelSelected: {
    color: colors.white,
  },
});
