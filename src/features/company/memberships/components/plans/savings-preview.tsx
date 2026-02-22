import type { Control } from 'react-hook-form';
import type { PlanFormData } from './plan-form.schema';

import { Text } from '@chakra-ui/react';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const calculateSavingsPercent = (price: number, comparePrice: number): number => {
  if (comparePrice <= 0) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
};

const SavingsPreview = ({ control }: { control: Control<PlanFormData> }) => {
  const { t } = useTranslation();
  const price = useWatch({ control, name: 'price' });
  const comparePrice = useWatch({ control, name: 'comparePrice' });

  const savingsPercent =
    typeof price === 'number' && typeof comparePrice === 'number' && comparePrice > price
      ? calculateSavingsPercent(price, comparePrice)
      : 0;

  if (savingsPercent <= 0) return null;

  return (
    <Text fontSize="sm" color="green.500" fontWeight="medium">
      {t('memberships.plans.form.savingsPreview', { percent: savingsPercent })}
    </Text>
  );
};

export { SavingsPreview };
