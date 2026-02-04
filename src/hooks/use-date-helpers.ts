import { useLocalStorage } from './use-local-storage';

const DEFAULT_TIMEZONE = 'Europe/Bucharest';

const useDateHelpers = () => {
  const [timezone, setTimezone] = useLocalStorage('timezone', DEFAULT_TIMEZONE);

  return { timezone, setTimezone };
};

export { useDateHelpers };
