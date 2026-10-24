import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Lap } from '../../engine/RunSession';
import { colors, spacing, fontSize, fontWeight } from '../../theme';
import { formatPace, formatDuration, formatDistanceKm } from '../../utils/format';

export default function SplitsList({ laps }: { laps: Lap[] }) {
  if (laps.length === 0) return null;
  return (
    <View>
      <Text style={styles.heading}>Splits</Text>
      {[...laps].reverse().map((l) => (
        <View key={l.index} style={styles.row}>
          <Text style={styles.label}>
            {l.distanceM >= 1000 ? `Km ${l.index}` : `${formatDistanceKm(l.distanceM)} km`}
          </Text>
          <Text style={styles.pace}>{formatPace(l.paceSecPerKm)} /km</Text>
          <Text style={styles.time}>{formatDuration(l.durationSec)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { color: colors.textMuted, fontSize: fontSize.sm, marginBottom: spacing.sm },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  label: { color: colors.text, fontSize: fontSize.md, flex: 1 },
  pace: { color: colors.text, fontSize: fontSize.md, fontWeight: fontWeight.medium, flex: 1, textAlign: 'center' },
  time: { color: colors.textMuted, fontSize: fontSize.md, flex: 1, textAlign: 'right' },
});