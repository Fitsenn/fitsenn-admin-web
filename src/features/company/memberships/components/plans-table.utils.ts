import type { TFunction } from 'i18next';

const unitTranslationMap: Record<string, string> = {
  days: 'memberships.plans.duration.day',
  weeks: 'memberships.plans.duration.week',
  months: 'memberships.plans.duration.month',
  years: 'memberships.plans.duration.year',
};

export const formatDuration = (duration: number, durationUnit: string, t: TFunction): string => {
  const key = unitTranslationMap[durationUnit] ?? 'memberships.plans.duration.day';
  return t(key, { count: duration });
};

export const formatPrice = (price: number): string => {
  return `${price} RON`;
};
