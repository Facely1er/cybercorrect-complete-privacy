import { useContext } from 'react';
import JourneyContext, { type JourneyContextType } from './JourneyContext';

export const useJourney = (): JourneyContextType => {
  const context = useContext(JourneyContext);
  if (context === undefined) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return context;
};

export default useJourney;

