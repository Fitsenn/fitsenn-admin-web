---
name: creating-forms
description: Creates forms with React Hook Form, Zod validation, and proper UX. Use when building forms, adding validation, or handling user input. Triggers on requests for forms, validation schemas, or input handling.
---

# Creating Forms

## Schema Pattern

```typescript
// login-form.schema.ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, 'auth.validation.emailRequired').email('auth.validation.emailInvalid'),
  password: z.string().min(1, 'auth.validation.passwordRequired').min(8, 'auth.validation.passwordTooShort'),
})

export type LoginFormData = z.infer<typeof loginSchema>
```

## Form Component Pattern

```typescript
// login-form.tsx
import { Button, Stack } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { FormRHF } from '@/components/form/form'
import { InputRHF } from '@/components/form/input'

import { loginSchema, type LoginFormData } from './login-form.schema'

type LoginFormProps = {
  onSubmit: (data: LoginFormData) => Promise<void>
}

const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const { t } = useTranslation()
  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  return (
    <FormRHF methods={methods} onSubmit={onSubmit}>
      <Stack gap={4}>
        <InputRHF name="email" label={t('auth.email')} type="email" />
        <InputRHF name="password" label={t('auth.password')} type="password" />
        <Button type="submit" colorPalette="brand" loading={methods.formState.isSubmitting}>
          {t('auth.logIn')}
        </Button>
      </Stack>
    </FormRHF>
  )
}

export { LoginForm }
```

## Critical Rules

1. **Separate schema files** - Always `.schema.ts`
2. **Use `FormRHF`** wrapper component
3. **Use form components** from `@/components/form`
4. **Localize error messages** - Use translation keys in schema
5. **Handle loading** - Show loading on submit button

## File Structure

```
features/[feature]/components/
├── [form-name].schema.ts   # Zod schema
└── [form-name].tsx         # Form component
```

## Templates

- **Schema template**: See [templates/schema.ts](templates/schema.ts)
- **Form template**: See [templates/form.tsx](templates/form.tsx)

## Checklist

- [ ] Schema in separate `.schema.ts` file
- [ ] Type inferred via `z.infer<typeof schema>`
- [ ] Uses `FormRHF` wrapper
- [ ] Error messages are translation keys
- [ ] Submit button shows loading state
- [ ] `defaultValues` provided to `useForm`
