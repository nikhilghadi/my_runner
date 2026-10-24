import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme';
import { RootStackParamList } from './types';
import TabNavigator from './TabNavigator';
import BasicRunScreen from '../screens/BasicRunScreen';
import IntervalSetupScreen from '../screens/IntervalSetupScreen';
import IntervalRunScreen from '../screens/IntervalRunScreen';
import RunDetailScreen from '../screens/RunDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="BasicRun" component={BasicRunScreen} options={{ title: 'Basic Run' }} />
      <Stack.Screen name="IntervalSetup" component={IntervalSetupScreen} options={{ title: 'Interval Setup' }} />
      <Stack.Screen name="IntervalRun" component={IntervalRunScreen} options={{ title: 'Interval Run', headerBackVisible: false }} />
      <Stack.Screen name="RunDetail" component={RunDetailScreen} options={{ title: 'Run Details' }} />
    </Stack.Navigator>
  );
}