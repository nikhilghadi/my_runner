import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, fontWeight } from '../../theme';
import { formatDuration } from '../../utils/format';

export default function TimerDisplay({ seconds }: { seconds: number }) {
  return <Text style={styles.time}>{formatDuration(seconds)}</Text>;
}

const styles = StyleSheet.create({
  time: {
    color: colors.text,
    fontSize: fontSize.huge,
    fontWeight: fontWeight.bold,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
    marginVertical: spacing.lg,
  },
});