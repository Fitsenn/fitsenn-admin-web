import { type ReactNode, useEffect, useState } from 'react';

import { useCompanyLocations } from '@/api/get-company-locations';
import { type LocationContextValue, LocationContext } from '@/contexts/location-context';
import { useCompany } from '@/hooks/use-company';

const STORAGE_KEY_PREFIX = 'fitsenn_selected_location_';

type LocationProviderProps = {
  children: ReactNode;
};

const LocationProvider = ({ children }: LocationProviderProps) => {
  const { selectedCompany } = useCompany();
  const companyId = selectedCompany?.id ?? '';

  const { data: locations = [], isLoading, isError } = useCompanyLocations({
    companyId,
    activeOnly: true,
  });

  const [selectedLocationId, setSelectedLocationIdState] = useState<string | null>(() => {
    if (typeof window !== 'undefined' && companyId) {
      return localStorage.getItem(`${STORAGE_KEY_PREFIX}${companyId}`);
    }
    return null;
  });

  const setSelectedLocationId = (locationId: string) => {
    setSelectedLocationIdState(locationId);
    if (companyId) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${companyId}`, locationId);
    }
  };

  // Load stored location when company changes
  useEffect(() => {
    if (companyId) {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${companyId}`);
      setSelectedLocationIdState(stored);
    }
  }, [companyId]);

  // Auto-select first location if none selected
  useEffect(() => {
    if (locations.length > 0 && !selectedLocationId) {
      const firstLocation = locations[0];
      setSelectedLocationId(firstLocation.id);
    }
  }, [locations, selectedLocationId]);

  // Reset if selected location no longer exists in current company
  useEffect(() => {
    if (
      locations.length > 0 &&
      selectedLocationId &&
      !locations.some((l) => l.id === selectedLocationId)
    ) {
      const firstLocation = locations[0];
      setSelectedLocationId(firstLocation.id);
    }
  }, [locations, selectedLocationId]);

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
