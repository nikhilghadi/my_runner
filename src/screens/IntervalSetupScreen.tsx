import React from 'react';
import ScreenContainer from '../components/common/ScreenContainer';
import EmptyState from '../components/common/EmptyState';

export default function IntervalSetupScreen() {
  return (
    <ScreenContainer>
      <EmptyState title="Interval Setup" message="Configure your interval training settings." />
    </ScreenContainer>
  );
}