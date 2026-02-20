import type { TFunction } from 'i18next';

export const formatDuration = (days: number, t: TFunction): string => {
  if (days >= 365 && days % 365 === 0) {
    return t('memberships.plans.duration.year', { count: days / 365 });
  }
  if (days >= 30 && days % 30 === 0) {
    return t('memberships.plans.duration.month', { count: days / 30 });
  }
  if (days >= 7 && days % 7 === 0) {
    return t('memberships.plans.duration.week', { count: days / 7 });
  }
  return t('memberships.plans.duration.day', { count: days });
};

export const formatPrice = (price: number): string => {
  return `${price} RON`;
};
