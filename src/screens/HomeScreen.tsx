import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenContainer from '../components/common/ScreenContainer';
import AppButton from '../components/common/AppButton';
import { colors, spacing, fontSize, fontWeight } from '../theme';
import { RootStackParamList } from '../navigation/types';

export default function HomeScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ScreenContainer>
      <Text style={styles.heading}>Ready to run?</Text>
      <View style={styles.buttons}>
        <AppButton title="Basic Run" onPress={() => nav.navigate('BasicRun')} />
        <AppButton
          title="Interval Training"
          variant="secondary"
          onPress={() => nav.navigate('IntervalSetup')}
        />
      </View>
      {/* Last run summary card will go here later */}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heading: { color: colors.text, fontSize: fontSize.xl, fontWeight: fontWeight.bold, marginTop: spacing.lg },
  buttons: { marginTop: spacing.xl, gap: spacing.md },
});