import { z } from 'zod';

export const DISCOUNT_TYPE_OPTIONS = [
  { value: 'percentage', labelKey: 'memberships.discounts.discountType.percentage' },
  { value: 'fixed', labelKey: 'memberships.discounts.discountType.fixed' },
] as const;

const discountFormBaseSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  discountType: z.enum(['percentage', 'fixed'], {
    errorMap: () => ({ message: 'Discount type is required' }),
  }),
  discountValue: z
    .number({ required_error: 'Discount value is required' })
    .positive('Discount value should be a positive number'),
  planIds: z.array(z.string()).nullish(),
  isAllPlans: z.boolean(),
  startsAt: z.string().min(1, 'Start time is required'),
  endsAt: z.string().nullish(),
  isIndefinite: z.boolean(),
  isActive: z.boolean(),
});

export const discountFormSchema = discountFormBaseSchema.superRefine(({ isIndefinite, endsAt, isAllPlans, planIds }, ctx) => {
  if (!isIndefinite && (!endsAt || endsAt.length === 0)) {
    ctx.addIssue({
      code: 'custom',
      message: 'End date is required unless indefinite',
      path: ['endsAt'],
    });
  }
  if (!isAllPlans && (!planIds || planIds.length === 0)) {
    ctx.addIssue({
      code: 'custom',
      message: 'Select at least one plan or enable all plans',
      path: ['planIds'],
    });
  }
});

export type DiscountFormData = z.infer<typeof discountFormBaseSchema>;
