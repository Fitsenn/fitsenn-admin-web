import { z } from 'zod';

export const generalFormSchema = z.object({
  name: z.string().min(1, 'companySettings.general.validation.nameRequired'),
  code: z
    .string()
    .min(1, 'companySettings.general.validation.codeRequired')
    .regex(/^[a-zA-Z0-9_-]+$/, 'companySettings.general.validation.codeFormat'),
});

export type GeneralFormData = z.infer<typeof generalFormSchema>;
