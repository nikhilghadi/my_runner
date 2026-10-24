import React from 'react';
import ScreenContainer from '../components/common/ScreenContainer';
import EmptyState from '../components/common/EmptyState';

export default function SettingsScreen() {
  return (
    <ScreenContainer>
      <EmptyState title="Settings" message="Pace range, alerts and backup." />
    </ScreenContainer>
  );
}