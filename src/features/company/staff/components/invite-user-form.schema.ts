import { z } from 'zod';

export const inviteUserFormSchema = z.object({
  email: z
    .string()
    .min(1, 'companySettings.users.invite.validation.emailRequired')
    .email('companySettings.users.invite.validation.emailInvalid'),
});

export type InviteUserFormData = z.infer<typeof inviteUserFormSchema>;
