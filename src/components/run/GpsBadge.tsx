import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSize } from '../../theme';
import { GPS_MAX_ACCURACY_M } from '../../utils/constants';

export default function GpsBadge({ accuracy }: { accuracy: number | null }) {
  let label = 'Searching GPS…';
  let color = colors.warning;

  if (accuracy != null) {
    const m = Math.round(accuracy);
    if (accuracy <= 10) {
      label = `GPS good (±${m} m)`;
      color = colors.primary;
    } else if (accuracy <= GPS_MAX_ACCURACY_M) {
      label = `GPS okay (±${m} m)`;
      color = colors.warning;
    } else {
      label = `GPS weak (±${m} m)`;
      color = colors.danger;
    }
  }

  return (
    <View style={styles.wrap}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: spacing.sm },
  text: { color: colors.textMuted, fontSize: fontSize.sm },
});