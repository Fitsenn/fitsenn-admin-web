import type { VisibilityState } from '@tanstack/react-table';

import { useEffect, useState } from 'react';

type UseTableStorageOptions = {
  storageKey: string;
  enabled?: boolean;
};

type UseTableStorageReturn = {
  columnVisibility: VisibilityState;
  setColumnVisibility: (state: VisibilityState) => void;
};

/**
 * Hook for persisting table column visibility in localStorage
 */
const useTableStorage = ({ storageKey, enabled = true }: UseTableStorageOptions): UseTableStorageReturn => {
  // Initialize state from localStorage or default to empty object
  const [columnVisibility, setColumnVisibilityState] = useState<VisibilityState>(() => {
    if (!enabled || typeof window === 'undefined') return {};

    try {
      const stored = localStorage.getItem(`table-${storageKey}-column-visibility`);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to load table state from localStorage:', error);
      return {};
    }
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    try {
      localStorage.setItem(`table-${storageKey}-column-visibility`, JSON.stringify(columnVisibility));
    } catch (error) {
      console.error('Failed to save table state to localStorage:', error);
    }
  }, [columnVisibility, storageKey, enabled]);

  // Wrapper to update state
  const setColumnVisibility = (state: VisibilityState) => {
    setColumnVisibilityState(state);
  };

  return {
    columnVisibility,
    setColumnVisibility,
  };
};

export { useTableStorage };
