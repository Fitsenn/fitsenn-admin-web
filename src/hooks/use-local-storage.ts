import { useCallback, useSyncExternalStore } from 'react';

const useLocalStorage = (key: string, initialValue: string) => {
  const getSnapshot = (): string => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    const stored = localStorage.getItem(key);
    return stored ?? initialValue;
  };

  const subscribe = (callback: () => void) => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        callback();
      }
    };

    const handleCustomEvent = () => {
      callback();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(`local-storage-${key}`, handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(`local-storage-${key}`, handleCustomEvent);
    };
  };

  const value = useSyncExternalStore(subscribe, getSnapshot, () => initialValue);

  const setValue = useCallback(
    (newValue: string) => {
      localStorage.setItem(key, newValue);
      window.dispatchEvent(new Event(`local-storage-${key}`));
    },
    [key],
  );

  return [value, setValue];
};

export { useLocalStorage };
