import React from 'react';
import { ScrollView } from 'react-native';
import ScreenContainer from '../components/common/ScreenContainer';
import PaceRangeSetting from '../components/run/PaceRangeSetting';

export default function SettingsScreen() {
  return (
    <ScreenContainer>
      <ScrollView>
        <PaceRangeSetting />
        {/* Backup and export will be added at the end */}
      </ScrollView>
    </ScreenContainer>
  );
}