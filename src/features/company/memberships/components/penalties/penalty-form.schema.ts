import { z } from 'zod';

export const TRIGGER_TYPE_OPTIONS = [
  { value: 'no_show', labelKey: 'memberships.penalties.triggerType.no_show' },
  { value: 'late_cancel', labelKey: 'memberships.penalties.triggerType.late_cancel' },
] as const;

const penaltyFormBaseSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  triggerType: z.enum(['no_show', 'late_cancel'], {
    errorMap: () => ({ message: 'Trigger type is required' }),
  }),
  triggerCount: z
    .number({ required_error: 'Trigger count is required' })
    .positive('Trigger count should be a positive number'),
  triggerWindowDays: z
    .number({ required_error: 'Time window is required' })
    .positive('Time window should be a positive number'),
  banDays: z
    .number({ required_error: 'Ban duration is required' })
    .positive('Ban duration should be a positive number'),
  planIds: z.array(z.string()).nullish(),
  isAllPlans: z.boolean(),
});

export const penaltyFormSchema = penaltyFormBaseSchema.superRefine(({ isAllPlans, planIds }, ctx) => {
  if (!isAllPlans && (!planIds || planIds.length === 0)) {
    ctx.addIssue({
      code: 'custom',
      message: 'Select at least one plan or enable all plans',
      path: ['planIds'],
    });
  }
});

export type PenaltyFormData = z.infer<typeof penaltyFormBaseSchema>;
