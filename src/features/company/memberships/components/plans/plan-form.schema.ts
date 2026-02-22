import { z } from 'zod';

export const PLAN_TYPE_OPTIONS = [
  { value: 'unlimited', labelKey: 'memberships.plans.type.unlimited' },
  { value: 'sessions', labelKey: 'memberships.plans.type.sessions' },
] as const;

export const DURATION_UNIT_OPTIONS = [
  { value: 'days', labelKey: 'memberships.plans.form.durationUnits.days' },
  { value: 'weeks', labelKey: 'memberships.plans.form.durationUnits.weeks' },
  { value: 'months', labelKey: 'memberships.plans.form.durationUnits.months' },
  { value: 'years', labelKey: 'memberships.plans.form.durationUnits.years' },
] as const;

export const TIER_OPTIONS = [
  { value: 'standard', label: 'Standard' },
  { value: 'gold', label: 'Gold' },
  { value: 'platinum', label: 'Platinum' },
] as const;

const planFormBaseSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  description: z.string().max(500).nullish(),
  type: z.enum(['unlimited', 'sessions'], {
    errorMap: () => ({ message: 'Plan type is required' }),
  }),
  locationId: z.string().uuid().nullish(),
  duration: z
    .number({ required_error: 'Duration is required' })
    .positive('Duration should be a positive number'),
  durationUnit: z.enum(['days', 'weeks', 'months', 'years'], {
    errorMap: () => ({ message: 'Duration unit is required' }),
  }),
  sessionsCount: z.number().min(1).nullish(),
  price: z
    .number({ required_error: 'Price is required' })
    .positive('Price should be a positive number'),
  comparePrice: z.number().min(0).nullish(),
  tiers: z.array(z.string()).nullish(),
  maxFreezeDays: z
    .number({ required_error: 'Max freeze days is required' })
    .positive('Max freeze days should be a positive number'),
  maxFreezeCount: z
    .number({ required_error: 'Max freeze count is required' })
    .positive('Max freeze count should be a positive number'),
  isActive: z.boolean(),
});

export const planFormSchema = planFormBaseSchema
  .refine(
    (data) => data.type !== 'sessions' || (data.sessionsCount != null && data.sessionsCount > 0),
    { message: 'Sessions count is required for session-based plans', path: ['sessionsCount'] },
  )
  .refine((data) => !data.comparePrice || data.comparePrice > data.price, {
    message: 'Compare price must be higher than price',
    path: ['comparePrice'],
  });

export type PlanFormData = z.infer<typeof planFormBaseSchema>;
