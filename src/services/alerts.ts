import { Vibration } from 'react-native';
import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from 'expo-audio';
import { AlertKind } from '../engine/PaceAlertChecker';

const sources = {
  too_slow: require('../assets/sounds/alert_slow.wav'),
  too_fast: require('../assets/sounds/alert_fast.wav'),
};

const vibration: Record<AlertKind, number[]> = {
  too_slow: [0, 400, 200, 400],
  too_fast: [0, 150, 100, 150, 100, 150],
};

const players: Partial<Record<AlertKind, AudioPlayer>> = {};
let audioModeSet = false;

async function ensureAudioMode() {
  if (audioModeSet) return;
  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'duckOthers',        // lower music while the beep plays
      interruptionModeAndroid: 'duckOthers',
    });
  } catch (e) {
    console.warn('Could not set audio mode', e);
  }
  audioModeSet = true;
}

export async function playAlert(kind: AlertKind) {
  Vibration.vibrate(vibration[kind]);
  try {
    await ensureAudioMode();
    let player = players[kind];
    if (!player) {
      player = createAudioPlayer(sources[kind]);
      players[kind] = player;
    }
    await player.seekTo(0);
    player.play();
  } catch (e) {
    console.warn('Alert sound failed', e);
  }
}