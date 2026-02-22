import { DateTime } from 'luxon';

import { useLocalStorage } from './use-local-storage';

const DEFAULT_TIMEZONE = 'Europe/Bucharest';

export const DATE_FORMATS = {
  SHORT_DATE: 'dd-MM-yyyy',
  LONG_DATE: 'd MMMM, yyyy',
  TIME: 'HH:mm',
  FULL_DATE_TIME: 'dd-MM-yyyy HH:mm',
};

const useDateHelpers = () => {
  const [timezone, setTimezone] = useLocalStorage('timezone', DEFAULT_TIMEZONE);

  const dateFormatHelper = (seconds: number, format: keyof typeof DATE_FORMATS) => {
    return DateTime.fromSeconds(seconds, { zone: timezone }).toFormat(DATE_FORMATS[format]);
  };

  return { timezone, setTimezone, dateFormatHelper };
};

export { useDateHelpers };
