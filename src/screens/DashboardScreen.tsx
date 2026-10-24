import React from 'react';
import ScreenContainer from '../components/common/ScreenContainer';
import EmptyState from '../components/common/EmptyState';

export default function DashboardScreen() {
  return (
    <ScreenContainer>
      <EmptyState title="Dashboard" message="Progress charts coming soon" />
    </ScreenContainer>
  );
}