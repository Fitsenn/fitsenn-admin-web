import { z } from 'zod';

export const createUserMembershipSchema = z.object({
  planId: z.string().min(1, 'Plan is required'),
  startsAt: z.string().min(1, 'Start date is required'),
  pricePaid: z
    .number({ required_error: 'Price is required' })
    .min(0, 'Price must be zero or positive'),
  sessionsRemaining: z.number().min(0).nullish(),
  autoRenew: z.boolean(),
});

export type CreateUserMembershipFormData = z.infer<typeof createUserMembershipSchema>;

export const editUserMembershipSchema = z.object({
  sessionsRemaining: z.number().min(0).nullish(),
  endsAt: z.string().min(1, 'End date is required'),
  autoRenew: z.boolean(),
});

export type EditUserMembershipFormData = z.infer<typeof editUserMembershipSchema>;
