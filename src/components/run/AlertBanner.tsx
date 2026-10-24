import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { AlertKind } from '../../engine/PaceAlertChecker';
import { colors, spacing, radius, fontSize, fontWeight } from '../../theme';

export default function AlertBanner({ kind }: { kind: AlertKind }) {
  const slow = kind === 'too_slow';
  return (
    <Text style={[styles.banner, { backgroundColor: slow ? colors.warning : colors.info }]}>
      {slow ? 'Too slow: pick it up' : 'Too fast: ease off'}
    </Text>
  );
}

const styles = StyleSheet.create({
  banner: {
    color: '#000',
    textAlign: 'center',
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
});