import { createContext } from 'react';
import { WellnessContextType } from './WellnessContext';

export const WellnessContext = createContext<WellnessContextType | undefined>(undefined);