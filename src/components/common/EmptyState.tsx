import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, fontWeight } from '../../theme';

type Props = { title: string; message?: string };

export default function EmptyState({ title, message }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.msg}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  title: { color: colors.text, fontSize: fontSize.xl, fontWeight: fontWeight.bold },
  msg: { color: colors.textMuted, fontSize: fontSize.md, marginTop: spacing.sm, textAlign: 'center' },
});