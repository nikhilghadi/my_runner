import React from 'react';
import ScreenContainer from '../components/common/ScreenContainer';
import EmptyState from '../components/common/EmptyState';

export default function RunDetailScreen() {
  return (
    <ScreenContainer>
      <EmptyState title="Run Detail" message="Details about your run will appear here." />
    </ScreenContainer>
  );
}