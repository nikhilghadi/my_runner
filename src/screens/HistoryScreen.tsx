import React from 'react';
import ScreenContainer from '../components/common/ScreenContainer';
import EmptyState from '../components/common/EmptyState';

export default function HistoryScreen() {
  return (
    <ScreenContainer>
      <EmptyState title="History" message="Your past runs will appear here." />
    </ScreenContainer>
  );
}