import React from 'react';
import { useSelector } from 'react-redux';

function LoadingOverlay() {
  const isLoading = useSelector(state => state.app.isLoading);

  if (!isLoading) return (null);
  
  return (
    <div className="loading-overlay" />
  );
}

export default LoadingOverlay;
