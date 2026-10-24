import { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  Home: undefined;
  History: undefined;
  Dashboard: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  BasicRun: undefined;
  IntervalSetup: undefined;
  IntervalRun: { distanceM: number; laps: number; restSec: number };
  RunDetail: { runId: number };
};