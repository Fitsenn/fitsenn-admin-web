import { createContext } from 'react';

import type { Location } from '@/types/location';

export type LocationContextValue = {
  locations: Location[];
  selectedLocation: Location | null;
  setSelectedLocationId: (locationId: string) => void;
  isLoading: boolean;
  isError: boolean;
};

export const LocationContext = createContext<LocationContextValue | null>(null);
