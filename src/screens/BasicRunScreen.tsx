import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useKeepAwake } from 'expo-keep-awake';

import ScreenContainer from '../components/common/ScreenContainer';
import EmptyState from '../components/common/EmptyState';
import AppButton from '../components/common/AppButton';
import BigStat from '../components/common/BigStat';
import GpsBadge from '../components/run/GpsBadge';
import TimerDisplay from '../components/run/TimerDisplay';
import RunControls from '../components/run/RunControls';
import SplitsList from '../components/run/SplitsList';
import PaceRangeSetting from '../components/run/PaceRangeSetting';
import AlertBanner from '../components/run/AlertBanner';
import { useRunSession } from '../hooks/useRunSession';
import { isGpsReady } from '../engine/geo';
import { formatDistanceKm, formatPace } from '../utils/format';
import { spacing } from '../theme';

export default function BasicRunScreen() {
  useKeepAwake();
  const nav = useNavigation();
  const insets = useSafeAreaInsets();
  const { snapshot, gpsAccuracy, permission, lastAlert, start, pause, resume, stop } =
    useRunSession();
  const status = snapshot.status;

  useEffect(() => {
    return nav.addListener('beforeRemove', (e) => {
      if (status !== 'running' && status !== 'paused') return;
      e.preventDefault();
      Alert.alert('Leave run?', 'Your current run will be lost.', [
        { text: 'Keep running', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => nav.dispatch(e.data.action) },
      ]);
    });
  }, [nav, status]);

  const confirmStop = () =>
    Alert.alert('Stop run?', 'This will end your run.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Stop', style: 'destructive', onPress: () => stop() },
    ]);

  if (permission === 'denied') {
    return (
      <ScreenContainer>
        <EmptyState
          title="Location needed"
          message="Allow location access so the app can measure distance and pace."
        />
        <AppButton title="Open settings" onPress={() => Linking.openSettings()} />
      </ScreenContainer>
    );
  }

  const showBanner = lastAlert && status === 'running' && Date.now() - lastAlert.at < 6000;

  return (
    <ScreenContainer style={{ paddingBottom: insets.bottom + spacing.md }}>
      <GpsBadge accuracy={gpsAccuracy} />
      {showBanner ? <AlertBanner kind={lastAlert.kind} /> : null}
      <TimerDisplay seconds={snapshot.elapsedSec} />

      <View style={styles.statsRow}>
        <BigStat label="Distance" value={formatDistanceKm(snapshot.distanceM)} unit="km" />
        <BigStat label="Avg pace" value={formatPace(snapshot.avgPace)} unit="/km" />
        <BigStat label="Pace now" value={formatPace(snapshot.currentPace)} unit="/km" />
      </View>

      <ScrollView style={styles.middle}>
        {status === 'idle' ? <PaceRangeSetting /> : <SplitsList laps={snapshot.laps} />}
      </ScrollView>

      <RunControls
        status={status}
        canStart={permission === 'granted' && isGpsReady(gpsAccuracy)}
        onStart={start}
        onPause={pause}
        onResume={resume}
        onStop={confirmStop}
        onDone={() => nav.goBack()}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  statsRow: { flexDirection: 'row', marginBottom: spacing.lg },
  middle: { flex: 1, marginBottom: spacing.md },
});