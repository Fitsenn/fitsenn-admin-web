import { z } from 'zod'

export const formSchema = z.object({
  // Required text field
  name: z
    .string()
    .min(1, 'validation.nameRequired')
    .max(100, 'validation.nameTooLong'),

  // Required email field
  email: z
    .string()
    .min(1, 'validation.emailRequired')
    .email('validation.emailInvalid'),

  // Optional field
  phone: z.string().optional(),

  // Number field
  age: z
    .number()
    .min(18, 'validation.ageTooYoung')
    .max(120, 'validation.ageTooOld'),

  // Boolean field
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'validation.mustAcceptTerms' }),
  }),

  // Enum field
  role: z.enum(['admin', 'user', 'guest'], {
    errorMap: () => ({ message: 'validation.invalidRole' }),
  }),
})

export type FormData = z.infer<typeof formSchema>
