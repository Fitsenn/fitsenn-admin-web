import type { Location } from '@/types/location';

import { createContext, useContext } from 'react';

type LocationContextValue = {
  locations: Location[];
  selectedLocation: Location | null;
  setSelectedLocationId: (locationId: string) => void;
  isLoading: boolean;
  isError: boolean;
};

const LocationContext = createContext<LocationContextValue | null>(null);

const useLocation = () => {
  const context = useContext(LocationContext);

  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }

  return context;
};

export { LocationContext, useLocation };
export type { LocationContextValue };
