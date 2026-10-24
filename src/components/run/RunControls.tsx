import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppButton from '../common/AppButton';
import { RunStatus } from '../../engine/RunSession';
import { spacing } from '../../theme';

type Props = {
  status: RunStatus;
  canStart: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onDone: () => void;
};

export default function RunControls(p: Props) {
  if (p.status === 'idle') {
    return (
      <AppButton
        title={p.canStart ? 'Start' : 'Waiting for GPS…'}
        onPress={p.onStart}
        disabled={!p.canStart}
      />
    );
  }
  if (p.status === 'finished') {
    return <AppButton title="Done" onPress={p.onDone} />;
  }
  return (
    <View style={styles.row}>
      {p.status === 'running' ? (
        <AppButton title="Pause" variant="secondary" onPress={p.onPause} style={styles.btn} />
      ) : (
        <AppButton title="Resume" onPress={p.onResume} style={styles.btn} />
      )}
      <AppButton title="Stop" variant="danger" onPress={p.onStop} style={styles.btn} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md },
  btn: { flex: 1 },
});