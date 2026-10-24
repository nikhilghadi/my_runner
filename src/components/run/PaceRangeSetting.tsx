import React from 'react';
import { View, Text, Switch, Pressable, StyleSheet } from 'react-native';
import NumberStepper from '../common/NumberStepper';
import { useSettingsStore } from '../../store/settingsStore';
import { formatPace } from '../../utils/format';
import { colors, spacing, radius, fontSize, fontWeight } from '../../theme';

export default function PaceRangeSetting() {
  const alert = useSettingsStore((s) => s.alert);
  const update = useSettingsStore((s) => s.updateAlert);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Pace alert</Text>
        <Switch
          value={alert.enabled}
          onValueChange={(v) => update({ enabled: v })}
          trackColor={{ true: colors.primary, false: colors.surfaceAlt }}
        />
      </View>

      {alert.enabled && (
        <>
          <NumberStepper
            label="Fastest allowed"
            value={alert.fastLimitSec}
            step={5}
            min={120}
            max={alert.slowLimitSec - 5}
            format={formatPace}
            unit=" /km"
            onChange={(v) => update({ fastLimitSec: v })}
          />
          <NumberStepper
            label="Slowest allowed"
            value={alert.slowLimitSec}
            step={5}
            min={alert.fastLimitSec + 5}
            max={900}
            format={formatPace}
            unit=" /km"
            onChange={(v) => update({ slowLimitSec: v })}
          />

          <View style={styles.segment}>
            {(['average', 'current'] as const).map((src) => (
              <Pressable
                key={src}
                onPress={() => update({ source: src })}
                style={[styles.segBtn, alert.source === src && styles.segActive]}
              >
                <Text style={[styles.segText, alert.source === src && styles.segTextActive]}>
                  {src === 'average' ? 'Average pace' : 'Current pace'}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.hint}>
            Beeps when your {alert.source === 'average' ? 'average' : 'current (last 15 s)'} pace
            goes outside this range. Alerts start after 30 s and 100 m.
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: colors.text, fontSize: fontSize.lg, fontWeight: fontWeight.bold },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    marginTop: spacing.sm,
    padding: 4,
  },
  segBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: radius.sm },
  segActive: { backgroundColor: colors.primary },
  segText: { color: colors.textMuted, fontSize: fontSize.md },
  segTextActive: { color: colors.primaryText, fontWeight: fontWeight.bold },
  hint: { color: colors.textMuted, fontSize: fontSize.sm, marginTop: spacing.sm },
});