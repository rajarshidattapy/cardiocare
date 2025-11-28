import { useContext } from 'react';
import { WellnessContext } from './WellnessContext';

export const useWellness = () => {
  const context = useContext(WellnessContext);
  if (!context) {
    throw new Error('useWellness must be used within a WellnessProvider');
  }
  return context;
};