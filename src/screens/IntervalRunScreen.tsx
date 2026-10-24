import React from 'react';
import ScreenContainer from '../components/common/ScreenContainer';
import EmptyState from '../components/common/EmptyState';

export default function IntervalRunScreen() {
  return (
    <ScreenContainer>
      <EmptyState title="Interval Run" message="Your interval run will appear here." />
    </ScreenContainer>
  );
}