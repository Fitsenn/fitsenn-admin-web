import type { LocationContextValue } from '@/contexts/location-context';
import type { ReactNode } from 'react';

import { useEffect } from 'react';

import { useCompanyLocations } from '@/api/get-company-locations';
import { LocationContext } from '@/contexts/location-context';
import { useCompany } from '@/hooks/use-company';
import { useLocalStorage } from '@/hooks/use-local-storage';

const STORAGE_KEY_PREFIX = 'fitsenn_selected_location_';

type LocationProviderProps = {
  children: ReactNode;
};

const LocationProvider = ({ children }: LocationProviderProps) => {
  const { selectedCompany } = useCompany();
  const companyId = selectedCompany?.id ?? '';

  const { data: locations = [], isLoading, isError } = useCompanyLocations({ companyId, activeOnly: true });

  // Dynamic key per company - hook automatically syncs when companyId changes
  const [selectedLocationId, setSelectedLocationId] = useLocalStorage(`${STORAGE_KEY_PREFIX}${companyId}`, '');

  // Auto-select first location if none selected or selected no longer exists
  useEffect(() => {
    const hasValidSelection = selectedLocationId && locations.some((l) => l.id === selectedLocationId);
    if (locations.length > 0 && !hasValidSelection) {
      setSelectedLocationId(locations[0].id);
    }
  }, [locations, selectedLocationId, setSelectedLocationId]);

  const selectedLocation = locations.find((l) => l.id === selectedLocationId) ?? null;

  const value: LocationContextValue = {
    locations,
    selectedLocation,
    setSelectedLocationId,
    isLoading,
    isError,
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};

export { LocationProvider };
